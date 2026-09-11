import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/data/models/payroll_model.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/payroll_provider.dart';
import 'package:payclock/presentation/widgets/common/empty_state_widget.dart';
import 'package:payclock/services/pdf_service.dart';
import 'package:payclock/services/share_service.dart';

/// Screen displaying all generated payslips with instant PDF Preview, WhatsApp, and Email sharing.
class PayslipListScreen extends ConsumerStatefulWidget {
  const PayslipListScreen({super.key});

  @override
  ConsumerState<PayslipListScreen> createState() => _PayslipListScreenState();
}

class _PayslipListScreenState extends ConsumerState<PayslipListScreen> {
  DateTime _selectedMonth = DateTime(DateTime.now().year, DateTime.now().month);
  bool _isGenerating = false;

  void _prevMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1);
    });
  }

  Future<void> _shareWhatsApp(PayrollModel payroll) async {
    setState(() => _isGenerating = true);
    try {
      final company = ref.read(companyProvider).value;
      final emp = ref
          .read(employeesProvider(company?.id ?? ''))
          .value
          ?.where((e) => e.id == payroll.employeeId)
          .firstOrNull;

      if (company == null || emp == null) return;

      final pdfBytes = await PdfService.instance.generatePayslipPdf(
        company: company,
        employee: emp,
        payroll: payroll,
      );

      final monthName =
          DateFormat('MMMM yyyy').format(DateTime(payroll.year, payroll.month));

      await ShareService.instance.shareViaWhatsApp(
        phone: emp.phone ?? '',
        employeeName: emp.name,
        month: monthName,
        netSalary: payroll.netSalary,
        pdfBytes: pdfBytes,
      );
    } finally {
      if (mounted) setState(() => _isGenerating = false);
    }
  }

  Future<void> _previewPdf(PayrollModel payroll) async {
    setState(() => _isGenerating = true);
    try {
      final company = ref.read(companyProvider).value;
      final emp = ref
          .read(employeesProvider(company?.id ?? ''))
          .value
          ?.where((e) => e.id == payroll.employeeId)
          .firstOrNull;

      if (company == null || emp == null) return;

      final pdfBytes = await PdfService.instance.generatePayslipPdf(
        company: company,
        employee: emp,
        payroll: payroll,
      );

      final monthName =
          DateFormat('MMMM yyyy').format(DateTime(payroll.year, payroll.month));

      await ShareService.instance.previewPayslip(
        pdfBytes,
        '${emp.name}_${monthName}_Salary_Slip',
      );
    } finally {
      if (mounted) setState(() => _isGenerating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];

    final payrollAsync = ref.watch(
      payrollProvider((
        companyId: companyId,
        month: _selectedMonth.month,
        year: _selectedMonth.year,
      )),
    );

    final monthStr = DateFormat('MMMM yyyy').format(_selectedMonth);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Salary Slips'),
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

          if (_isGenerating)
            const LinearProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.accent),
              minHeight: 3,
            ),

          // List of Payslips
          Expanded(
            child: payrollAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(child: Text('Error: $err')),
              data: (list) {
                if (list.isEmpty) {
                  return EmptyStateWidget(
                    title: 'No payslips for $monthStr',
                    subtitle: 'Calculate and approve payroll to generate salary slips.',
                    icon: Icons.receipt_long_rounded,
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  itemCount: list.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, index) {
                    final payroll = list[index];
                    final emp = employees
                        .where((e) => e.id == payroll.employeeId)
                        .firstOrNull;

                    final name = emp?.name ?? payroll.employeeName ?? 'Employee';
                    final code = emp?.employeeCode ?? payroll.employeeCode ?? 'EMP';

                    return Card(
                      elevation: 1,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        side: const BorderSide(color: AppColors.divider),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 20,
                                  backgroundColor: AppColors.avatarColorFromName(name),
                                  child: Text(
                                    name.isNotEmpty ? name[0].toUpperCase() : 'E',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.md),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        name,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        '$code • Net: ${CurrencyFormatter.format(payroll.netSalary)}',
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  CurrencyFormatter.format(payroll.netSalary),
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.md),
                            const Divider(height: 1),
                            const SizedBox(height: AppSpacing.xs),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton.icon(
                                  onPressed: () => _previewPdf(payroll),
                                  icon: const Icon(Icons.visibility_outlined, size: 18),
                                  label: const Text('Preview PDF'),
                                ),
                                const SizedBox(width: AppSpacing.xs),
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF25D366), // WhatsApp green
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    minimumSize: const Size(0, 36),
                                  ),
                                  onPressed: () => _shareWhatsApp(payroll),
                                  icon: const Icon(Icons.send_rounded, size: 16),
                                  label: const Text('WhatsApp'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
