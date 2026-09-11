import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:payclock/app.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/sources/local/local_database.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:payclock/services/ads_service.dart';
import 'package:payclock/services/revenue_cat_service.dart';
import 'package:payclock/services/sync_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Firebase & Crashlytics
  try {
    await Firebase.initializeApp();
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
    AppLogger.info('Firebase initialized');
  } catch (e) {
    AppLogger.warning(
      'Firebase initialization skipped or pending google-services.json: $e',
    );
  }

  // 2. Supabase
  try {
    await Supabase.initialize(
      url: SupabaseClientService.supabaseUrl,
      anonKey: SupabaseClientService.supabaseAnonKey,
    );
    AppLogger.info('Supabase client initialized');
  } catch (e) {
    AppLogger.warning(
      'Supabase initialization error (check credentials in supabase_client.dart): $e',
    );
  }

  // 3. SQLite Local Database
  try {
    await LocalDatabase.instance.init();
    AppLogger.info('SQLite local database initialized');
  } catch (e, st) {
    AppLogger.error('Local database failed to initialize', e, st);
  }

  // 4. AdMob + UMP Consent (non-blocking)
  unawaited(AdsService.instance.initializeWithConsent());

  // 5. RevenueCat (non-blocking)
  unawaited(RevenueCatService.instance.init());

  // 6. Connectivity Sync Listener
  SyncService.instance.listenToConnectivity();

  runApp(const ProviderScope(child: PayClockApp()));
}
