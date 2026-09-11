import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';

/// Screen displaying complete details for a single leave request.
class LeaveDetailScreen extends ConsumerWidget {
  const LeaveDetailScreen({
    super.key,
    required this.leaveId,
  });

  final String leaveId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final leavesAsync = ref.watch(leavesProvider(companyId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Leave Request Details'),
      ),
      body: leavesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
        data: (leaves) {
          final leave = leaves.where((l) => l.id == leaveId).firstOrNull;
          if (leave == null) {
            return const Center(child: Text('Leave request not found.'));
          }

          final start = DateTime.tryParse(leave.startDate);
          final end = DateTime.tryParse(leave.endDate);
          final dateStr = start != null && end != null
              ? '${DateFormat('dd MMMM yyyy').format(start)} to ${DateFormat('dd MMMM yyyy').format(end)}'
              : '${leave.startDate} to ${leave.endDate}';

          return Padding(
            padding: const EdgeInsets.all(AppSpacing.screenPadding),
            child: Card(
              elevation: 1,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.lg),
                side: const BorderSide(color: AppColors.divider),
              ),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${leave.type.emoji} ${leave.type.displayName}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: _statusColor(leave.status).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: Text(
                            leave.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _statusColor(leave.status),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    const Divider(),
                    const SizedBox(height: AppSpacing.md),
                    _detailItem('Duration', '${leave.durationDays} day(s)'),
                    const SizedBox(height: AppSpacing.sm),
                    _detailItem('Date Range', dateStr),
                    if (leave.reason != null && leave.reason!.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.sm),
                      _detailItem('Employee Reason', leave.reason!),
                    ],
                    if (leave.rejectionReason != null &&
                        leave.rejectionReason!.isNotEmpty) ...[
                      const SizedBox(height: AppSpacing.sm),
                      _detailItem('Rejection Remarks', leave.rejectionReason!),
                    ],
                    if (leave.createdAt != null) ...[
                      const SizedBox(height: AppSpacing.sm),
                      _detailItem(
                        'Submitted On',
                        DateFormat('dd MMM yyyy, hh:mm a').format(leave.createdAt!),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _detailItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
        return AppColors.attendancePresent;
      case 'rejected':
        return AppColors.error;
      default:
        return AppColors.warning;
    }
  }
}
