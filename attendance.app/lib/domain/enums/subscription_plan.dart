/// Subscription plan for a PayClock account.
enum SubscriptionPlan {
  free,
  starter,
  pro;

  /// Deserializes from a string identifier.
  static SubscriptionPlan fromString(String value) {
    switch (value.toLowerCase()) {
      case 'starter':
        return SubscriptionPlan.starter;
      case 'pro':
        return SubscriptionPlan.pro;
      case 'free':
      default:
        return SubscriptionPlan.free;
    }
  }

  /// Serializes to string.
  String get toJson => name;

  /// Human-readable display label.
  String get displayName {
    switch (this) {
      case SubscriptionPlan.free:
        return 'Free';
      case SubscriptionPlan.starter:
        return 'Starter';
      case SubscriptionPlan.pro:
        return 'Pro';
    }
  }

  /// Maximum number of employees allowed on this plan.
  int get maxEmployees {
    switch (this) {
      case SubscriptionPlan.free:
        return 5;
      case SubscriptionPlan.starter:
        return 25;
      case SubscriptionPlan.pro:
        return 999999;
    }
  }

  /// Whether payroll calculation is available.
  bool get hasPayroll => this != SubscriptionPlan.free;

  /// Whether reports are available.
  bool get hasReports => this == SubscriptionPlan.pro;

  /// Whether ads are shown.
  bool get showAds => this == SubscriptionPlan.free;

  /// Monthly price as formatted string.
  String get monthlyPrice {
    switch (this) {
      case SubscriptionPlan.free:
        return '₹0';
      case SubscriptionPlan.starter:
        return '₹199';
      case SubscriptionPlan.pro:
        return '₹399';
    }
  }

  /// Price per 6 months.
  String get sixMonthPrice {
    switch (this) {
      case SubscriptionPlan.free:
        return '₹0';
      case SubscriptionPlan.starter:
        return '₹999';
      case SubscriptionPlan.pro:
        return '₹1,999';
    }
  }

  /// RevenueCat product identifiers for Google Play.
  String get monthlyProductId {
    switch (this) {
      case SubscriptionPlan.free:
        return '';
      case SubscriptionPlan.starter:
        return 'payclock_starter_monthly';
      case SubscriptionPlan.pro:
        return 'payclock_pro_monthly';
    }
  }

  String get sixMonthProductId {
    switch (this) {
      case SubscriptionPlan.free:
        return '';
      case SubscriptionPlan.starter:
        return 'payclock_starter_6month';
      case SubscriptionPlan.pro:
        return 'payclock_pro_6month';
    }
  }
}
