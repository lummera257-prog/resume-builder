/// Salary type for an employee.
enum SalaryType {
  monthly,
  daily,
  hourly;

  /// Deserializes from Supabase JSON string value.
  static SalaryType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'daily':
        return SalaryType.daily;
      case 'hourly':
        return SalaryType.hourly;
      case 'monthly':
      default:
        return SalaryType.monthly;
    }
  }

  /// Serializes to Supabase JSON string value.
  String get toJson => name;

  /// Human-readable display label.
  String get displayName {
    switch (this) {
      case SalaryType.monthly:
        return 'Monthly';
      case SalaryType.daily:
        return 'Daily';
      case SalaryType.hourly:
        return 'Hourly';
    }
  }

  /// Short label used in chips and segmented controls.
  String get shortLabel {
    switch (this) {
      case SalaryType.monthly:
        return 'Monthly';
      case SalaryType.daily:
        return 'Daily';
      case SalaryType.hourly:
        return 'Hourly';
    }
  }

  /// The unit label to show next to the salary amount.
  String get unitLabel {
    switch (this) {
      case SalaryType.monthly:
        return '/month';
      case SalaryType.daily:
        return '/day';
      case SalaryType.hourly:
        return '/hour';
    }
  }
}
