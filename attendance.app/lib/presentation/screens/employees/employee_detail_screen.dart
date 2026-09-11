import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/models/payroll_model.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/payroll_provider.dart';

/// Detailed view for an individual employee with metrics, mini calendar, and history tabs.
class EmployeeDetailScreen extends ConsumerWidget {
  const EmployeeDetailScreen({
    super.key,
    required this.employeeId,
  });

  final String employeeId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final employeeAsync = ref.watch(employeeDetailProvider(employeeId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Employee Profile'),
        actions: [
          employeeAsync.when(
            data: (emp) => emp != null
                ? IconButton(
                    icon: const Icon(Icons.edit_rounded),
                    onPressed: () {
                      Navigator.of(context).pushNamed(
                        AppRoutes.addEmployee,
                        arguments: emp,
                      );
                    },
                  )
                : const SizedBox.shrink(),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
        ],
      ),
      body: employeeAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
        data: (employee) {
          if (employee == null) {
            return const Center(child: Text('Employee not found.'));
          }

          final now = DateTime.now();
          final monthlyAttendanceAsync = ref.watch(
            monthlyAttendanceProvider((
              companyId: employee.companyId,
              month: now.month,
              year: now.year,
            )),
          );

          final employeeAttendance = (monthlyAttendanceAsync.value ?? [])
              .where((a) => a.employeeId == employee.id)
              .toList();

          int pCount = 0;
          int aCount = 0;
          int lCount = 0;
          double otHours = 0;

          for (final a in employeeAttendance) {
            if (a.status == AttendanceStatus.present) pCount++;
            if (a.status == AttendanceStatus.absent) aCount++;
            if (a.status == AttendanceStatus.paidLeave ||
                a.status == AttendanceStatus.unpaidLeave) {
              lCount++;
            }
            otHours += a.overtimeHours;
          }

          return DefaultTabController(
            length: 2,
            child: NestedScrollView(
              headerSliverBuilder: (context, innerBoxIsScrolled) {
                return [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.screenPadding),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Profile Header Card
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 36,
                                backgroundColor: employee.avatarColor,
                                child: Text(
                                  employee.initials,
                                  style: const TextStyle(
                                    fontSize: 26,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: AppSpacing.md),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            employee.name,
                                            style: const TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 3,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppColors.primary.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            employee.employeeCode,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                              color: AppColors.primary,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      employee.designation ?? 'Team Member',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${CurrencyFormatter.format(employee.baseSalary)}${employee.salaryType.unitLabel}',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: AppSpacing.lg),

                          // Month Stats Row
                          Container(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                              border: Border.all(color: AppColors.divider),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _statColumn('Present', '$pCount', AppColors.attendancePresent),
                                _statColumn('Absent', '$aCount', AppColors.attendanceAbsent),
                                _statColumn('Leaves', '$lCount', AppColors.attendanceLeave),
                                _statColumn('Overtime', '${otHours.toStringAsFixed(1)}h', AppColors.accent),
                              ],
                            ),
                          ),

                          const SizedBox(height: AppSpacing.md),

                          // Quick Action Buttons
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () {
                                    Navigator.of(context).pushNamed(
                                      AppRoutes.applyLeave,
                                      arguments: employee.id,
                                    );
                                  },
                                  icon: const Icon(Icons.event_note, size: 18),
                                  label: const Text('Apply Leave'),
                                ),
                              ),
                              const SizedBox(width: AppSpacing.sm),
                              Expanded(
                                child: ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primary,
                                    foregroundColor: Colors.white,
                                  ),
                                  onPressed: () {
                                    Navigator.of(context).pushNamed(
                                      AppRoutes.attendanceCalendar,
                                      arguments: employee.id,
                                    );
                                  },
                                  icon: const Icon(Icons.calendar_month, size: 18),
                                  label: const Text('Calendar'),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SliverToBoxAdapter(
                    child: TabBar(
                      tabs: [
                        Tab(text: 'Attendance Log'),
                        Tab(text: 'Payroll History'),
                      ],
                    ),
                  ),
                ];
              },
              body: TabBarView(
                children: [
                  _buildAttendanceHistory(employeeAttendance),
                  _buildPayrollHistory(ref, employee.id),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _statColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceHistory(List<AttendanceModel> list) {
    if (list.isEmpty) {
      return const Center(child: Text('No attendance records for this month.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: list.length,
      separatorBuilder: (_, __) => const Divider(),
      itemBuilder: (context, index) {
        final record = list[index];
        return ListTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: record.status.color.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Text(record.status.emoji, style: const TextStyle(fontSize: 18)),
          ),
          title: Text(
            record.date,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Text(
            record.overtimeHours > 0
                ? '${record.status.displayName} • ${record.overtimeHours} hrs overtime'
                : record.status.displayName,
          ),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: record.status.color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              record.status.shortLabel,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: record.status.color,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPayrollHistory(WidgetRef ref, String employeeId) {
    final historyFuture = ref.watch(payrollRepoProvider).getEmployeePayrollHistory(employeeId);

    return FutureBuilder<List<PayrollModel>>(
      future: historyFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final records = snapshot.data ?? [];
        if (records.isEmpty) {
          return const Center(child: Text('No past payslips generated.'));
        }

        return ListView.separated(
          padding: const EdgeInsets.all(AppSpacing.md),
          itemCount: records.length,
          separatorBuilder: (_, __) => const Divider(),
          itemBuilder: (context, index) {
            final p = records[index];
            final monthName = DateFormat('MMMM yyyy').format(DateTime(p.year, p.month));
            return ListTile(
              leading: const Icon(Icons.receipt_long_rounded, color: AppColors.primary),
              title: Text(monthName, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(
                'Gross: ${CurrencyFormatter.format(p.grossSalary)} | Net: ${CurrencyFormatter.format(p.netSalary)}',
              ),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () {
                Navigator.of(context).pushNamed(AppRoutes.payslipList);
              },
            );
          },
        );
      },
    );
  }
}
