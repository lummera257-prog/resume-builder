import 'package:flutter/foundation.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

/// RevenueCat subscription management service.
class RevenueCatService {
  RevenueCatService._();

  static final RevenueCatService instance = RevenueCatService._();

  // ── REPLACE BEFORE PLAY STORE RELEASE ─────────────────────────────────────
  static const String _androidApiKey = 'YOUR_RC_ANDROID_KEY';
  // ─────────────────────────────────────────────────────────────────────────

  /// The entitlement ID as configured in RevenueCat dashboard.
  static const String entitlementId = 'pro_access';

  bool _isInitialized = false;

  // ── Initialization ────────────────────────────────────────────────────────

  Future<void> init() async {
    try {
      if (kDebugMode) {
        await Purchases.setLogLevel(LogLevel.debug);
      }
      await Purchases.configure(
        PurchasesConfiguration(_androidApiKey),
      );
      _isInitialized = true;
      AppLogger.info('RevenueCat initialized');
    } catch (e, st) {
      AppLogger.error('RevenueCat init failed', e, st);
      // Non-fatal — assume free plan
    }
  }

  // ── Premium Check ─────────────────────────────────────────────────────────

  /// Returns true if the user has an active premium entitlement.
  /// Fails safe — returns false on any error (never blocks the user).
  Future<bool> isPremium() async {
    if (!_isInitialized) return false;
    try {
      final info = await Purchases.getCustomerInfo();
      return info.entitlements.active.containsKey(entitlementId);
    } catch (e) {
      AppLogger.warning('isPremium check failed — assuming free', e);
      return false; // Fail safe
    }
  }

  // ── Get Offerings ─────────────────────────────────────────────────────────

  /// Returns available subscription offerings from RevenueCat.
  Future<Offerings?> getOfferings() async {
    if (!_isInitialized) return null;
    try {
      return await Purchases.getOfferings();
    } catch (e) {
      AppLogger.warning('getOfferings failed', e);
      return null;
    }
  }

  // ── Purchase ──────────────────────────────────────────────────────────────

  /// Purchases a package. Returns updated CustomerInfo on success.
  /// Throws PurchasesError which must be handled by caller.
  Future<CustomerInfo?> purchase(Package package) async {
    try {
      final result = await Purchases.purchasePackage(package);
      AppLogger.info(
        'Purchase successful: ${package.storeProduct.identifier}',
      );
      return result.customerInfo;
    } on PurchasesErrorCode catch (e) {
      if (e == PurchasesErrorCode.purchaseCancelledError) {
        AppLogger.info('Purchase cancelled by user');
        return null; // User cancelled — do nothing
      }
      rethrow;
    } catch (e, st) {
      AppLogger.error('Purchase error', e, st);
      rethrow;
    }
  }

  // ── Restore Purchases ─────────────────────────────────────────────────────

  /// Restores previous purchases (required button in UI per App/Play Store rules).
  Future<CustomerInfo?> restorePurchases() async {
    if (!_isInitialized) return null;
    try {
      final info = await Purchases.restorePurchases();
      AppLogger.info('Purchases restored');
      return info;
    } catch (e, st) {
      AppLogger.error('restorePurchases error', e, st);
      return null;
    }
  }

  // ── User Linking ──────────────────────────────────────────────────────────

  /// Links RevenueCat to the backend user ID.
  /// Call after the user logs in with Supabase.
  Future<void> loginUser(String userId) async {
    if (!_isInitialized) return;
    try {
      await Purchases.logIn(userId);
      AppLogger.info('RevenueCat linked to user: $userId');
    } catch (e) {
      AppLogger.warning('RevenueCat logIn failed', e);
    }
  }

  /// Logs out the RevenueCat session.
  /// Call on user logout.
  Future<void> logoutUser() async {
    if (!_isInitialized) return;
    try {
      await Purchases.logOut();
      AppLogger.info('RevenueCat logged out');
    } catch (e) {
      AppLogger.warning('RevenueCat logOut failed', e);
    }
  }

  /// Returns customer info for display in settings.
  Future<CustomerInfo?> getCustomerInfo() async {
    if (!_isInitialized) return null;
    try {
      return await Purchases.getCustomerInfo();
    } catch (e) {
      AppLogger.warning('getCustomerInfo failed', e);
      return null;
    }
  }
}
