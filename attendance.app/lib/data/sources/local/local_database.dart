import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/models/sync_queue_model.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// SQLite local database singleton.
/// Provides offline queue and cached attendance data.
class LocalDatabase {
  LocalDatabase._();

  static final LocalDatabase instance = LocalDatabase._();

  Database? _database;

  static const String _dbName = 'payclock_local.db';
  static const int _dbVersion = 1;

  // ── Table Names ────────────────────────────────────────────────────────────
  static const String tableSyncQueue = 'sync_queue';
  static const String tableCachedAttendance = 'cached_attendance';

  // ── Initialization ─────────────────────────────────────────────────────────

  Future<void> init() async {
    if (_database != null) return;
    try {
      final dbPath = await getDatabasesPath();
      final path = join(dbPath, _dbName);
      _database = await openDatabase(
        path,
        version: _dbVersion,
        onCreate: _onCreate,
        onUpgrade: _onUpgrade,
      );
      AppLogger.info('LocalDatabase initialized at $path');
    } catch (e, st) {
      AppLogger.error('LocalDatabase init failed', e, st);
      rethrow;
    }
  }

  Database get _db {
    if (_database == null) {
      throw const AppException(
        message: 'LocalDatabase not initialized. Call init() first.',
        code: 'DB_NOT_INIT',
      );
    }
    return _database!;
  }

  Future<void> _onCreate(Database db, int version) async {
    // Sync queue for offline-first attendance
    await db.execute('''
      CREATE TABLE $tableSyncQueue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        payload TEXT NOT NULL,
        device_timestamp TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        synced_at TEXT
      )
    ''');

    // Cached attendance for offline viewing
    await db.execute('''
      CREATE TABLE $tableCachedAttendance (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        company_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        check_in TEXT,
        check_out TEXT,
        overtime_hours REAL DEFAULT 0,
        synced INTEGER DEFAULT 0,
        UNIQUE(employee_id, date)
      )
    ''');

    AppLogger.info('LocalDatabase tables created (v$version)');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    AppLogger.info('LocalDatabase upgraded $oldVersion → $newVersion');
  }

  // ── Sync Queue Operations ──────────────────────────────────────────────────

  /// Inserts a record into the sync queue.
  Future<int> insertToQueue(SyncQueueModel item) async {
    return _db.insert(tableSyncQueue, item.toMap());
  }

  /// Returns all un-synced items ordered by oldest first.
  Future<List<SyncQueueModel>> getPendingItems() async {
    final rows = await _db.query(
      tableSyncQueue,
      where: 'synced_at IS NULL',
      orderBy: 'id ASC',
    );
    return rows.map(SyncQueueModel.fromMap).toList();
  }

  /// Marks a sync queue item as successfully synced.
  Future<void> markSynced(int id) async {
    await _db.update(
      tableSyncQueue,
      {'synced_at': DateTime.now().toUtc().toIso8601String()},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Increments the retry counter for a failed sync item.
  Future<void> incrementRetry(int id) async {
    await _db.rawUpdate(
      'UPDATE $tableSyncQueue SET retry_count = retry_count + 1 WHERE id = ?',
      [id],
    );
  }

  /// Deletes all synced items (housekeeping — call periodically).
  Future<void> clearSyncedItems() async {
    await _db.delete(
      tableSyncQueue,
      where: 'synced_at IS NOT NULL',
    );
  }

  /// Returns the count of un-synced items.
  Future<int> getPendingCount() async {
    final result = await _db.rawQuery(
      'SELECT COUNT(*) as count FROM $tableSyncQueue WHERE synced_at IS NULL',
    );
    return result.first['count'] as int? ?? 0;
  }

  // ── Cached Attendance Operations ───────────────────────────────────────────

  /// Inserts or replaces a cached attendance record.
  Future<void> upsertAttendance(AttendanceModel record) async {
    await _db.insert(
      tableCachedAttendance,
      {
        'id': record.id,
        'employee_id': record.employeeId,
        'company_id': record.companyId,
        'date': record.date,
        'status': record.status.toJson,
        if (record.checkIn != null) 'check_in': record.checkIn,
        if (record.checkOut != null) 'check_out': record.checkOut,
        'overtime_hours': record.overtimeHours,
        'synced': record.isSynced ? 1 : 0,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Returns all cached attendance records for a given date and company.
  Future<List<AttendanceModel>> getAttendanceForDate(
    String date,
    String companyId,
  ) async {
    final rows = await _db.query(
      tableCachedAttendance,
      where: 'date = ? AND company_id = ?',
      whereArgs: [date, companyId],
    );
    return rows.map(_cachedRowToModel).toList();
  }

  /// Returns all cached attendance records for a given employee.
  Future<List<AttendanceModel>> getAttendanceForEmployee(
    String employeeId,
  ) async {
    final rows = await _db.query(
      tableCachedAttendance,
      where: 'employee_id = ?',
      whereArgs: [employeeId],
      orderBy: 'date DESC',
    );
    return rows.map(_cachedRowToModel).toList();
  }

  /// Marks a specific cached attendance as synced.
  Future<void> markCachedAsSynced(String employeeId, String date) async {
    await _db.update(
      tableCachedAttendance,
      {'synced': 1},
      where: 'employee_id = ? AND date = ?',
      whereArgs: [employeeId, date],
    );
  }

  // ── Full Clear (used on account deletion) ──────────────────────────────────

  Future<void> clearAll() async {
    await _db.delete(tableSyncQueue);
    await _db.delete(tableCachedAttendance);
    AppLogger.info('LocalDatabase cleared all data');
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  AttendanceModel _cachedRowToModel(Map<String, dynamic> row) {
    return AttendanceModel(
      id: row['id'] as String? ?? '',
      employeeId: row['employee_id'] as String? ?? '',
      companyId: row['company_id'] as String? ?? '',
      date: row['date'] as String? ?? '',
      status: _parseStatus(row['status'] as String? ?? 'absent'),
      checkIn: row['check_in'] as String?,
      checkOut: row['check_out'] as String?,
      overtimeHours: (row['overtime_hours'] as num?)?.toDouble() ?? 0.0,
      serverTimestamp: (row['synced'] as int? ?? 0) == 1
          ? DateTime.now()
          : null, // Approximate
    );
  }

  AttendanceStatus _parseStatus(String status) {
    return AttendanceStatus.fromString(status);
  }

  /// Closes the database (call on app dispose).
  Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}
