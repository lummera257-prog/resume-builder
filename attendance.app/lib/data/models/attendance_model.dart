import 'package:equatable/equatable.dart';
import 'package:payclock/domain/enums/attendance_status.dart';

/// Attendance record — maps exactly to the `attendance_records` Supabase table.
class AttendanceModel extends Equatable {
  const AttendanceModel({
    required this.id,
    required this.employeeId,
    required this.companyId,
    required this.date,
    required this.status,
    this.checkIn,
    this.checkOut,
    this.overtimeHours = 0,
    this.deviceTimestamp,
    this.serverTimestamp,
    this.markedBy,
  });

  final String id;
  final String employeeId; // → 'employee_id'
  final String companyId; // → 'company_id'
  final String date; // → 'date' — YYYY-MM-DD string
  final AttendanceStatus status;
  final String? checkIn; // → 'check_in' — "HH:mm" format
  final String? checkOut; // → 'check_out'
  final double overtimeHours; // → 'overtime_hours'
  final DateTime? deviceTimestamp; // → 'device_timestamp'
  final DateTime? serverTimestamp; // → 'server_timestamp'
  final String? markedBy; // → 'marked_by' (auth.user UUID)

  // ── Serialization ──────────────────────────────────────────────────────────

  factory AttendanceModel.fromJson(Map<String, dynamic> json) =>
      AttendanceModel(
        id: json['id'] as String? ?? '',
        employeeId: json['employee_id'] as String? ?? '',
        companyId: json['company_id'] as String? ?? '',
        date: json['date'] as String? ?? '',
        status: AttendanceStatus.fromString(
          json['status'] as String? ?? 'absent',
        ),
        checkIn: json['check_in'] as String?,
        checkOut: json['check_out'] as String?,
        overtimeHours:
            (json['overtime_hours'] as num?)?.toDouble() ?? 0.0,
        deviceTimestamp:
            DateTime.tryParse(json['device_timestamp'] as String? ?? ''),
        serverTimestamp:
            DateTime.tryParse(json['server_timestamp'] as String? ?? ''),
        markedBy: json['marked_by'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'employee_id': employeeId,
        'company_id': companyId,
        'date': date,
        'status': status.toJson,
        if (checkIn != null) 'check_in': checkIn,
        if (checkOut != null) 'check_out': checkOut,
        'overtime_hours': overtimeHours,
        if (deviceTimestamp != null)
          'device_timestamp': deviceTimestamp!.toUtc().toIso8601String(),
        if (markedBy != null) 'marked_by': markedBy,
      };

  AttendanceModel copyWith({
    String? id,
    String? employeeId,
    String? companyId,
    String? date,
    AttendanceStatus? status,
    String? checkIn,
    String? checkOut,
    double? overtimeHours,
    DateTime? deviceTimestamp,
    DateTime? serverTimestamp,
    String? markedBy,
  }) =>
      AttendanceModel(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        companyId: companyId ?? this.companyId,
        date: date ?? this.date,
        status: status ?? this.status,
        checkIn: checkIn ?? this.checkIn,
        checkOut: checkOut ?? this.checkOut,
        overtimeHours: overtimeHours ?? this.overtimeHours,
        deviceTimestamp: deviceTimestamp ?? this.deviceTimestamp,
        serverTimestamp: serverTimestamp ?? this.serverTimestamp,
        markedBy: markedBy ?? this.markedBy,
      );

  // ── Computed Getters ───────────────────────────────────────────────────────

  /// Whether this record has been confirmed by the Supabase server.
  bool get isSynced => serverTimestamp != null;

  /// Salary multiplier for this status (delegates to AttendanceStatus).
  double get salaryMultiplier => status.salaryMultiplier;

  /// Date as a DateTime object (for calendar displays).
  DateTime? get dateAsDateTime => DateTime.tryParse(date);

  /// Whether overtime was recorded for this day.
  bool get hasOvertime => overtimeHours > 0;

  // ── Equatable ──────────────────────────────────────────────────────────────

  @override
  List<Object?> get props => [
        id,
        employeeId,
        companyId,
        date,
        status,
        checkIn,
        checkOut,
        overtimeHours,
        deviceTimestamp,
        serverTimestamp,
        markedBy,
      ];

  @override
  String toString() =>
      'AttendanceModel(employeeId: $employeeId, date: $date, status: ${status.displayName})';
}
