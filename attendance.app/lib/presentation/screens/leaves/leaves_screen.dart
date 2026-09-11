import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/models/leave_request_model.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/widgets/common/empty_state_widget.dart';
import 'package:payclock/services/notification_service.dart';

/// Screen listing Pending, Approved, and Rejected leaves with one-tap decision actions.
class LeavesScreen extends ConsumerWidget {
  const LeavesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final leavesAsync = ref.watch(leavesProvider(companyId));
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Leave Management'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Pending'),
              Tab(text: 'Approved'),
              Tab(text: 'Rejected'),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () {
            Navigator.of(context).pushNamed(AppRoutes.applyLeave);
          },
          icon: const Icon(Icons.add_rounded),
          label: const Text('Apply Leave'),
        ),
        body: leavesAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Center(child: Text('Error: $err')),
          data: (allLeaves) {
            // Enrich employee details
            final enrichedLeaves = allLeaves.map((leave) {
              final emp = employees.where((e) => e.id == leave.employeeId).firstOrNull;
              return leave.copyWith(
                employeeName: emp?.name ?? 'Employee',
                employeeCode: emp?.employeeCode ?? 'EMP',
              );
            }).toList();

            final pending = enrichedLeaves.where((l) => l.isPending).toList();
            final approved = enrichedLeaves.where((l) => l.isApproved).toList();
            final rejected = enrichedLeaves.where((l) => l.isRejected).toList();

            return TabBarView(
              children: [
                _buildList(context, ref, pending, isPendingTab: true),
                _buildList(context, ref, approved),
                _buildList(context, ref, rejected),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildList(
    BuildContext context,
    WidgetRef ref,
    List<LeaveRequestModel> list, {
    bool isPendingTab = false,
  }) {
    if (list.isEmpty) {
      return const EmptyStateWidget(
        title: 'No leave requests',
        subtitle: 'Leave requests in this category will appear here.',
        icon: Icons.event_available_rounded,
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
      itemBuilder: (context, index) {
        final leave = list[index];
        return _leaveCard(context, ref, leave, isPendingTab);
      },
    );
  }

  Widget _leaveCard(
    BuildContext context,
    WidgetRef ref,
    LeaveRequestModel leave,
    bool isPendingTab,
  ) {
    final start = DateTime.tryParse(leave.startDate);
    final end = DateTime.tryParse(leave.endDate);
    final dateRangeStr = start != null && end != null
        ? '${DateFormat('dd MMM').format(start)} – ${DateFormat('dd MMM yyyy').format(end)}'
        : '${leave.startDate} to ${leave.endDate}';

    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.avatarColorFromName(leave.employeeName ?? ''),
                  child: Text(
                    (leave.employeeName ?? 'E')[0].toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        leave.employeeName ?? 'Employee',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '${leave.type.emoji} ${leave.type.displayName} • ${leave.durationDays} day(s)',
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _statusColor(leave.status).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    leave.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: _statusColor(leave.status),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: [
                const Icon(Icons.date_range, size: 16, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text(
                  dateRangeStr,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ],
            ),
            if (leave.reason != null && leave.reason!.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.xs),
              Text(
                'Reason: "${leave.reason}"',
                style: const TextStyle(
                  fontSize: 13,
                  fontStyle: FontStyle.italic,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
            if (isPendingTab) ...[
              const SizedBox(height: AppSpacing.md),
              const Divider(height: 1),
              const SizedBox(height: AppSpacing.sm),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                    ),
                    onPressed: () => _handleReject(context, ref, leave),
                    icon: const Icon(Icons.close_rounded, size: 16),
                    label: const Text('Reject'),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.attendancePresent,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () => _handleApprove(context, ref, leave),
                    icon: const Icon(Icons.check_rounded, size: 16),
                    label: const Text('Approve'),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
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

  Future<void> _handleApprove(
    BuildContext context,
    WidgetRef ref,
    LeaveRequestModel leave,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Approve Leave Request?'),
        content: Text('Approve ${leave.durationDays} day(s) leave for ${leave.employeeName}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Approve'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final company = ref.read(companyProvider).value;
      if (company == null) return;

      await ref.read(leavesProvider(company.id).notifier).approveLeave(leave.id);

      // Auto-create attendance records with status = paid_leave for those dates
      final start = DateTime.tryParse(leave.startDate);
      final end = DateTime.tryParse(leave.endDate);
      if (start != null && end != null) {
        var curr = start;
        while (!curr.isAfter(end)) {
          final dateStr =
              '${curr.year.toString().padLeft(4, '0')}-${curr.month.toString().padLeft(2, '0')}-${curr.day.toString().padLeft(2, '0')}';
          await ref.read(attendanceRepoProvider).markAttendance(
                AttendanceModel(
                  id: '',
                  employeeId: leave.employeeId,
                  companyId: company.id,
                  date: dateStr,
                  status: AttendanceStatus.paidLeave,
                ),
              );
          curr = curr.add(const Duration(days: 1));
        }
      }

      // Non-blocking FCM notification
      NotificationService.instance.notifyLeaveApproved(
        employeeToken: 'placeholder_token',
        durationDays: leave.durationDays,
        leaveType: leave.type.displayName,
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Leave request approved! ✅'),
            backgroundColor: AppColors.attendancePresent,
          ),
        );
      }
    }
  }

  Future<void> _handleReject(
    BuildContext context,
    WidgetRef ref,
    LeaveRequestModel leave,
  ) async {
    final reasonController = TextEditingController();

    final confirmed = await showModalBottomSheet<bool>(
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
              const Text(
                'Reject Leave Request',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                controller: reasonController,
                decoration: const InputDecoration(
                  labelText: 'Optional rejection reason',
                  hintText: 'e.g. Critical project deadline',
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(ctx, false),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () => Navigator.pop(ctx, true),
                      child: const Text('Reject Leave'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );

    if (confirmed == true) {
      final company = ref.read(companyProvider).value;
      if (company == null) return;

      await ref.read(leavesProvider(company.id).notifier).rejectLeave(
            leave.id,
            reason: reasonController.text.trim().isNotEmpty
                ? reasonController.text.trim()
                : null,
          );

      NotificationService.instance.notifyLeaveRejected(
        employeeToken: 'placeholder_token',
      );

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Leave request rejected.'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }
}
