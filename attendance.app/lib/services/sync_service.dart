import 'dart:async';
import 'dart:convert';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/models/sync_queue_model.dart';
import 'package:payclock/data/repositories/attendance_repository.dart';
import 'package:payclock/data/sources/local/local_database.dart';

/// Sync status states emitted by SyncService streams.
enum SyncStatus { online, offline, syncing, error }

/// Offline-first sync engine for attendance data.
///
/// GOLDEN RULE: The UI never waits for a network call.
/// Local SQLite save happens instantly.
/// Supabase sync runs in the background.
/// The user never sees a loading spinner for attendance marking.
class SyncService {
  SyncService._();

  static final SyncService instance = SyncService._();

  final AttendanceRepository _attendanceRepo = AttendanceRepository();

  final _statusController = StreamController<SyncStatus>.broadcast();
  final _pendingCountController = StreamController<int>.broadcast();

  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;

  bool _isFlushing = false;
  bool _interstitialShownThisSession = false;

  /// Stream of current sync status.
  Stream<SyncStatus> get statusStream => _statusController.stream;

  /// Stream of pending sync item count.
  Stream<int> get pendingCountStream => _pendingCountController.stream;

  bool get interstitialShownThisSession => _interstitialShownThisSession;
  void markInterstitialShown() => _interstitialShownThisSession = true;

  // ── Core: Mark Attendance with Offline-First Sync ─────────────────────────

  /// Saves attendance record to SQLite first (instant), then syncs to Supabase.
  /// NEVER throws on network failure — data is safe in SQLite queue.
  Future<void> markAttendanceWithSync(AttendanceModel record) async {
    // Step 1: Save to SQLite sync queue FIRST — never fails
    final queueItem = SyncQueueModel(
      action: 'upsert',
      tableName: 'attendance_records',
      payload: jsonEncode(record.toJson()),
      deviceTimestamp: DateTime.now().toUtc().toIso8601String(),
      retryCount: 0,
    );
    final insertedId =
        await LocalDatabase.instance.insertToQueue(queueItem);

    // Step 2: Cache for offline viewing
    await LocalDatabase.instance.upsertAttendance(record);

    // Step 3: Emit updated pending count
    final pendingCount =
        await LocalDatabase.instance.getPendingCount();
    _pendingCountController.add(pendingCount);

    // Step 4: If online, attempt immediate sync (fire and forget)
    if (await _isOnline()) {
      unawaited(_attemptImmediateSync(record, insertedId));
    }
  }

  Future<void> _attemptImmediateSync(
    AttendanceModel record,
    int queueId,
  ) async {
    try {
      _statusController.add(SyncStatus.syncing);
      await _attendanceRepo.markAttendance(record);
      await LocalDatabase.instance.markSynced(queueId);
      await LocalDatabase.instance.markCachedAsSynced(
        record.employeeId,
        record.date,
      );
      final pendingCount =
          await LocalDatabase.instance.getPendingCount();
      _pendingCountController.add(pendingCount);
      _statusController.add(
        pendingCount == 0 ? SyncStatus.online : SyncStatus.syncing,
      );
    } catch (e) {
      // Leave in queue — will retry when internet returns
      AppLogger.warning('Immediate sync failed — queued for retry', e);
      _statusController.add(SyncStatus.online);
    }
  }

  // ── Flush: Retry All Pending Items ────────────────────────────────────────

  /// Retries all pending sync queue items with exponential backoff.
  Future<void> flush() async {
    if (_isFlushing) return;
    _isFlushing = true;

    try {
      final pending = await LocalDatabase.instance.getPendingItems();
      if (pending.isEmpty) {
        _statusController.add(SyncStatus.online);
        _pendingCountController.add(0);
        _isFlushing = false;
        return;
      }

      _statusController.add(SyncStatus.syncing);
      AppLogger.info('Flushing ${pending.length} pending sync items');

      for (final item in pending) {
        if (item.hasExceededMaxRetries) {
          AppLogger.warning(
            'Sync item ${item.id} exceeded max retries — skipping',
          );
          continue;
        }

        try {
          final payload =
              jsonDecode(item.payload) as Map<String, dynamic>;
          final record = AttendanceModel.fromJson(payload);
          await _attendanceRepo.markAttendance(record);
          await LocalDatabase.instance.markSynced(item.id!);
          await LocalDatabase.instance.markCachedAsSynced(
            record.employeeId,
            record.date,
          );
          AppLogger.debug('Synced item ${item.id}');
        } catch (e) {
          await LocalDatabase.instance.incrementRetry(item.id!);
          // Exponential backoff: delay = min(2^retryCount, 60) seconds
          final delaySeconds =
              (1 << item.retryCount).clamp(1, 60);
          AppLogger.warning(
            'Sync item ${item.id} failed (retry ${item.retryCount}). '
            'Next retry in ${delaySeconds}s',
            e,
          );
          await Future<void>.delayed(Duration(seconds: delaySeconds));
        }
      }

      final remainingCount =
          await LocalDatabase.instance.getPendingCount();
      _pendingCountController.add(remainingCount);
      _statusController.add(
        remainingCount == 0 ? SyncStatus.online : SyncStatus.error,
      );

      // Housekeeping: clear old synced records
      await LocalDatabase.instance.clearSyncedItems();
    } catch (e, st) {
      AppLogger.error('flush error', e, st);
      _statusController.add(SyncStatus.error);
    } finally {
      _isFlushing = false;
    }
  }

  // ── Connectivity Listener ─────────────────────────────────────────────────

  /// Start listening for connectivity changes and auto-flush when online.
  void listenToConnectivity() {
    _connectivitySubscription?.cancel();
    _connectivitySubscription =
        Connectivity().onConnectivityChanged.listen((results) {
      final isOnline = results.any((r) => r != ConnectivityResult.none);

      if (!isOnline) {
        _statusController.add(SyncStatus.offline);
      } else {
        // Wait 2 seconds for connection to stabilize, then flush
        Future<void>.delayed(const Duration(seconds: 2), flush);
      }
    });

    AppLogger.info('SyncService connectivity listener started');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  Future<bool> _isOnline() async {
    try {
      final results = await Connectivity().checkConnectivity();
      return results.any((r) => r != ConnectivityResult.none);
    } catch (_) {
      return false;
    }
  }

  void dispose() {
    _connectivitySubscription?.cancel();
    _statusController.close();
    _pendingCountController.close();
  }
}

// ignore: prefer_void_to_null
void unawaited(Future<void> future) {
  future.catchError((Object e) => AppLogger.warning('Unawaited error', e));
}
