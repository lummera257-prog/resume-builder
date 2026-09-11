import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/services/ads_service.dart';

/// Whether AdMob is initialized and ready to serve ads.
final adsInitializedProvider = Provider<bool>(
  (_) => AdsService.instance.isInitialized,
);
