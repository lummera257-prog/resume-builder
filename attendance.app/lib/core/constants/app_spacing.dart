import 'package:flutter/material.dart';

/// Spacing and BorderRadius constants used throughout PayClock.
class AppSpacing {
  AppSpacing._();

  // ── Spacing values ─────────────────────────────────────────────────────────
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;

  // ── Screen-level ──────────────────────────────────────────────────────────
  static const double screenPadding = 20.0;
  static const double cardPadding = 16.0;
  static const double itemSpacing = 12.0;

  // ── SizedBox helpers ──────────────────────────────────────────────────────
  static const Widget vXs = SizedBox(height: xs);
  static const Widget vSm = SizedBox(height: sm);
  static const Widget vMd = SizedBox(height: md);
  static const Widget vLg = SizedBox(height: lg);
  static const Widget vXl = SizedBox(height: xl);
  static const Widget vXxl = SizedBox(height: xxl);

  static const Widget hXs = SizedBox(width: xs);
  static const Widget hSm = SizedBox(width: sm);
  static const Widget hMd = SizedBox(width: md);
  static const Widget hLg = SizedBox(width: lg);
  static const Widget hXl = SizedBox(width: xl);
  static const Widget hXxl = SizedBox(width: xxl);

  // ── EdgeInsets helpers ────────────────────────────────────────────────────
  static const EdgeInsets screenInsets = EdgeInsets.all(screenPadding);
  static const EdgeInsets cardInsets = EdgeInsets.all(cardPadding);

  static const EdgeInsets hScreenInsets =
      EdgeInsets.symmetric(horizontal: screenPadding);
  static const EdgeInsets vScreenInsets =
      EdgeInsets.symmetric(vertical: screenPadding);

  static EdgeInsets only({
    double left = 0,
    double top = 0,
    double right = 0,
    double bottom = 0,
  }) =>
      EdgeInsets.only(left: left, top: top, right: right, bottom: bottom);
}

/// BorderRadius constants used throughout PayClock.
class AppRadius {
  AppRadius._();

  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 32.0;
  static const double full = 100.0;

  // ── BorderRadius objects ──────────────────────────────────────────────────
  static final BorderRadius smRadius = BorderRadius.circular(sm);
  static final BorderRadius mdRadius = BorderRadius.circular(md);
  static final BorderRadius lgRadius = BorderRadius.circular(lg);
  static final BorderRadius xlRadius = BorderRadius.circular(xl);
  static final BorderRadius xxlRadius = BorderRadius.circular(xxl);
  static final BorderRadius fullRadius = BorderRadius.circular(full);

  // ── Top-only (for bottom sheet style cards) ───────────────────────────────
  static const BorderRadius topLg = BorderRadius.only(
    topLeft: Radius.circular(lg),
    topRight: Radius.circular(lg),
  );

  static const BorderRadius topXl = BorderRadius.only(
    topLeft: Radius.circular(xl),
    topRight: Radius.circular(xl),
  );

  static const BorderRadius topXxl = BorderRadius.only(
    topLeft: Radius.circular(xxl),
    topRight: Radius.circular(xxl),
  );
}
