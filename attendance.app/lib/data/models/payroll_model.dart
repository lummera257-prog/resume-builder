import 'package:equatable/equatable.dart';

/// Payroll record — maps exactly to the `payroll_records` Supabase table.
class PayrollModel extends Equatable {
  const PayrollModel({
    required this.id,
    required this.employeeId,
    required this.companyId,
    required this.month,
    required this.year,
    this.totalWorkingDays = 0,
    this.daysPresent = 0,
    this.halfDays = 0,
    this.paidLeaveDays = 0,
    this.unpaidLeaveDays = 0,
    this.overtimeHours = 0,
    this.baseSalary = 0,
    this.overtimePay = 0,
    this.manualBonus = 0,
    this.grossSalary = 0,
    this.unpaidDeduction = 0,
    this.netSalary = 0,
    this.payslipUrl,
    this.status = 'draft',
    this.createdAt,
    // Enriched from join
    this.employeeName,
    this.employeeCode,
    this.designation,
  });

  final String id;
  final String employeeId; // → 'employee_id'
  final String companyId; // → 'company_id'
  final int month;
  final int year;
  final double totalWorkingDays; // → 'total_working_days'
  final double daysPresent; // → 'days_present'
  final double halfDays; // → 'half_days'
  final double paidLeaveDays; // → 'paid_leave_days'
  final double unpaidLeaveDays; // → 'unpaid_leave_days'
  final double overtimeHours; // → 'overtime_hours'
  final double baseSalary; // → 'base_salary' (snapshot at time of calculation)
  final double overtimePay; // → 'overtime_pay'
  final double manualBonus; // → 'manual_bonus'
  final double grossSalary; // → 'gross_salary'
  final double unpaidDeduction; // → 'unpaid_deduction'
  final double netSalary; // → 'net_salary'
  final String? payslipUrl; // → 'payslip_url'
  final String status; // 'draft' | 'approved'
  final DateTime? createdAt; // → 'created_at'

  // Enriched
  final String? employeeName;
  final String? employeeCode;
  final String? designation;

  // ── Serialization ──────────────────────────────────────────────────────────

