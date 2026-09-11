import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/data/models/payroll_model.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/providers/payroll_provider.dart';
import 'package:payclock/presentation/providers/subscription_provider.dart';
import 'package:payclock/presentation/widgets/common/premium_lock_widget.dart';
import 'package:payclock/services/ads_service.dart';
import 'package:payclock/services/sync_service.dart';

/// Interactive payroll calculator with editable cells, automatic formula evaluation, and batch approval.
class PayrollScreen extends ConsumerStatefulWidget {
  const PayrollScreen({super.key});

  @override
  ConsumerState<PayrollScreen> createState() => _PayrollScreenState();
}

class _PayrollScreenState extends ConsumerState<PayrollScreen> {
  DateTime _selectedMonth = DateTime(DateTime.now().year, DateTime.now().month);
  final Map<String, PayrollModel> _workingPayroll = {};

  void _prevMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1);
      _workingPayroll.clear();
    });
  }

  void _nextMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1);
      _workingPayroll.clear();
    });
  }

  void _calculateAllSalaries() {
    final company = ref.read(companyProvider).value;
    if (company == null) return;

    final employees = ref.read(employeesProvider(company.id)).value ?? [];
    final monthlyAttendance = ref.read(
      monthlyAttendanceProvider((
        companyId: company.id,
        month: _selectedMonth.month,
        year: _selectedMonth.year,
      )),
    ).value ?? [];

    // Default working days ~26 or custom
    const workingDays = 26.0;

    setState(() {
      _workingPayroll.clear();
      for (final emp in employees) {
        final empAttendance =
            monthlyAttendance.where((a) => a.employeeId == emp.id).toList();

        double present = 0;
        double half = 0;
        double paidLeave = 0;
        double unpaidLeave = 0;
        double ot = 0;

        for (final a in empAttendance) {
          switch (a.status) {
            case AttendanceStatus.present:
              present++;
              break;
            case AttendanceStatus.absent:
              break;
            case AttendanceStatus.halfDay:
              half++;
              break;
            case AttendanceStatus.paidLeave:
              paidLeave++;
              break;
            case AttendanceStatus.unpaidLeave:
              unpaidLeave++;
              break;
            case AttendanceStatus.holiday:
            case AttendanceStatus.weekOff:
              break;
          }
          ot += a.overtimeHours;
        }

        // If no records at all, assume full attendance preview
        if (empAttendance.isEmpty) {
          present = workingDays;
        }

        final model = PayrollModel(
          id: '',
          employeeId: emp.id,
          companyId: company.id,
          month: _selectedMonth.month,
          year: _selectedMonth.year,
          employeeName: emp.name,
          employeeCode: emp.employeeCode,
          designation: emp.designation,
          totalWorkingDays: workingDays,
          daysPresent: present,
          halfDays: half,
          paidLeaveDays: paidLeave,
          unpaidLeaveDays: unpaidLeave,
          overtimeHours: ot,
          baseSalary: emp.baseSalary,
          manualBonus: 0,
        ).recalculate();

        _workingPayroll[emp.id] = model;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Calculated salaries for all team members.'),
        backgroundColor: AppColors.attendancePresent,
      ),
    );
  }

  void _editCell(String employeeId, String fieldName, double currentValue) {
    final controller = TextEditingController(text: currentValue.toStringAsFixed(1));

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
              Text('Edit $fieldName', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                controller: controller,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: InputDecoration(labelText: 'New $fieldName value'),
              ),
              const SizedBox(height: AppSpacing.lg),
              ElevatedButton(
                onPressed: () {
                  final val = double.tryParse(controller.text) ?? currentValue;
                  final current = _workingPayroll[employeeId];
                  if (current != null) {
                    PayrollModel updated;
                    switch (fieldName) {
                      case 'Days Present':
                        updated = current.copyWith(daysPresent: val).recalculate();
                        break;
                      case 'Half Days':
                        updated = current.copyWith(halfDays: val).recalculate();
                        break;
                      case 'Overtime Hours':
                        updated = current.copyWith(overtimeHours: val).recalculate();
                        break;
                      case 'Bonus':
                        updated = current.copyWith(manualBonus: val).recalculate();
                        break;
                      default:
                        updated = current;
                    }
                    setState(() => _workingPayroll[employeeId] = updated);
                  }
                  Navigator.pop(ctx);
                },
                child: const Text('Update'),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _approvePayroll() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Approve Payroll?'),
        content: Text(
          'Approve payroll for ${DateFormat('MMMM yyyy').format(_selectedMonth)}?\n'
          'This will lock the records and prepare all salary slips.',
        ),
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

      final records = _workingPayroll.values
          .map((p) => p.copyWith(status: 'approved'))
          .toList();

      await ref.read(payrollRepoProvider).upsertBulkPayroll(records);

      if (!mounted) return;

      // Show Interstitial ad after payslip generation (once per session)
      final isPremium = ref.read(isPremiumProvider).value ?? false;
      if (!SyncService.instance.interstitialShownThisSession) {
        await AdsService.instance.showInterstitial(isPremium: isPremium);
        SyncService.instance.markInterstitialShown();
      }

      if (!mounted) return;
      Navigator.of(context).pushNamed(AppRoutes.payslipList);
    }
  }

  @override
  Widget build(BuildContext context) {
    // 1. Premium Check Gate
    final isPremium = ref.watch(isPremiumProvider).value ?? false;
    if (!isPremium) {
      return Scaffold(
        appBar: AppBar(title: const Text('Payroll Automation')),
        body: const PremiumLockWidget(
          featureName: 'Payroll Automation',
          reason: 'Automatically calculate salaries and generate compliant payslips.',
        ),
      );
    }

    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];
    final pendingLeaves = ref.watch(pendingLeavesCountProvider(companyId)).value ?? 0;

    // Load existing records if not in working payroll
    if (_workingPayroll.isEmpty && employees.isNotEmpty) {
      _calculateAllSalaries();
    }

    double totalPayrollAmount = 0;
    for (final p in _workingPayroll.values) {
      totalPayrollAmount += p.netSalary;
    }

    final monthStr = DateFormat('MMMM yyyy').format(_selectedMonth);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Payroll Calculator'),
        actions: [
          IconButton(
            icon: const Icon(Icons.receipt_long_rounded),
            tooltip: 'Payslips',
            onPressed: () {
              Navigator.of(context).pushNamed(AppRoutes.payslipList);
            },
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, -2)),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total Net: ${CurrencyFormatter.format(totalPayrollAmount)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                Text(
                  '${_workingPayroll.length} Employees',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.sm),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _calculateAllSalaries,
                    child: const Text('Recalculate'),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: _approvePayroll,
                    child: Text('Approve $monthStr'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Month Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
            color: AppColors.surface,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(icon: const Icon(Icons.chevron_left), onPressed: _prevMonth),
                Text(monthStr, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.chevron_right), onPressed: _nextMonth),
              ],
            ),
          ),

          // Status Banner
          if (pendingLeaves > 0)
            Container(
              color: Colors.amber.shade100,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Icon(Icons.warning_amber_rounded, color: Colors.amber.shade900, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '$pendingLeaves leave request(s) pending. Review before final approval.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.amber.shade900,
                      ),
                    ),
                  ),
                ],
              ),
            )
          else
            Container(
              color: AppColors.attendancePresent.withOpacity(0.1),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: const Row(
                children: [
                  Icon(Icons.check_circle_outline, color: AppColors.attendancePresent, size: 16),
                  SizedBox(width: 8),
                  Text(
                    'All attendance and leave data ready for calculation.',
                    style: TextStyle(fontSize: 12, color: AppColors.attendancePresent, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),

          // Scrollable Table
          Expanded(
            child: _workingPayroll.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: DataTable(
                        columnSpacing: 18,
                        columns: const [
                          DataColumn(label: Text('Employee', style: TextStyle(fontWeight: FontWeight.bold))),
                          DataColumn(label: Text('Working Days')),
                          DataColumn(label: Text('Present (tap)')),
                          DataColumn(label: Text('Half (tap)')),
                          DataColumn(label: Text('OT Hrs (tap)')),
                          DataColumn(label: Text('Bonus (tap)')),
                          DataColumn(label: Text('Gross')),
                          DataColumn(label: Text('Deduction')),
                          DataColumn(label: Text('Net Salary', style: TextStyle(fontWeight: FontWeight.bold))),
                        ],
                        rows: _workingPayroll.values.map((p) {
                          return DataRow(
                            cells: [
                              DataCell(
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(p.employeeName ?? 'EMP', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    Text(p.employeeCode ?? '', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                                  ],
                                ),
                              ),
                              DataCell(Text(p.totalWorkingDays.toStringAsFixed(0))),
                              DataCell(
                                Text(p.daysPresent.toStringAsFixed(1), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                                onTap: () => _editCell(p.employeeId, 'Days Present', p.daysPresent),
                              ),
                              DataCell(
                                Text(p.halfDays.toStringAsFixed(0)),
                                onTap: () => _editCell(p.employeeId, 'Half Days', p.halfDays),
                              ),
                              DataCell(
                                Text(p.overtimeHours.toStringAsFixed(1)),
                                onTap: () => _editCell(p.employeeId, 'Overtime Hours', p.overtimeHours),
                              ),
                              DataCell(
                                Text(CurrencyFormatter.format(p.manualBonus)),
                                onTap: () => _editCell(p.employeeId, 'Bonus', p.manualBonus),
                              ),
                              DataCell(Text(CurrencyFormatter.format(p.grossSalary))),
                              DataCell(Text(CurrencyFormatter.format(p.unpaidDeduction), style: const TextStyle(color: AppColors.error))),
                              DataCell(
                                Text(
                                  CurrencyFormatter.format(p.netSalary),
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.attendancePresent),
                                ),
                              ),
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
