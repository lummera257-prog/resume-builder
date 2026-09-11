import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/repositories/attendance_repository.dart';
import 'package:payclock/data/sources/local/local_database.dart';
import 'package:payclock/services/sync_service.dart';

/// Repository provider
final attendanceRepoProvider = Provider<AttendanceRepository>(
  (_) => AttendanceRepository(),
);

/// Today's attendance notifier (family by companyId)
class TodayAttendanceNotifier
    extends FamilyAsyncNotifier<List<AttendanceModel>, String> {
  AttendanceRepository get _repo => ref.read(attendanceRepoProvider);

  @override
  Future<List<AttendanceModel>> build(String companyId) async {
    final today = _todayString();
    // Load from SQLite cache first (instant)
    final cached =
        await LocalDatabase.instance.getAttendanceForDate(today, companyId);
    if (cached.isNotEmpty) {
      // Fire-and-forget refresh from server
      _refreshFromServer(companyId, today);
      return cached;
    }
    // No cache — load from server
    return _loadFromServer(companyId, today);
  }

  Future<List<AttendanceModel>> _loadFromServer(
    String companyId,
    String date,
  ) async {
    try {
      return await _repo.getAttendanceForDate(
        companyId: companyId,
        date: date,
      );
    } catch (e) {
      AppLogger.warning('Server load failed, using cache', e);
      return LocalDatabase.instance.getAttendanceForDate(date, companyId);
    }
  }

  Future<void> _refreshFromServer(String companyId, String date) async {
    try {
      final fresh = await _repo.getAttendanceForDate(
        companyId: companyId,
        date: date,
      );
      if (state is AsyncData) {
        state = AsyncData(fresh);
      }
    } catch (_) {}
  }

  /// Marks attendance for a single employee — instant UI update.
  Future<void> markAttendance(AttendanceModel record) async {
    // Update local state IMMEDIATELY
    final current = state.value ?? [];
    final updated = [
      ...current.where((a) => a.employeeId != record.employeeId),
      record,
    ];
    state = AsyncData(updated);

    // Sync in background (never blocks UI)
    await SyncService.instance.markAttendanceWithSync(record);
  }

  /// Marks all employees with the same status.
  Future<void> markAll({
    required List<String> employeeIds,
    required AttendanceModel Function(String employeeId) recordBuilder,
  }) async {
    final records = employeeIds.map(recordBuilder).toList();
    state = AsyncData(records);
    for (final record in records) {
      await SyncService.instance.markAttendanceWithSync(record);
    }
  }

  Future<void> refresh(String companyId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadFromServer(companyId, _todayString()));
  }

  String _todayString() {
    final now = DateTime.now();
    return '${now.year.toString().padLeft(4, '0')}-'
        '${now.month.toString().padLeft(2, '0')}-'
        '${now.day.toString().padLeft(2, '0')}';
  }
}

final todayAttendanceProvider = AsyncNotifierProviderFamily<
    TodayAttendanceNotifier, List<AttendanceModel>, String>(
  TodayAttendanceNotifier.new,
);

/// Monthly attendance provider (family by companyId + month + year)
typedef MonthlyAttendanceParams = ({
  String companyId,
  int month,
  int year
});

final monthlyAttendanceProvider = FutureProvider.family<List<AttendanceModel>,
    MonthlyAttendanceParams>((ref, params) async {
  final repo = ref.read(attendanceRepoProvider);
  return repo.getMonthlyAttendance(
    companyId: params.companyId,
    month: params.month,
    year: params.year,
  );
});

/// Sync status provider (stream)
final syncStatusProvider = StreamProvider<SyncStatus>(
  (_) => SyncService.instance.statusStream,
);

/// Pending sync count provider (stream)
final pendingSyncCountProvider = StreamProvider<int>(
  (_) => SyncService.instance.pendingCountStream,
);
