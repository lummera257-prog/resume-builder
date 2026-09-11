/// Base exception class for PayClock.
/// All error paths in repositories must throw AppException — never raw errors.
class AppException implements Exception {
  const AppException({
    required this.message,
    this.code,
    this.details,
  });

  final String message;
  final String? code;
  final dynamic details;

  // ── Named constructors ─────────────────────────────────────────────────────

  factory AppException.server() => const AppException(
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
      );

  factory AppException.network() => const AppException(
        message: 'No internet connection. Please check your network.',
        code: 'NETWORK_ERROR',
      );

  factory AppException.auth() => const AppException(
        message: 'Authentication failed. Please login again.',
        code: 'AUTH_ERROR',
      );

  factory AppException.notFound(String resource) => AppException(
        message: '$resource not found.',
        code: 'NOT_FOUND',
      );

  factory AppException.permissionDenied() => const AppException(
        message: 'You do not have permission to perform this action.',
        code: 'PERMISSION_DENIED',
      );

  factory AppException.planLimit(String feature) => AppException(
        message: 'Upgrade your plan to use $feature.',
        code: 'PLAN_LIMIT',
      );

  factory AppException.validation(String field) => AppException(
        message: 'Invalid $field. Please check and try again.',
        code: 'VALIDATION_ERROR',
      );

  factory AppException.cancelled() => const AppException(
        message: 'Operation cancelled.',
        code: 'CANCELLED',
      );

  @override
  String toString() => 'AppException(code: $code, message: $message)';
}
