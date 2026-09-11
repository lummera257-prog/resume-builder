import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/repositories/auth_repository.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:payclock/services/revenue_cat_service.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Repository provider
final authRepoProvider = Provider<AuthRepository>((_) => AuthRepository());

/// Simple logged-in check provider
final isLoggedInProvider = Provider<bool>(
  (_) => SupabaseClientService.isLoggedIn,
);

/// Current user ID provider
final currentUserIdProvider = Provider<String?>(
  (_) => SupabaseClientService.currentUser?.id,
);

/// Current user display name
final currentUserNameProvider = Provider<String>(
  (ref) =>
      SupabaseClientService.currentUser?.userMetadata?['full_name']
          as String? ??
      'Owner',
);

/// Auth state notifier
class AuthNotifier extends AsyncNotifier<AuthState?> {
  AuthRepository get _repo => ref.read(authRepoProvider);
  StreamSubscription<AuthState>? _sub;

  @override
  Future<AuthState?> build() async {
    _sub?.cancel();
    _sub = _repo.authStateStream.listen((authState) {
      state = AsyncData(authState);
    });
    ref.onDispose(() => _sub?.cancel());
    return null;
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String name,
    String? phone,
  }) async {
    state = const AsyncLoading();
    try {
      final response = await _repo.signUpWithEmail(
        email: email,
        password: password,
        name: name,
        phone: phone,
      );
      // Link RevenueCat
      if (response.user != null) {
        await RevenueCatService.instance.loginUser(response.user!.id);
      }
      state = AsyncData(response.session != null
          ? AuthState(AuthChangeEvent.signedIn, response.session)
          : null);
    } catch (e, st) {
      AppLogger.error('signUp error', e, st);
      state = AsyncError(e, st);
    }
  }

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    state = const AsyncLoading();
    try {
      final response = await _repo.signInWithEmail(
        email: email,
        password: password,
      );
      if (response.user != null) {
        await RevenueCatService.instance.loginUser(response.user!.id);
      }
      state = AsyncData(response.session != null
          ? AuthState(AuthChangeEvent.signedIn, response.session)
          : null);
    } catch (e, st) {
      AppLogger.error('signIn error', e, st);
      state = AsyncError(e, st);
    }
  }

  Future<void> signOut() async {
    state = const AsyncLoading();
    try {
      await _repo.signOut();
      await RevenueCatService.instance.logoutUser();
      state = const AsyncData(null);
    } catch (e, st) {
      AppLogger.error('signOut error', e, st);
      state = const AsyncData(null); // Sign out even if error
    }
  }
}

final authProvider =
    AsyncNotifierProvider<AuthNotifier, AuthState?>(AuthNotifier.new);
