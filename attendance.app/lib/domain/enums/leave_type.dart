/// Leave type for leave requests.
enum LeaveType {
  sick,
  casual,
  unpaid;

  /// Deserializes from Supabase JSON string value.
  static LeaveType fromString(String value) {
    switch (value.toLowerCase()) {
      case 'sick':
        return LeaveType.sick;
      case 'unpaid':
        return LeaveType.unpaid;
      case 'casual':
      default:
        return LeaveType.casual;
    }
  }

  /// Serializes to Supabase JSON string value.
  String get toJson => name;

  /// Human-readable display label.
  String get displayName {
    switch (this) {
      case LeaveType.sick:
        return 'Sick Leave';
      case LeaveType.casual:
        return 'Casual Leave';
      case LeaveType.unpaid:
        return 'Unpaid Leave';
    }
  }

  /// Short label for chips.
  String get shortLabel {
    switch (this) {
      case LeaveType.sick:
        return 'Sick';
      case LeaveType.casual:
        return 'Casual';
      case LeaveType.unpaid:
        return 'Unpaid';
    }
  }

  /// Emoji associated with this leave type.
  String get emoji {
    switch (this) {
      case LeaveType.sick:
        return '🤒';
      case LeaveType.casual:
        return '🏖️';
      case LeaveType.unpaid:
        return '⏸️';
    }
  }

  /// Whether the reason field is required for this leave type.
  bool get requiresReason => this == LeaveType.sick;
}
