/// Sync queue model for SQLite offline queue.
/// Uses toMap/fromMap (not toJson/fromJson) because it's SQLite-only.
class SyncQueueModel {
  const SyncQueueModel({
    this.id,
    required this.action,
    required this.tableName,
    required this.payload,
    required this.deviceTimestamp,
    this.retryCount = 0,
    this.syncedAt,
  });

  /// SQLite auto-increment ID (null until inserted).
  final int? id;

  /// 'upsert' or 'delete'
  final String action;

  /// Supabase table name (e.g., 'attendance_records')
  final String tableName; // → 'table_name' in DB

  /// JSON-encoded string of the full record.
  final String payload;

  /// ISO8601 UTC timestamp of when the record was created on device.
  final String deviceTimestamp; // → 'device_timestamp'

  /// Number of failed sync attempts.
  final int retryCount; // → 'retry_count'

  /// ISO8601 UTC timestamp of when the record was confirmed synced.
  final String? syncedAt; // → 'synced_at'

  // ── SQLite Map Serialization ───────────────────────────────────────────────

  factory SyncQueueModel.fromMap(Map<String, dynamic> map) => SyncQueueModel(
        id: map['id'] as int?,
        action: map['action'] as String? ?? 'upsert',
        tableName: map['table_name'] as String? ?? '',
        payload: map['payload'] as String? ?? '{}',
        deviceTimestamp: map['device_timestamp'] as String? ??
            DateTime.now().toUtc().toIso8601String(),
        retryCount: map['retry_count'] as int? ?? 0,
        syncedAt: map['synced_at'] as String?,
      );

  Map<String, dynamic> toMap() => {
        if (id != null) 'id': id,
        'action': action,
        'table_name': tableName,
        'payload': payload,
        'device_timestamp': deviceTimestamp,
        'retry_count': retryCount,
        if (syncedAt != null) 'synced_at': syncedAt,
      };

  SyncQueueModel copyWith({
    int? id,
    String? action,
    String? tableName,
    String? payload,
    String? deviceTimestamp,
    int? retryCount,
    String? syncedAt,
  }) =>
      SyncQueueModel(
        id: id ?? this.id,
        action: action ?? this.action,
        tableName: tableName ?? this.tableName,
        payload: payload ?? this.payload,
        deviceTimestamp: deviceTimestamp ?? this.deviceTimestamp,
        retryCount: retryCount ?? this.retryCount,
        syncedAt: syncedAt ?? this.syncedAt,
      );

  bool get isSynced => syncedAt != null;
  bool get hasExceededMaxRetries => retryCount > 10;

  @override
  String toString() =>
      'SyncQueueModel(id: $id, action: $action, table: $tableName, retries: $retryCount)';
}
