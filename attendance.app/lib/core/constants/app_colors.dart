import 'package:flutter/material.dart';

/// All color constants used throughout PayClock.
/// Never use Color literals directly in widgets — always reference these.
class AppColors {
  AppColors._();

  // ── Brand ──────────────────────────────────────────────────────────────────
  static const Color primary = Color(0xFF1B5E20); // Dark Green — AppBar, primary actions
  static const Color secondary = Color(0xFF4CAF50); // Light Green — secondary actions
  static const Color accent = Color(0xFFFF6F00); // Orange — CTA buttons, FAB
  static const Color primaryLight = Color(0xFF2E7D32);
  static const Color primaryDark = Color(0xFF1B5E20);

  // ── Semantic ───────────────────────────────────────────────────────────────
  static const Color error = Color(0xFFD32F2F);
  static const Color warning = Color(0xFFF57C00);
  static const Color success = Color(0xFF388E3C);
  static const Color info = Color(0xFF1976D2);

  // ── Neutrals ───────────────────────────────────────────────────────────────
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF5F5F5);
  static const Color surfaceVariant = Color(0xFFEEEEEE);
  static const Color divider = Color(0xFFE0E0E0);
  static const Color shadow = Color(0x1A000000);

  // ── Text ───────────────────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textHint = Color(0xFFBDBDBD);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnAccent = Color(0xFFFFFFFF);
  static const Color textDisabled = Color(0xFFBDBDBD);

  // ── Attendance Status ──────────────────────────────────────────────────────
  static const Color attendancePresent = Color(0xFF388E3C); // Green
  static const Color attendanceAbsent = Color(0xFFD32F2F); // Red
  static const Color attendanceHalf = Color(0xFFFF6F00); // Orange
  static const Color attendanceLeave = Color(0xFF1976D2); // Blue
  static const Color attendanceHoliday = Color(0xFF7B1FA2); // Purple
  static const Color attendanceWeekOff = Color(0xFF546E7A); // Blue-Grey
  static const Color attendanceUnmarked = Color(0xFFBDBDBD); // Grey

  // ── Subscription Plans ─────────────────────────────────────────────────────
  static const Color planFree = Color(0xFF757575);
  static const Color planStarter = Color(0xFF1976D2);
  static const Color planPro = Color(0xFFFF6F00);

  // ── Chart / Analytics ──────────────────────────────────────────────────────
  static const Color chart1 = Color(0xFF1B5E20);
  static const Color chart2 = Color(0xFF4CAF50);
  static const Color chart3 = Color(0xFFFF6F00);
  static const Color chart4 = Color(0xFF1976D2);
  static const Color chart5 = Color(0xFF7B1FA2);

  // ── Gradient helpers ───────────────────────────────────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF1B5E20), Color(0xFF2E7D32)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient splashGradient = LinearGradient(
    colors: [Color(0xFF1B5E20), Color(0xFF2E7D32)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF2E7D32), Color(0xFF388E3C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Avatar palette (deterministic hash-based selection) ───────────────────
  static const List<Color> avatarPalette = [
    Color(0xFF1B5E20),
    Color(0xFF4CAF50),
    Color(0xFF1976D2),
    Color(0xFFFF6F00),
    Color(0xFF7B1FA2),
    Color(0xFFD32F2F),
    Color(0xFF00838F),
    Color(0xFF558B2F),
    Color(0xFF4527A0),
    Color(0xFF0277BD),
  ];

  /// Returns a deterministic avatar color for a given name.
  static Color avatarColorFromName(String name) {
    final index = name.hashCode.abs() % avatarPalette.length;
    return avatarPalette[index];
  }
}
