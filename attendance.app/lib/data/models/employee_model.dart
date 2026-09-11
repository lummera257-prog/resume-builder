import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/domain/enums/salary_type.dart';

/// Employee model — maps exactly to the `employees` Supabase table.
class EmployeeModel extends Equatable {
  const EmployeeModel({
    required this.id,
    required this.companyId,
    required this.name,
    required this.employeeCode,
    required this.salaryType,
    required this.baseSalary,
    this.phone,
    this.email,
    this.designation,
    this.workDaysPerWeek = 6,
    this.shiftStart,
    this.shiftEnd,
    this.joinedAt,
    this.status = 'active',
    this.createdAt,
    this.paidLeavesPerYear,
    this.sickLeavesPerYear,
    this.useCompanyLeavePolicy = true,
    this.useCompanyShift = true,
  });

  final String id;
  final String companyId; // → 'company_id'
  final String name;
  final String? phone;
  final String? email;
  final String? designation;
  final String employeeCode; // → 'employee_code'
  final SalaryType salaryType; // → 'salary_type'
  final double baseSalary; // → 'base_salary'
  final int workDaysPerWeek; // → 'work_days_per_week'
  final String? shiftStart; // → 'shift_start'
  final String? shiftEnd; // → 'shift_end'
  final DateTime? joinedAt; // → 'joined_at'
  final String status;
  final DateTime? createdAt; // → 'created_at'

  // Leave policy (null = use company default)
  final int? paidLeavesPerYear;
  final int? sickLeavesPerYear;
  final bool useCompanyLeavePolicy;
  final bool useCompanyShift;

  // ── Serialization ──────────────────────────────────────────────────────────

  factory EmployeeModel.fromJson(Map<String, dynamic> json) => EmployeeModel(
        id: json['id'] as String? ?? '',
        companyId: json['company_id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        phone: json['phone'] as String?,
        email: json['email'] as String?,
        designation: json['designation'] as String?,
        employeeCode: json['employee_code'] as String? ?? 'EMP001',
        salaryType: SalaryType.fromString(
          json['salary_type'] as String? ?? 'monthly',
        ),
        baseSalary:
            (json['base_salary'] as num?)?.toDouble() ?? 0.0,
        workDaysPerWeek: json['work_days_per_week'] as int? ?? 6,
        shiftStart: json['shift_start'] as String?,
        shiftEnd: json['shift_end'] as String?,
        joinedAt: DateTime.tryParse(json['joined_at'] as String? ?? ''),
        status: json['status'] as String? ?? 'active',
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
        paidLeavesPerYear: json['paid_leaves_per_year'] as int?,
        sickLeavesPerYear: json['sick_leaves_per_year'] as int?,
        useCompanyLeavePolicy:
            json['use_company_leave_policy'] as bool? ?? true,
        useCompanyShift: json['use_company_shift'] as bool? ?? true,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'company_id': companyId,
        'name': name,
        if (phone != null) 'phone': phone,
        if (email != null) 'email': email,
        if (designation != null) 'designation': designation,
        'employee_code': employeeCode,
        'salary_type': salaryType.toJson,
        'base_salary': baseSalary,
        'work_days_per_week': workDaysPerWeek,
        if (shiftStart != null) 'shift_start': shiftStart,
        if (shiftEnd != null) 'shift_end': shiftEnd,
        if (joinedAt != null) 'joined_at': joinedAt!.toIso8601String(),
        'status': status,
        if (paidLeavesPerYear != null)
          'paid_leaves_per_year': paidLeavesPerYear,
        if (sickLeavesPerYear != null)
          'sick_leaves_per_year': sickLeavesPerYear,
        'use_company_leave_policy': useCompanyLeavePolicy,
        'use_company_shift': useCompanyShift,
      };

  EmployeeModel copyWith({
    String? id,
    String? companyId,
    String? name,
    String? phone,
    String? email,
    String? designation,
    String? employeeCode,
    SalaryType? salaryType,
    double? baseSalary,
    int? workDaysPerWeek,
    String? shiftStart,
    String? shiftEnd,
    DateTime? joinedAt,
    String? status,
    DateTime? createdAt,
    int? paidLeavesPerYear,
    int? sickLeavesPerYear,
    bool? useCompanyLeavePolicy,
    bool? useCompanyShift,
  }) =>
      EmployeeModel(
        id: id ?? this.id,
        companyId: companyId ?? this.companyId,
        name: name ?? this.name,
        phone: phone ?? this.phone,
        email: email ?? this.email,
        designation: designation ?? this.designation,
        employeeCode: employeeCode ?? this.employeeCode,
        salaryType: salaryType ?? this.salaryType,
        baseSalary: baseSalary ?? this.baseSalary,
        workDaysPerWeek: workDaysPerWeek ?? this.workDaysPerWeek,
        shiftStart: shiftStart ?? this.shiftStart,
        shiftEnd: shiftEnd ?? this.shiftEnd,
        joinedAt: joinedAt ?? this.joinedAt,
        status: status ?? this.status,
        createdAt: createdAt ?? this.createdAt,
        paidLeavesPerYear: paidLeavesPerYear ?? this.paidLeavesPerYear,
        sickLeavesPerYear: sickLeavesPerYear ?? this.sickLeavesPerYear,
        useCompanyLeavePolicy:
            useCompanyLeavePolicy ?? this.useCompanyLeavePolicy,
        useCompanyShift: useCompanyShift ?? this.useCompanyShift,
      );

  // ── Computed Getters ───────────────────────────────────────────────────────

  /// Whether this employee is active.
  bool get isActive => status == 'active';

  /// Initials from name (first letter of each word, max 2).
  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  /// Deterministic avatar color based on name hash.
  /// Same name always returns the same color.
  Color get avatarColor => AppColors.avatarColorFromName(name);

  /// Monthly salary equivalent regardless of salary type.
  /// daily × 26 | hourly × 8 × 26 | monthly = baseSalary
  double get monthlyEquivalent {
    switch (salaryType) {
      case SalaryType.monthly:
        return baseSalary;
      case SalaryType.daily:
        return baseSalary * 26;
      case SalaryType.hourly:
        return baseSalary * 8 * 26;
    }
  }

  /// Daily rate for payroll calculations.
  double dailyRate(int workingDaysInMonth) {
    switch (salaryType) {
      case SalaryType.monthly:
        return workingDaysInMonth > 0
            ? baseSalary / workingDaysInMonth
            : baseSalary / 26;
      case SalaryType.daily:
        return baseSalary;
      case SalaryType.hourly:
        return baseSalary * 8;
    }
  }

  // ── Equatable ──────────────────────────────────────────────────────────────

  @override
  List<Object?> get props => [
        id,
        companyId,
        name,
        phone,
        email,
        designation,
        employeeCode,
        salaryType,
        baseSalary,
        workDaysPerWeek,
        shiftStart,
        shiftEnd,
        joinedAt,
        status,
        createdAt,
        paidLeavesPerYear,
        sickLeavesPerYear,
        useCompanyLeavePolicy,
        useCompanyShift,
      ];

  @override
  String toString() =>
      'EmployeeModel(id: $id, name: $name, code: $employeeCode)';
}
