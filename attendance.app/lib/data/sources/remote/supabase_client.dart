import 'package:supabase_flutter/supabase_flutter.dart';

/// Singleton accessor for the Supabase client.
/// Replace the placeholder values before release.
class SupabaseClientService {
  SupabaseClientService._();

  // ── REPLACE THESE BEFORE PLAY STORE RELEASE ──────────────────────────────
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  // ─────────────────────────────────────────────────────────────────────────

  /// The initialized Supabase client.
  static SupabaseClient get client => Supabase.instance.client;

  /// Supabase Auth helper.
  static GoTrueClient get auth => client.auth;

  /// Supabase Storage helper.
  static SupabaseStorageClient get storage => client.storage;

  /// The currently authenticated user (null if not logged in).
  static User? get currentUser => auth.currentUser;

  /// Whether a user is currently authenticated.
  static bool get isLoggedIn => currentUser != null;

  /// The currently authenticated user ID.
  static String? get currentUserId => currentUser?.id;

  /// Stream of auth state changes.
  static Stream<AuthState> get authStateStream => auth.onAuthStateChange;
}
