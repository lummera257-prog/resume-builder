import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/auth_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/widgets/ads/banner_ad_widget.dart';
import 'package:payclock/presentation/widgets/common/sync_indicator_widget.dart';

/// Tab 0 of Dashboard: Summary, smart alerts, today's attendance snapshot, and quick access grid.
class HomeTab extends ConsumerWidget {
  const HomeTab({
    super.key,
    required this.onNavigateToTab,
  });

  final ValueChanged<int> onNavigateToTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final companyAsync = ref.watch(companyProvider);
    final company = companyAsync.value;
    final companyId = company?.id ?? '';
    final ownerName = ref.watch(currentUserNameProvider);

    final employeesAsync = ref.watch(employeesProvider(companyId));
    final todayAttendanceAsync = ref.watch(todayAttendanceProvider(companyId));
    final pendingLeavesAsync = ref.watch(pendingLeavesCountProvider(companyId));

    final employees = employeesAsync.value ?? [];
    final todayAttendance = todayAttendanceAsync.value ?? [];
    final pendingLeaves = pendingLeavesAsync.value ?? 0;

    final now = DateTime.now();
    final formattedDate = DateFormat('EEEE, d MMMM yyyy').format(now);
    final monthName = DateFormat('MMMM yyyy').format(now);

    // Calculate today's status counts
    int presentCount = 0;
    int absentCount = 0;
    int halfCount = 0;
    int leaveCount = 0;

    for (final att in todayAttendance) {
      switch (att.status) {
        case AttendanceStatus.present:
          presentCount++;
          break;
        case AttendanceStatus.absent:
          absentCount++;
          break;
        case AttendanceStatus.halfDay:
          halfCount++;
          break;
        case AttendanceStatus.paidLeave:
        case AttendanceStatus.unpaidLeave:
          leaveCount++;
          break;
        case AttendanceStatus.holiday:
        case AttendanceStatus.weekOff:
          break;
      }
    }

    final totalEmployees = employees.length;
    final unmarkedCount =
        totalEmployees > todayAttendance.length ? totalEmployees - todayAttendance.length : 0;

    // Estimated payroll calculation
    double totalEstSalary = 0;
    for (final emp in employees) {
      totalEstSalary += emp.monthlyEquivalent;
    }

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good Day, $ownerName 👋',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            if (company != null)
              Text(
                company.name,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white.withOpacity(0.85),
                ),
              ),
          ],
        ),
        actions: const [
          SyncIndicatorWidget(),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(companyProvider.notifier).refresh();
          if (companyId.isNotEmpty) {
            await ref.read(employeesProvider(companyId).notifier).refresh(companyId);
            await ref.read(todayAttendanceProvider(companyId).notifier).refresh(companyId);
            ref.invalidate(pendingLeavesCountProvider(companyId));
          }
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppSpacing.screenPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Today Summary Card (Green Gradient)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.cardPadding),
                decoration: BoxDecoration(
                  gradient: AppColors.cardGradient,
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'TODAY\'S ATTENDANCE',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                        Text(
                          '$presentCount / $totalEmployees',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      formattedDate,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _statusTile('✅', 'Present', presentCount),
                        _statusTile('❌', 'Absent', absentCount),
                        _statusTile('🕐', 'Half Day', halfCount),
                        _statusTile('🌿', 'Leave', leaveCount),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 44),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                        ),
                      ),
                      onPressed: () {
                        Navigator.of(context).pushNamed(AppRoutes.markAttendance);
                      },
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.edit_calendar_rounded, size: 18),
                          SizedBox(width: AppSpacing.xs),
                          Text(
                            'Mark Today\'s Attendance →',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // 2. Smart Alerts (Conditional)
              if (pendingLeaves > 0)
                _alertCard(
                  context,
                  color: AppColors.warning,
                  icon: Icons.assignment_late_outlined,
                  message: '$pendingLeaves leave request(s) need your approval',
                  onTap: () => onNavigateToTab(2), // Leaves/Attendance
                ),

              if (unmarkedCount > 0 && totalEmployees > 0) ...[
                const SizedBox(height: AppSpacing.xs),
                _alertCard(
                  context,
                  color: Colors.amber.shade800,
                  icon: Icons.warning_amber_rounded,
                  message: '$unmarkedCount employee(s) not marked today',
                  onTap: () {
                    Navigator.of(context).pushNamed(AppRoutes.markAttendance);
                  },
                ),
              ],

              const SizedBox(height: AppSpacing.md),

              // 3. This Month Overview Card
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.cardPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '$monthName Overview',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Day ${now.day}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      LinearProgressIndicator(
                        value: now.day / 30,
                        backgroundColor: AppColors.surfaceVariant,
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          AppColors.primary,
                        ),
                        minHeight: 6,
                        borderRadius: BorderRadius.circular(3),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Estimated Monthly Payroll',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                CurrencyFormatter.format(totalEstSalary),
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              ),
                            ],
                          ),
                          OutlinedButton(
                            onPressed: () => onNavigateToTab(3), // Payroll tab
                            child: const Text('View Payroll'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.lg),

              // 4. Quick Access 2x2 Grid
              const Text(
                'Quick Access',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: AppSpacing.sm),
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: AppSpacing.md,
                mainAxisSpacing: AppSpacing.md,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.35,
                children: [
                  _quickActionCard(
                    title: 'Team',
                    subtitle: '$totalEmployees active',
                    icon: Icons.people_outline_rounded,
                    color: AppColors.primary,
                    onTap: () => onNavigateToTab(1),
                  ),
                  _quickActionCard(
                    title: 'Attendance',
                    subtitle: '${todayAttendance.length}/$totalEmployees marked',
                    icon: Icons.calendar_today_rounded,
                    color: AppColors.secondary,
                    onTap: () {
                      Navigator.of(context).pushNamed(AppRoutes.markAttendance);
                    },
                  ),
                  _quickActionCard(
                    title: 'Leaves',
                    subtitle: '$pendingLeaves pending',
                    icon: Icons.event_note_rounded,
                    color: AppColors.info,
                    onTap: () {
                      Navigator.of(context).pushNamed(AppRoutes.leaves);
                    },
                  ),
                  _quickActionCard(
                    title: 'Payroll',
                    subtitle: CurrencyFormatter.formatCompact(totalEstSalary),
                    icon: Icons.receipt_long_rounded,
                    color: AppColors.accent,
                    onTap: () => onNavigateToTab(3),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.lg),

              // 5. AdMob Banner (Only for free users)
              const Center(child: BannerAdWidget()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusTile(String emoji, String title, int count) {
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 20)),
        const SizedBox(height: 2),
        Text(
          '$count',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          title,
          style: TextStyle(
            color: Colors.white.withOpacity(0.85),
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _alertCard(
    BuildContext context, {
    required Color color,
    required IconData icon,
    required String message,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                message,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ),
            Icon(Icons.chevron_right, color: color, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _quickActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: Card(
        elevation: 1.5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
