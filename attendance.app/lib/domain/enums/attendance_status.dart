import 'package:flutter/material.dart';
import 'package:payclock/core/constants/app_colors.dart';

/// Attendance status for a given employee on a given day.
enum AttendanceStatus {
  present,
  absent,
  halfDay,
  paidLeave,
  unpaidLeave,
  holiday,
  weekOff;

  /// Deserializes from Supabase JSON string value.
  static AttendanceStatus fromString(String value) {
    switch (value.toLowerCase()) {
      case 'present':
        return AttendanceStatus.present;
      case 'half_day':
      case 'halfday':
        return AttendanceStatus.halfDay;
      case 'paid_leave':
      case 'paidleave':
        return AttendanceStatus.paidLeave;
      case 'unpaid_leave':
      case 'unpaidleave':
        return AttendanceStatus.unpaidLeave;
      case 'holiday':
        return AttendanceStatus.holiday;
      case 'week_off':
      case 'weekoff':
        return AttendanceStatus.weekOff;
      case 'absent':
      default:
        return AttendanceStatus.absent;
    }
  }

  /// Serializes to Supabase JSON string value (matches DB column values).
  String get toJson {
    switch (this) {
      case AttendanceStatus.present:
        return 'present';
      case AttendanceStatus.absent:
        return 'absent';
      case AttendanceStatus.halfDay:
        return 'half_day';
      case AttendanceStatus.paidLeave:
        return 'paid_leave';
      case AttendanceStatus.unpaidLeave:
        return 'unpaid_leave';
      case AttendanceStatus.holiday:
        return 'holiday';
      case AttendanceStatus.weekOff:
        return 'week_off';
    }
  }

  /// Human-readable display label.
  String get displayName {
    switch (this) {
      case AttendanceStatus.present:
        return 'Present';
      case AttendanceStatus.absent:
        return 'Absent';
      case AttendanceStatus.halfDay:
        return 'Half Day';
      case AttendanceStatus.paidLeave:
        return 'Paid Leave';
      case AttendanceStatus.unpaidLeave:
        return 'Unpaid Leave';
      case AttendanceStatus.holiday:
        return 'Holiday';
      case AttendanceStatus.weekOff:
        return 'Week Off';
    }
  }

  /// Short label for attendance buttons (P/A/H/L).
  String get shortLabel {
    switch (this) {
      case AttendanceStatus.present:
        return 'P';
      case AttendanceStatus.absent:
        return 'A';
      case AttendanceStatus.halfDay:
        return 'H';
      case AttendanceStatus.paidLeave:
        return 'L';
      case AttendanceStatus.unpaidLeave:
        return 'UL';
      case AttendanceStatus.holiday:
        return 'Ho';
      case AttendanceStatus.weekOff:
        return 'W';
    }
  }

  /// Emoji associated with this status (for list displays and payslips).
  String get emoji {
    switch (this) {
      case AttendanceStatus.present:
        return '✅';
      case AttendanceStatus.absent:
        return '❌';
      case AttendanceStatus.halfDay:
        return '🕐';
      case AttendanceStatus.paidLeave:
        return '🌿';
      case AttendanceStatus.unpaidLeave:
        return '📅';
      case AttendanceStatus.holiday:
        return '🎉';
      case AttendanceStatus.weekOff:
        return '😴';
    }
  }

  /// Color associated with this status (maps to AppColors attendance constants).
  Color get color {
    switch (this) {
      case AttendanceStatus.present:
        return AppColors.attendancePresent;
      case AttendanceStatus.absent:
        return AppColors.attendanceAbsent;
      case AttendanceStatus.halfDay:
        return AppColors.attendanceHalf;
      case AttendanceStatus.paidLeave:
        return AppColors.attendanceLeave;
      case AttendanceStatus.unpaidLeave:
        return AppColors.attendanceAbsent;
      case AttendanceStatus.holiday:
        return AppColors.attendanceHoliday;
      case AttendanceStatus.weekOff:
        return AppColors.attendanceWeekOff;
    }
  }

  /// Whether this status counts as a working day for salary calculation.
  /// present, halfDay, paidLeave = true; others = false.
  bool get isWorkingDay {
    switch (this) {
      case AttendanceStatus.present:
      case AttendanceStatus.halfDay:
      case AttendanceStatus.paidLeave:
        return true;
      case AttendanceStatus.absent:
      case AttendanceStatus.unpaidLeave:
      case AttendanceStatus.holiday:
      case AttendanceStatus.weekOff:
        return false;
    }
  }

  /// Salary multiplier for this status.
  /// present/paidLeave = 1.0 | halfDay = 0.5 | others = 0.0
  double get salaryMultiplier {
    switch (this) {
      case AttendanceStatus.present:
        return 1.0;
      case AttendanceStatus.paidLeave:
        return 1.0;
      case AttendanceStatus.halfDay:
        return 0.5;
      case AttendanceStatus.absent:
      case AttendanceStatus.unpaidLeave:
      case AttendanceStatus.holiday:
      case AttendanceStatus.weekOff:
        return 0.0;
    }
  }
}