  factory PayrollModel.fromJson(Map<String, dynamic> json) => PayrollModel(
        id: json['id'] as String? ?? '',
        employeeId: json['employee_id'] as String? ?? '',
        companyId: json['company_id'] as String? ?? '',
        month: json['month'] as int? ?? 1,
        year: json['year'] as int? ?? DateTime.now().year,
        totalWorkingDays:
            (json['total_working_days'] as num?)?.toDouble() ?? 0.0,
        daysPresent: (json['days_present'] as num?)?.toDouble() ?? 0.0,
        halfDays: (json['half_days'] as num?)?.toDouble() ?? 0.0,
        paidLeaveDays: (json['paid_leave_days'] as num?)?.toDouble() ?? 0.0,
        unpaidLeaveDays:
            (json['unpaid_leave_days'] as num?)?.toDouble() ?? 0.0,
        overtimeHours: (json['overtime_hours'] as num?)?.toDouble() ?? 0.0,
        baseSalary: (json['base_salary'] as num?)?.toDouble() ?? 0.0,
        overtimePay: (json['overtime_pay'] as num?)?.toDouble() ?? 0.0,
        manualBonus: (json['manual_bonus'] as num?)?.toDouble() ?? 0.0,
        grossSalary: (json['gross_salary'] as num?)?.toDouble() ?? 0.0,
        unpaidDeduction:
            (json['unpaid_deduction'] as num?)?.toDouble() ?? 0.0,
        netSalary: (json['net_salary'] as num?)?.toDouble() ?? 0.0,
        payslipUrl: json['payslip_url'] as String?,
        status: json['status'] as String? ?? 'draft',
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
        employeeName: json['employee_name'] as String?,
        employeeCode: json['employee_code'] as String?,
        designation: json['designation'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'employee_id': employeeId,
        'company_id': companyId,
        'month': month,
        'year': year,
        'total_working_days': totalWorkingDays,
        'days_present': daysPresent,
        'half_days': halfDays,
        'paid_leave_days': paidLeaveDays,
        'unpaid_leave_days': unpaidLeaveDays,
        'overtime_hours': overtimeHours,
        'base_salary': baseSalary,
        'overtime_pay': overtimePay,
        'manual_bonus': manualBonus,
        'gross_salary': grossSalary,
        'unpaid_deduction': unpaidDeduction,
        'net_salary': netSalary,
        if (payslipUrl != null) 'payslip_url': payslipUrl,
        'status': status,
      };

  PayrollModel copyWith({
    String? id,
    String? employeeId,
    String? companyId,
    int? month,
    int? year,
    double? totalWorkingDays,
    double? daysPresent,
    double? halfDays,
    double? paidLeaveDays,
    double? unpaidLeaveDays,
    double? overtimeHours,
    double? baseSalary,
    double? overtimePay,
    double? manualBonus,
    double? grossSalary,
    double? unpaidDeduction,
    double? netSalary,
    String? payslipUrl,
    String? status,
    DateTime? createdAt,
    String? employeeName,
    String? employeeCode,
    String? designation,
  }) =>
      PayrollModel(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        companyId: companyId ?? this.companyId,
        month: month ?? this.month,
        year: year ?? this.year,
        totalWorkingDays: totalWorkingDays ?? this.totalWorkingDays,
        daysPresent: daysPresent ?? this.daysPresent,
        halfDays: halfDays ?? this.halfDays,
        paidLeaveDays: paidLeaveDays ?? this.paidLeaveDays,
        unpaidLeaveDays: unpaidLeaveDays ?? this.unpaidLeaveDays,
        overtimeHours: overtimeHours ?? this.overtimeHours,
        baseSalary: baseSalary ?? this.baseSalary,
        overtimePay: overtimePay ?? this.overtimePay,
        manualBonus: manualBonus ?? this.manualBonus,
        grossSalary: grossSalary ?? this.grossSalary,
        unpaidDeduction: unpaidDeduction ?? this.unpaidDeduction,
        netSalary: netSalary ?? this.netSalary,
        payslipUrl: payslipUrl ?? this.payslipUrl,
        status: status ?? this.status,
        createdAt: createdAt ?? this.createdAt,
        employeeName: employeeName ?? this.employeeName,
        employeeCode: employeeCode ?? this.employeeCode,
        designation: designation ?? this.designation,
      );

  // ── Computed Getters ───────────────────────────────────────────────────────

  bool get isDraft => status == 'draft';
  bool get isApproved => status == 'approved';

  /// Effective working days (for payroll calculation display).
  double get effectiveDays =>
      daysPresent + (halfDays * 0.5) + paidLeaveDays;

  // ── Salary Calculation (client-side preview) ───────────────────────────────

  /// Recalculates salary fields from current state.
  /// Call after editing daysPresent, halfDays, overtimeHours, manualBonus.
  PayrollModel recalculate() {
    final dailyRate =
        totalWorkingDays > 0 ? baseSalary / totalWorkingDays : 0.0;
    final effective = daysPresent + (halfDays * 0.5) + paidLeaveDays;
    final otPay = overtimeHours * (dailyRate / 8);
    final gross = (dailyRate * effective) + otPay + manualBonus;
    final deduction = unpaidLeaveDays * dailyRate;
    final net = (gross - deduction).clamp(0.0, double.infinity);

    return copyWith(
      overtimePay: otPay,
      grossSalary: gross,
      unpaidDeduction: deduction,
      netSalary: net,
    );
  }

  // ── Equatable ──────────────────────────────────────────────────────────────

  @override
  List<Object?> get props => [
        id,
        employeeId,
        companyId,
        month,
        year,
        totalWorkingDays,
        daysPresent,
        halfDays,
        paidLeaveDays,
        unpaidLeaveDays,
        overtimeHours,
        baseSalary,
        overtimePay,
        manualBonus,
        grossSalary,
        unpaidDeduction,
        netSalary,
        payslipUrl,
        status,
        createdAt,
        employeeName,
        employeeCode,
        designation,
      ];

  @override
  String toString() =>
      'PayrollModel(employee: $employeeCode, $month/$year, net: $netSalary)';
}
