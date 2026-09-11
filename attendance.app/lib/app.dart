import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/core/constants/app_theme.dart';
import 'package:payclock/presentation/providers/auth_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

final GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();

/// Root PayClock Application Widget.
class PayClockApp extends ConsumerStatefulWidget {
  const PayClockApp({super.key});

  @override
  ConsumerState<PayClockApp> createState() => _PayClockAppState();
}

class _PayClockAppState extends ConsumerState<PayClockApp> {
  @override
  void initState() {
    super.initState();
    _listenAuth();
  }

  void _listenAuth() {
    ref.listenManual(authProvider, (previous, next) {
      final authState = next.value;
      if (authState != null && authState.event == AuthChangeEvent.signedOut) {
        appNavigatorKey.currentState?.pushNamedAndRemoveUntil(
          AppRoutes.login,
          (route) => false,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: appNavigatorKey,
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      locale: const Locale('en', 'IN'),
      initialRoute: AppRoutes.splash,
      onGenerateRoute: AppRoutes.onGenerateRoute,
    );
  }
}
