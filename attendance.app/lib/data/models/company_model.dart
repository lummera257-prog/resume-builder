import 'dart:convert';

import 'package:equatable/equatable.dart';

/// Company model — maps exactly to the `companies` Supabase table.
class CompanyModel extends Equatable {
  const CompanyModel({
    required this.id,
    required this.ownerId,
    required this.name,
    this.timezone = 'Asia/Kolkata',
    this.currency = 'INR',
    this.currencySymbol = '₹',
    this.workDays = const [1, 2, 3, 4, 5, 6],
    this.shiftStart = '09:00',
    this.shiftEnd = '18:00',
    this.createdAt,
    // Extra business info (stored as metadata or separate fields)
    this.city,
    this.businessType,
    this.teamSizeRange,
    this.paidLeavesPerYear = 12,
    this.sickLeavesPerYear = 12,
  });

  final String id;
  final String ownerId; // → 'owner_id'
  final String name;
  final String timezone;
  final String currency;
  final String currencySymbol; // → 'currency_symbol'
  final List<int> workDays; // → 'work_days' (JSON array string)
  final String shiftStart; // → 'shift_start' — "HH:mm" 24hr format
  final String shiftEnd; // → 'shift_end'
  final DateTime? createdAt; // → 'created_at'

  // Extra fields (stored in Supabase as JSONB or separate columns if extended)
  final String? city;
  final String? businessType;
  final String? teamSizeRange;
  final int paidLeavesPerYear;
  final int sickLeavesPerYear;

  // ── Serialization ──────────────────────────────────────────────────────────

  factory CompanyModel.fromJson(Map<String, dynamic> json) => CompanyModel(
        id: json['id'] as String? ?? '',
        ownerId: json['owner_id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        timezone: json['timezone'] as String? ?? 'Asia/Kolkata',
        currency: json['currency'] as String? ?? 'INR',
        currencySymbol: json['currency_symbol'] as String? ?? '₹',
        workDays: _parseWorkDays(json['work_days']),
        shiftStart: json['shift_start'] as String? ?? '09:00',
        shiftEnd: json['shift_end'] as String? ?? '18:00',
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
        city: json['city'] as String?,
        businessType: json['business_type'] as String?,
        teamSizeRange: json['team_size_range'] as String?,
        paidLeavesPerYear: json['paid_leaves_per_year'] as int? ?? 12,
        sickLeavesPerYear: json['sick_leaves_per_year'] as int? ?? 12,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'owner_id': ownerId,
        'name': name,
        'timezone': timezone,
        'currency': currency,
        'currency_symbol': currencySymbol,
        'work_days': jsonEncode(workDays),
        'shift_start': shiftStart,
        'shift_end': shiftEnd,
        if (city != null) 'city': city,
        if (businessType != null) 'business_type': businessType,
        if (teamSizeRange != null) 'team_size_range': teamSizeRange,
        'paid_leaves_per_year': paidLeavesPerYear,
        'sick_leaves_per_year': sickLeavesPerYear,
      };

  CompanyModel copyWith({
    String? id,
    String? ownerId,
    String? name,
    String? timezone,
    String? currency,
    String? currencySymbol,
    List<int>? workDays,
    String? shiftStart,
    String? shiftEnd,
    DateTime? createdAt,
    String? city,
    String? businessType,
    String? teamSizeRange,
    int? paidLeavesPerYear,
    int? sickLeavesPerYear,
  }) =>
      CompanyModel(
        id: id ?? this.id,
        ownerId: ownerId ?? this.ownerId,
        name: name ?? this.name,
        timezone: timezone ?? this.timezone,
        currency: currency ?? this.currency,
        currencySymbol: currencySymbol ?? this.currencySymbol,
        workDays: workDays ?? this.workDays,
        shiftStart: shiftStart ?? this.shiftStart,
        shiftEnd: shiftEnd ?? this.shiftEnd,
        createdAt: createdAt ?? this.createdAt,
        city: city ?? this.city,
        businessType: businessType ?? this.businessType,
        teamSizeRange: teamSizeRange ?? this.teamSizeRange,
        paidLeavesPerYear: paidLeavesPerYear ?? this.paidLeavesPerYear,
        sickLeavesPerYear: sickLeavesPerYear ?? this.sickLeavesPerYear,
      );

  // ── Equatable ──────────────────────────────────────────────────────────────

  @override
  List<Object?> get props => [
        id,
        ownerId,
        name,
        timezone,
        currency,
        currencySymbol,
        workDays,
        shiftStart,
        shiftEnd,
        createdAt,
        city,
        businessType,
        teamSizeRange,
        paidLeavesPerYear,
        sickLeavesPerYear,
      ];

  // ── Helpers ────────────────────────────────────────────────────────────────

  static List<int> _parseWorkDays(dynamic value) {
    try {
      if (value is String) {
        return (jsonDecode(value) as List).cast<int>();
      }
      if (value is List) {
        return value.cast<int>();
      }
    } catch (_) {}
    return [1, 2, 3, 4, 5, 6]; // Default Mon-Sat
  }

  /// Number of work days per week.
  int get workDaysPerWeek => workDays.length;

  /// Shift duration in hours.
  double get shiftDurationHours {
    try {
      final startParts = shiftStart.split(':');
      final endParts = shiftEnd.split(':');
      final startMinutes =
          int.parse(startParts[0]) * 60 + int.parse(startParts[1]);
      final endMinutes =
          int.parse(endParts[0]) * 60 + int.parse(endParts[1]);
      return (endMinutes - startMinutes) / 60.0;
    } catch (_) {
      return 9.0;
    }
  }

  @override
  String toString() => 'CompanyModel(id: $id, name: $name)';
}
