import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:payclock/core/constants/ad_unit_ids.dart';
import 'package:payclock/core/utils/logger.dart';

/// AdMob initialization + UMP consent management.
///
/// CRITICAL ORDER: UMP consent → MobileAds.initialize() → load ads → show ads.
/// Never change this order.
class AdsService {
  AdsService._();

  static final AdsService instance = AdsService._();

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  InterstitialAd? _interstitialAd;

  // ── Initialization with UMP Consent ───────────────────────────────────────

  Future<void> initializeWithConsent() async {
    try {
      // Step 1: Request consent info update
      final params = ConsentRequestParameters();
      final consentCompleter = Completer<void>();
      ConsentInformation.instance.requestConsentInfoUpdate(
        params,
        () => consentCompleter.complete(),
        (FormError error) => consentCompleter.completeError(error),
      );
      try {
        await consentCompleter.future;
      } catch (e) {
        AppLogger.warning('Consent update error: $e');
      }

      // Step 2: Show consent form if required (EU/EEA users)
      final status =
          await ConsentInformation.instance.getConsentStatus();
      if (status == ConsentStatus.required) {
        final isAvailable =
            await ConsentInformation.instance.isConsentFormAvailable();
        if (isAvailable) {
          await ConsentForm.loadAndShowConsentFormIfRequired(
            (formError) {
              if (formError != null) {
                AppLogger.warning(
                  'Consent form error: ${formError.message}',
                );
              }
            },
          );
        }
      }

      // Step 3: Initialize AdMob ONLY after consent is resolved
      await MobileAds.instance.initialize();

      // Step 4: Tag app as NOT for children (business app)
      await MobileAds.instance.updateRequestConfiguration(
        RequestConfiguration(
          tagForChildDirectedTreatment: TagForChildDirectedTreatment.no,
          tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.no,
          maxAdContentRating: MaxAdContentRating.ma,
        ),
      );

      _isInitialized = true;
      AppLogger.info('AdsService initialized successfully');

      // Step 5: Preload interstitial for later use
      await _loadInterstitial();
    } catch (e, st) {
      AppLogger.error('AdsService init failed', e, st);
      // Non-fatal — ads simply won't show
    }
  }

  // ── Interstitial Ad ───────────────────────────────────────────────────────

  Future<void> _loadInterstitial() async {
    if (!_isInitialized) return;
    try {
      await InterstitialAd.load(
        adUnitId: AdUnitIds.interstitial,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            _interstitialAd = ad;
            _interstitialAd!.fullScreenContentCallback =
                FullScreenContentCallback(
              onAdDismissedFullScreenContent: (ad) {
                ad.dispose();
                _interstitialAd = null;
                // Preload next immediately after dismissal
                _loadInterstitial();
              },
              onAdFailedToShowFullScreenContent: (ad, error) {
                ad.dispose();
                _interstitialAd = null;
                _loadInterstitial();
              },
            );
            AppLogger.debug('Interstitial ad loaded');
          },
          onAdFailedToLoad: (error) {
            AppLogger.warning('Interstitial failed to load: ${error.message}');
            _interstitialAd = null;
          },
        ),
      );
    } catch (e) {
      AppLogger.warning('Interstitial load error', e);
    }
  }

  /// Shows the interstitial ad (only after payslip generation, once per session).
  /// Returns true if shown, false if not available.
  Future<bool> showInterstitial({required bool isPremium}) async {
    if (isPremium) return false; // Never show ads to premium users
    if (!_isInitialized) return false;
    if (_interstitialAd == null) return false;
    if (kDebugMode) {
      AppLogger.debug('Would show interstitial (debug mode)');
    }
    await _interstitialAd!.show();
    return true;
  }

  // ── Banner Ad Request ──────────────────────────────────────────────────────

  /// Creates an AdRequest for banner ads. Returns null for premium users.
  AdRequest? createBannerRequest({required bool isPremium}) {
    if (isPremium || !_isInitialized) return null;
    return const AdRequest();
  }

  // ── Debug helpers ──────────────────────────────────────────────────────────

  void resetConsentForTesting() {
    if (kDebugMode) {
      ConsentInformation.instance.reset();
      AppLogger.debug('Consent reset for testing');
    }
  }
}
