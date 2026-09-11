import 'package:equatable/equatable.dart';
import 'package:payclock/domain/enums/leave_type.dart';

/// Leave request model — maps exactly to the `leave_requests` Supabase table.
class LeaveRequestModel extends Equatable {
  const LeaveRequestModel({
    required this.id,
    required this.employeeId,
    required this.companyId,
    required this.type,
    required this.startDate,
    required this.endDate,
    this.reason,
    this.status = 'pending',
    this.approvedBy,
    this.createdAt,
    // Enriched data (joined from employees table)
    this.employeeName,
    this.employeeCode,
    this.rejectionReason,
  });

  final String id;
  final String employeeId; // → 'employee_id'
  final String companyId; // → 'company_id'
  final LeaveType type;
  final String startDate; // → 'start_date' — YYYY-MM-DD
  final String endDate; // → 'end_date' — YYYY-MM-DD
  final String? reason;
  final String status; // 'pending' | 'approved' | 'rejected'
  final String? approvedBy; // → 'approved_by'
  final DateTime? createdAt; // → 'created_at'

  // Enriched (not in DB — filled from join)
  final String? employeeName;
  final String? employeeCode;
  final String? rejectionReason;

  // ── Serialization ──────────────────────────────────────────────────────────

  factory LeaveRequestModel.fromJson(Map<String, dynamic> json) =>
      LeaveRequestModel(
        id: json['id'] as String? ?? '',
        employeeId: json['employee_id'] as String? ?? '',
        companyId: json['company_id'] as String? ?? '',
        type: LeaveType.fromString(json['type'] as String? ?? 'casual'),
        startDate: json['start_date'] as String? ?? '',
        endDate: json['end_date'] as String? ?? '',
        reason: json['reason'] as String?,
        status: json['status'] as String? ?? 'pending',
        approvedBy: json['approved_by'] as String?,
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
        employeeName: json['employee_name'] as String?,
        employeeCode: json['employee_code'] as String?,
        rejectionReason: json['rejection_reason'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'employee_id': employeeId,
        'company_id': companyId,
        'type': type.toJson,
        'start_date': startDate,
        'end_date': endDate,
        if (reason != null) 'reason': reason,
        'status': status,
        if (approvedBy != null) 'approved_by': approvedBy,
        if (rejectionReason != null) 'rejection_reason': rejectionReason,
      };

  LeaveRequestModel copyWith({
    String? id,
    String? employeeId,
    String? companyId,
    LeaveType? type,
    String? startDate,
    String? endDate,
    String? reason,
    String? status,
    String? approvedBy,
    DateTime? createdAt,
    String? employeeName,
    String? employeeCode,
    String? rejectionReason,
  }) =>
      LeaveRequestModel(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        companyId: companyId ?? this.companyId,
        type: type ?? this.type,
        startDate: startDate ?? this.startDate,
        endDate: endDate ?? this.endDate,
        reason: reason ?? this.reason,
        status: status ?? this.status,
        approvedBy: approvedBy ?? this.approvedBy,
        createdAt: createdAt ?? this.createdAt,
        employeeName: employeeName ?? this.employeeName,
        employeeCode: employeeCode ?? this.employeeCode,
        rejectionReason: rejectionReason ?? this.rejectionReason,
      );

  // ── Computed Getters ───────────────────────────────────────────────────────

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isRejected => status == 'rejected';

  /// Duration in calendar days (inclusive).
  int get durationDays {
    final start = DateTime.tryParse(startDate);
    final end = DateTime.tryParse(endDate);
    if (start == null || end == null) return 1;
    return end.difference(start).inDays + 1;
  }

  // ── Equatable ──────────────────────────────────────────────────────────────

  @override
  List<Object?> get props => [
        id,
        employeeId,
        companyId,
        type,
        startDate,
        endDate,
        reason,
        status,
        approvedBy,
        createdAt,
        employeeName,
        employeeCode,
        rejectionReason,
      ];

  @override
  String toString() =>
      'LeaveRequestModel(id: $id, type: ${type.displayName}, status: $status)';
}
