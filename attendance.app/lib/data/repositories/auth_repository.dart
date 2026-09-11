import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all authentication operations via Supabase Auth.
class AuthRepository {
  // ── Sign Up ────────────────────────────────────────────────────────────────

  Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    String? phone,
  }) async {
    try {
      final response = await SupabaseClientService.auth.signUp(
        email: email.trim(),
        password: password,
        data: {
          'full_name': name.trim(),
          if (phone != null && phone.isNotEmpty) 'phone': phone.trim(),
        },
      );
      AppLogger.info('User signed up: ${response.user?.email}');
      return response;
    } on AuthException catch (e) {
      AppLogger.error('SignUp failed', e);
      throw AppException(message: e.message, code: e.statusCode);
    } catch (e, st) {
      AppLogger.error('SignUp unexpected error', e, st);
      throw AppException.server();
    }
  }

  // ── Sign In ────────────────────────────────────────────────────────────────

  Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final response =
          await SupabaseClientService.auth.signInWithPassword(
        email: email.trim(),
        password: password,
      );
      AppLogger.info('User signed in: ${response.user?.email}');
      return response;
    } on AuthException catch (e) {
      AppLogger.error('SignIn failed', e);
      throw AppException(message: e.message, code: e.statusCode);
    } catch (e, st) {
      AppLogger.error('SignIn unexpected error', e, st);
      throw AppException.server();
    }
  }

  // ── Google OAuth ───────────────────────────────────────────────────────────

  Future<bool> signInWithGoogle() async {
    try {
      final result = await SupabaseClientService.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'com.payclock.app://login-callback',
      );
      AppLogger.info('Google OAuth initiated: $result');
      return result;
    } on AuthException catch (e) {
      AppLogger.error('Google sign-in failed', e);
      throw AppException(message: e.message, code: e.statusCode);
    } catch (e, st) {
      AppLogger.error('Google sign-in unexpected error', e, st);
      throw AppException.server();
    }
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    try {
      await SupabaseClientService.auth.signOut();
      AppLogger.info('User signed out');
    } catch (e, st) {
      AppLogger.error('SignOut error', e, st);
      // Sign out errors are non-fatal — clear local state anyway
    }
  }

  // ── Password Reset ────────────────────────────────────────────────────────

  Future<void> sendPasswordReset(String email) async {
    try {
      await SupabaseClientService.auth.resetPasswordForEmail(email.trim());
      AppLogger.info('Password reset sent to $email');
    } on AuthException catch (e) {
      throw AppException(message: e.message, code: e.statusCode);
    } catch (e, st) {
      AppLogger.error('Password reset error', e, st);
      throw AppException.server();
    }
  }

  // ── Current User ──────────────────────────────────────────────────────────

  User? get currentUser => SupabaseClientService.auth.currentUser;

  bool get isLoggedIn => currentUser != null;

  String? get currentUserId => currentUser?.id;

  String? get currentUserEmail => currentUser?.email;

  String? get currentUserName =>
      currentUser?.userMetadata?['full_name'] as String?;

  // ── Auth State Stream ──────────────────────────────────────────────────────

  Stream<AuthState> get authStateStream =>
      SupabaseClientService.auth.onAuthStateChange;
}
