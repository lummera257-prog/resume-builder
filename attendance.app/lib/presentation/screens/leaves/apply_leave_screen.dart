import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/utils/validators.dart';
import 'package:payclock/data/models/leave_request_model.dart';
import 'package:payclock/domain/enums/leave_type.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/widgets/common/app_button.dart';
import 'package:payclock/presentation/widgets/common/app_text_field.dart';
import 'package:payclock/presentation/widgets/common/loading_overlay.dart';
import 'package:payclock/services/notification_service.dart';

/// Screen allowing employees or managers to submit a leave request.
class ApplyLeaveScreen extends ConsumerStatefulWidget {
  const ApplyLeaveScreen({
    super.key,
    this.employeeId,
  });

  final String? employeeId;

  @override
  ConsumerState<ApplyLeaveScreen> createState() => _ApplyLeaveScreenState();
}

class _ApplyLeaveScreenState extends ConsumerState<ApplyLeaveScreen> {
  final _formKey = GlobalKey<FormState>();
  final _reasonController = TextEditingController();

  String? _selectedEmployeeId;
  LeaveType _selectedType = LeaveType.casual;
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _selectedEmployeeId = widget.employeeId;
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  int get _calculatedDuration {
    var count = 0;
    var curr = DateTime(_startDate.year, _startDate.month, _startDate.day);
    final end = DateTime(_endDate.year, _endDate.month, _endDate.day);

    while (!curr.isAfter(end)) {
      if (curr.weekday != DateTime.sunday) {
        count++;
      }
      curr = curr.add(const Duration(days: 1));
    }
    return count > 0 ? count : 1;
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedEmployeeId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an employee.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final company = ref.read(companyProvider).value;
      if (company == null) throw Exception('Company not loaded.');

      final req = LeaveRequestModel(
        id: '',
        employeeId: _selectedEmployeeId!,
        companyId: company.id,
        type: _selectedType,
        startDate: DateFormat('yyyy-MM-dd').format(_startDate),
        endDate: DateFormat('yyyy-MM-dd').format(_endDate),
        reason: _reasonController.text.trim().isNotEmpty
            ? _reasonController.text.trim()
            : null,
      );

      await ref.read(leavesProvider(company.id).notifier).createLeave(req);

      // Trigger notification to owner
      final emp = ref
          .read(employeesProvider(company.id))
          .value
          ?.where((e) => e.id == _selectedEmployeeId)
          .firstOrNull;

      NotificationService.instance.notifyLeaveRequest(
        ownerToken: 'owner_token_placeholder',
        employeeName: emp?.name ?? 'Employee',
        durationDays: _calculatedDuration,
        leaveType: _selectedType.displayName,
        startDate: DateFormat('dd MMM').format(_startDate),
        endDate: DateFormat('dd MMM').format(_endDate),
      );

      if (!mounted) return;
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Leave request submitted successfully!'),
          backgroundColor: AppColors.attendancePresent,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed: $e'), backgroundColor: AppColors.error),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Apply for Leave'),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, -2)),
          ],
        ),
        child: AppButton.primary(
          text: 'Submit Leave Request',
          onPressed: _handleSubmit,
        ),
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        message: 'Submitting request...',
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.screenPadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Employee Selector
                const Text(
                  'Employee *',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                DropdownButtonFormField<String>(
                  value: _selectedEmployeeId ?? (employees.isNotEmpty ? employees.first.id : null),
                  decoration: const InputDecoration(),
                  items: employees.map((e) {
                    return DropdownMenuItem(
                      value: e.id,
                      child: Text('${e.name} (${e.employeeCode})'),
                    );
                  }).toList(),
                  onChanged: (val) => setState(() => _selectedEmployeeId = val),
                  validator: (v) => v == null ? 'Please select an employee' : null,
                ),

                const SizedBox(height: AppSpacing.lg),

                // Leave Type
                const Text(
                  'Leave Type',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                Wrap(
                  spacing: AppSpacing.sm,
                  children: [LeaveType.casual, LeaveType.sick, LeaveType.unpaid].map((type) {
                    final isSelected = _selectedType == type;
                    return ChoiceChip(
                      label: Text('${type.emoji} ${type.displayName}'),
                      selected: isSelected,
                      selectedColor: AppColors.primary.withOpacity(0.15),
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedType = type);
                      },
                    );
                  }).toList(),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Date Range Pickers
                Row(
                  children: [
                    Expanded(
                      child: _datePickerField(
                        'Start Date',
                        _startDate,
                        (picked) {
                          setState(() {
                            _startDate = picked;
                            if (_endDate.isBefore(_startDate)) {
                              _endDate = _startDate;
                            }
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: _datePickerField(
                        'End Date',
                        _endDate,
                        (picked) {
                          setState(() => _endDate = picked);
                        },
                        firstDate: _startDate,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: AppSpacing.md),

                // Duration Indicator
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.info.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.info_outline, size: 16, color: AppColors.info),
                      const SizedBox(width: 6),
                      Text(
                        'Duration: $_calculatedDuration working day(s)',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.info,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Reason Field
                AppTextField(
                  label: _selectedType.requiresReason ? 'Reason for Sick Leave *' : 'Reason (optional)',
                  hint: _selectedType.requiresReason
                      ? 'e.g. High fever and doctor consultation'
                      : 'e.g. Family function',
                  controller: _reasonController,
                  maxLines: 3,
                  validator: (val) {
                    if (_selectedType.requiresReason) {
                      return AppValidators.validateRequired(val, 'Reason');
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _datePickerField(
    String label,
    DateTime date,
    ValueChanged<DateTime> onPicked, {
    DateTime? firstDate,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: AppSpacing.xs),
        InkWell(
          onTap: () async {
            final picked = await showDatePicker(
              context: context,
              initialDate: date,
              firstDate: firstDate ?? DateTime(2020),
              lastDate: DateTime(2030),
            );
            if (picked != null) onPicked(picked);
          },
          child: Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.divider),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  DateFormat('dd MMM yyyy').format(date),
                  style: const TextStyle(fontSize: 14),
                ),
                const Icon(Icons.calendar_today_rounded, size: 18),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
