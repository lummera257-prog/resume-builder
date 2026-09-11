import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/domain/enums/subscription_plan.dart';
import 'package:payclock/services/revenue_cat_service.dart';

/// Whether the current user has an active premium subscription.
/// Fails safe — returns false on error.
final isPremiumProvider = FutureProvider<bool>((ref) async {
  return RevenueCatService.instance.isPremium();
});

/// Current active subscription plan.
final currentPlanProvider = FutureProvider<SubscriptionPlan>((ref) async {
  final isPremium = await ref.watch(isPremiumProvider.future);
  if (!isPremium) return SubscriptionPlan.free;
  // TODO: Distinguish Starter vs Pro by checking specific entitlements
  // For now, return pro for any active entitlement
  return SubscriptionPlan.pro;
});
