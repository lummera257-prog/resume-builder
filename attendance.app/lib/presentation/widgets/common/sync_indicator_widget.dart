import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/services/sync_service.dart';

/// Small AppBar status icon showing offline queue state.
/// Tap opens a bottom sheet with sync details.
class SyncIndicatorWidget extends ConsumerWidget {
  const SyncIndicatorWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statusAsync = ref.watch(syncStatusProvider);
    final pendingCountAsync = ref.watch(pendingSyncCountProvider);

    final status = statusAsync.value ?? SyncStatus.online;
    final pendingCount = pendingCountAsync.value ?? 0;

    return IconButton(
      tooltip: 'Sync Status',
      onPressed: () => _showSyncBottomSheet(context, status, pendingCount),
      icon: Stack(
        clipBehavior: Clip.none,
        children: [
          _buildIcon(status, pendingCount),
          if (pendingCount > 0)
            Positioned(
              right: -4,
              top: -4,
              child: Container(
                padding: const EdgeInsets.all(3),
                decoration: const BoxDecoration(
                  color: AppColors.accent,
                  shape: BoxShape.circle,
                ),
                constraints: const BoxConstraints(
                  minWidth: 16,
                  minHeight: 16,
                ),
                child: Text(
                  pendingCount > 99 ? '99+' : '$pendingCount',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildIcon(SyncStatus status, int pendingCount) {
    if (status == SyncStatus.syncing) {
      return const SizedBox(
        width: 20,
        height: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
        ),
      );
    }

    if (status == SyncStatus.offline) {
      return const Icon(
        Icons.cloud_off_rounded,
        color: Color(0xFFFFCC80), // Light orange
        size: 22,
      );
    }

    if (pendingCount > 0) {
      return const Icon(
        Icons.cloud_upload_rounded,
        color: Color(0xFFFFCC80),
        size: 22,
      );
    }

    return const Icon(
      Icons.cloud_done_rounded,
      color: Colors.white,
      size: 22,
    );
  }

  void _showSyncBottomSheet(
    BuildContext context,
    SyncStatus status,
    int pendingCount,
  ) {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    pendingCount == 0
                        ? Icons.check_circle_rounded
                        : Icons.sync_rounded,
                    color: pendingCount == 0
                        ? AppColors.attendancePresent
                        : AppColors.accent,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Text(
                    pendingCount == 0 ? 'Everything Synced' : 'Sync in Progress',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                pendingCount == 0
                    ? 'All attendance and employee records are securely synced with cloud backup.'
                    : '$pendingCount records stored locally on your device and will upload as soon as your connection stabilizes.',
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(ctx);
                  SyncService.instance.flush();
                },
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Sync Now'),
              ),
            ],
          ),
        );
      },
    );
  }
}
