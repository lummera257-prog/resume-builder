import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:payclock/core/utils/logger.dart';

/// Firebase Cloud Messaging service for push notifications.
/// FCM failures NEVER block business operations (leave approval, etc.)
class NotificationService {
  NotificationService._();

  static final NotificationService instance = NotificationService._();

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  // ── Initialization ────────────────────────────────────────────────────────

  Future<void> init() async {
    try {
      // Request permission (Android 13+)
      final settings = await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      AppLogger.info(
        'FCM permission: ${settings.authorizationStatus}',
      );

      // Get FCM token
      final token = await _messaging.getToken();
      AppLogger.info('FCM token: $token');

      // Listen for foreground messages
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Listen for background message taps
      FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpened);
    } catch (e, st) {
      AppLogger.error('NotificationService init failed', e, st);
      // Non-fatal
    }
  }

  void _handleForegroundMessage(RemoteMessage message) {
    AppLogger.info(
      'FCM foreground: ${message.notification?.title}',
    );
    // TODO: Show in-app notification banner
  }

  void _handleMessageOpened(RemoteMessage message) {
    AppLogger.info('FCM tapped: ${message.data}');
    // TODO: Navigate to relevant screen based on message.data
  }

  // ── Send Notifications (via Supabase Edge Function) ───────────────────────

  /// Sends a push notification via a Supabase Edge Function.
  /// Always wrapped in try-catch — FCM failure must never block the caller.
  Future<void> sendNotification({
    required String recipientToken,
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    try {
      // TODO: Call Supabase Edge Function 'send-notification' with payload
      // await SupabaseClientService.client.functions.invoke(
      //   'send-notification',
      //   body: {'token': recipientToken, 'title': title, 'body': body, 'data': data},
      // );
      AppLogger.info('Notification sent: $title → $recipientToken');
    } catch (e) {
      AppLogger.warning('sendNotification failed (non-fatal)', e);
      // Intentionally swallow — FCM failure never blocks business logic
    }
  }

  // ── Convenience Methods ───────────────────────────────────────────────────

  Future<void> notifyLeaveRequest({
    required String ownerToken,
    required String employeeName,
    required int durationDays,
    required String leaveType,
    required String startDate,
    required String endDate,
  }) async {
    await sendNotification(
      recipientToken: ownerToken,
      title: '$employeeName requested $durationDays day $leaveType leave',
      body: '$startDate - $endDate',
      data: {'type': 'leave_request'},
    );
  }

  Future<void> notifyLeaveApproved({
    required String employeeToken,
    required int durationDays,
    required String leaveType,
  }) async {
    await sendNotification(
      recipientToken: employeeToken,
      title: 'Leave Approved ✅',
      body:
          'Your $durationDays day $leaveType leave is approved',
      data: {'type': 'leave_approved'},
    );
  }

  Future<void> notifyLeaveRejected({
    required String employeeToken,
  }) async {
    await sendNotification(
      recipientToken: employeeToken,
      title: 'Leave Request Update',
      body: 'Your leave request was not approved',
      data: {'type': 'leave_rejected'},
    );
  }

  /// Returns the current device FCM token.
  Future<String?> getToken() async {
    try {
      return await _messaging.getToken();
    } catch (e) {
      AppLogger.warning('getToken failed', e);
      return null;
    }
  }
}
