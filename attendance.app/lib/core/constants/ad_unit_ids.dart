import 'package:flutter/foundation.dart';

/// AdMob unit IDs. Automatically switches between test IDs (debug)
/// and real IDs (release) using kDebugMode.
///
/// IMPORTANT: Replace all YOUR_ID placeholders before Play Store release.
class AdUnitIds {
  AdUnitIds._();

  /// App-level AdMob Application ID.
  /// Also set this in AndroidManifest.xml meta-data.
  static const String admobAppId = 'ca-app-pub-YOUR_APP_ID~YOUR_APP_NUMBER';

  /// Smart banner ad unit.
  static String get banner => kDebugMode
      ? 'ca-app-pub-3940256099942544/6300978111' // Google official test banner ID
      : 'ca-app-pub-YOUR_ID/YOUR_BANNER_ID'; // Replace before release

  /// Full-screen interstitial ad unit (shown after payslip generation).
  static String get interstitial => kDebugMode
      ? 'ca-app-pub-3940256099942544/1033173712' // Google official test interstitial ID
      : 'ca-app-pub-YOUR_ID/YOUR_INTER_ID'; // Replace before release

  /// Rewarded ad unit (not currently used — reserved for future).
  static String get rewarded => kDebugMode
      ? 'ca-app-pub-3940256099942544/5224354917' // Google official test rewarded ID
      : 'ca-app-pub-YOUR_ID/YOUR_REWARDED_ID'; // Replace before release
}
