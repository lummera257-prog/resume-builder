import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/core/utils/validators.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/domain/enums/salary_type.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/widgets/common/app_button.dart';
import 'package:payclock/presentation/widgets/common/app_text_field.dart';
import 'package:payclock/presentation/widgets/common/loading_overlay.dart';

/// Screen for adding a new employee or editing an existing one.
class AddEmployeeScreen extends ConsumerStatefulWidget {
  const AddEmployeeScreen({
    super.key,
    this.employee,
  });

  final EmployeeModel? employee;

  @override
  ConsumerState<AddEmployeeScreen> createState() => _AddEmployeeScreenState();
}

class _AddEmployeeScreenState extends ConsumerState<AddEmployeeScreen> {
  final _formKey = GlobalKey<FormState>();

  // Basic Info
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _designationController = TextEditingController();
  final _codeController = TextEditingController();

  // Salary
  SalaryType _salaryType = SalaryType.monthly;
  final _salaryController = TextEditingController();

  // Schedule
  DateTime _joiningDate = DateTime.now();
  int _workDaysPerWeek = 6;
  bool _useCompanyShift = true;
  TimeOfDay _shiftStart = const TimeOfDay(hour: 9, minute: 0);
  TimeOfDay _shiftEnd = const TimeOfDay(hour: 18, minute: 0);

  // Leaves
  bool _useCompanyLeavePolicy = true;
  int _paidLeaves = 12;
  int _sickLeaves = 12;

  bool _isLoading = false;
  bool get _isEditMode => widget.employee != null;

  @override
  void initState() {
    super.initState();
    if (_isEditMode) {
      _initFromExisting(widget.employee!);
    } else {
      _fetchNextCode();
    }
  }

  void _initFromExisting(EmployeeModel emp) {
    _nameController.text = emp.name;
    _phoneController.text = emp.phone ?? '';
    _emailController.text = emp.email ?? '';
    _designationController.text = emp.designation ?? '';
    _codeController.text = emp.employeeCode;
    _salaryType = emp.salaryType;
    _salaryController.text = emp.baseSalary > 0 ? emp.baseSalary.toStringAsFixed(0) : '';
    _joiningDate = emp.joinedAt ?? DateTime.now();
    _workDaysPerWeek = emp.workDaysPerWeek;
    _useCompanyShift = emp.useCompanyShift;
    _useCompanyLeavePolicy = emp.useCompanyLeavePolicy;
    _paidLeaves = emp.paidLeavesPerYear ?? 12;
    _sickLeaves = emp.sickLeavesPerYear ?? 12;
  }

  Future<void> _fetchNextCode() async {
    final company = ref.read(companyProvider).value;
    if (company != null) {
      final code = await ref.read(employeeRepoProvider).getNextEmployeeCode(company.id);
      if (mounted && _codeController.text.isEmpty) {
        setState(() => _codeController.text = code);
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _designationController.dispose();
    _codeController.dispose();
    _salaryController.dispose();
    super.dispose();
  }

  double get _calculatedMonthlyEquivalent {
    final amount = double.tryParse(_salaryController.text) ?? 0.0;
    switch (_salaryType) {
      case SalaryType.monthly:
        return amount;
      case SalaryType.daily:
        return amount * 26;
      case SalaryType.hourly:
        return amount * 8 * 26;
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final company = ref.read(companyProvider).value;
      if (company == null) {
        throw Exception('Company not loaded.');
      }

      final startStr = _useCompanyShift
          ? null
          : '${_shiftStart.hour.toString().padLeft(2, '0')}:${_shiftStart.minute.toString().padLeft(2, '0')}';
      final endStr = _useCompanyShift
          ? null
          : '${_shiftEnd.hour.toString().padLeft(2, '0')}:${_shiftEnd.minute.toString().padLeft(2, '0')}';

      final emp = EmployeeModel(
        id: widget.employee?.id ?? '',
        companyId: company.id,
        name: _nameController.text.trim(),
        employeeCode: _codeController.text.trim().toUpperCase(),
        salaryType: _salaryType,
        baseSalary: double.tryParse(_salaryController.text.trim()) ?? 0.0,
        phone: _phoneController.text.trim().isNotEmpty ? _phoneController.text.trim() : null,
        email: _emailController.text.trim().isNotEmpty ? _emailController.text.trim() : null,
        designation: _designationController.text.trim().isNotEmpty
            ? _designationController.text.trim()
            : 'Team Member',
        workDaysPerWeek: _workDaysPerWeek,
        shiftStart: startStr,
        shiftEnd: endStr,
        joinedAt: _joiningDate,
        useCompanyShift: _useCompanyShift,
        useCompanyLeavePolicy: _useCompanyLeavePolicy,
        paidLeavesPerYear: _useCompanyLeavePolicy ? null : _paidLeaves,
        sickLeavesPerYear: _useCompanyLeavePolicy ? null : _sickLeaves,
      );

      final notifier = ref.read(employeesProvider(company.id).notifier);
      if (_isEditMode) {
        await notifier.updateEmployee(emp);
      } else {
        await notifier.addEmployee(emp);
      }

      if (!mounted) return;
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditMode ? 'Employee updated.' : 'Employee added successfully!'),
          backgroundColor: AppColors.attendancePresent,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to save employee: $e'),
          backgroundColor: AppColors.error,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditMode ? AppStrings.editEmployee : AppStrings.addEmployee),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: AppButton.primary(
          text: _isEditMode ? 'Update Employee' : AppStrings.saveEmployee,
          onPressed: _handleSave,
        ),
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        message: 'Saving employee details...',
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.screenPadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Section 1: Basic Info ────────────────────────────────────
                _sectionHeader('1. Basic Information'),
                const SizedBox(height: AppSpacing.sm),
                AppTextField(
                  label: 'Full Name *',
                  hint: 'e.g. Raju Sharma',
                  controller: _nameController,
                  validator: AppValidators.validateName,
                  prefixIcon: const Icon(Icons.person_outline),
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: AppTextField(
                        label: 'Employee Code *',
                        hint: 'EMP001',
                        controller: _codeController,
                        validator: AppValidators.validateEmployeeCode,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      flex: 4,
                      child: AppTextField(
                        label: 'Designation',
                        hint: 'e.g. Supervisor',
                        controller: _designationController,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  label: 'Phone Number (optional)',
                  hint: '9876543210',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixText: '+91 ',
                  validator: AppValidators.validatePhone,
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  label: 'Email (optional)',
                  hint: 'raju@business.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                ),

                const SizedBox(height: AppSpacing.xl),

                // ── Section 2: Salary ────────────────────────────────────────
                _sectionHeader('2. Salary & Compensation'),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  'Salary Type',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                SegmentedButton<SalaryType>(
                  segments: const [
                    ButtonSegment(value: SalaryType.monthly, label: Text('Monthly')),
                    ButtonSegment(value: SalaryType.daily, label: Text('Daily')),
                    ButtonSegment(value: SalaryType.hourly, label: Text('Hourly')),
                  ],
                  selected: {_salaryType},
                  onSelectionChanged: (val) {
                    setState(() => _salaryType = val.first);
                  },
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  label: 'Base Salary Amount *',
                  hint: '15000',
                  controller: _salaryController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  prefixText: '₹ ',
                  validator: AppValidators.validateSalary,
                  onChanged: (_) => setState(() {}),
                ),
                if (_calculatedMonthlyEquivalent > 0 && _salaryType != SalaryType.monthly)
                  Padding(
                    padding: const EdgeInsets.only(top: AppSpacing.xs),
                    child: Text(
                      '≈ ${CurrencyFormatter.format(_calculatedMonthlyEquivalent)} per month (based on 26 working days)',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                const SizedBox(height: AppSpacing.xl),

                // ── Section 3: Schedule ──────────────────────────────────────
                _sectionHeader('3. Work Schedule'),
                const SizedBox(height: AppSpacing.sm),
                const Text(
                  'Joining Date',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                InkWell(
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _joiningDate,
                      firstDate: DateTime(2000),
                      lastDate: DateTime.now(),
                    );
                    if (date != null) setState(() => _joiningDate = date);
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
                          DateFormat('dd MMMM yyyy').format(_joiningDate),
                          style: const TextStyle(fontSize: 15),
                        ),
                        const Icon(Icons.calendar_today_rounded, size: 20),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                const Text(
                  'Working Days Per Week',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: AppSpacing.xs),
                Wrap(
                  spacing: AppSpacing.sm,
                  children: [5, 6].map((days) {
                    return ChoiceChip(
                      label: Text('$days days/week'),
                      selected: _workDaysPerWeek == days,
                      onSelected: (selected) {
                        if (selected) setState(() => _workDaysPerWeek = days);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.md),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Use company shift timings'),
                  subtitle: const Text('9:00 AM – 6:00 PM (Default)'),
                  value: _useCompanyShift,
                  onChanged: (val) => setState(() => _useCompanyShift = val),
                ),
                if (!_useCompanyShift) ...[
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            final picked = await showTimePicker(
                              context: context,
                              initialTime: _shiftStart,
                            );
                            if (picked != null) setState(() => _shiftStart = picked);
                          },
                          icon: const Icon(Icons.access_time, size: 16),
                          label: Text('In: ${_shiftStart.format(context)}'),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            final picked = await showTimePicker(
                              context: context,
                              initialTime: _shiftEnd,
                            );
                            if (picked != null) setState(() => _shiftEnd = picked);
                          },
                          icon: const Icon(Icons.access_time_filled, size: 16),
                          label: Text('Out: ${_shiftEnd.format(context)}'),
                        ),
                      ),
                    ],
                  ),
                ],

                const SizedBox(height: AppSpacing.xl),

                // ── Section 4: Leave Policy ──────────────────────────────────
                _sectionHeader('4. Leave Policy'),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Use company leave policy'),
                  subtitle: const Text('12 Paid + 12 Sick leaves / year'),
                  value: _useCompanyLeavePolicy,
                  onChanged: (val) => setState(() => _useCompanyLeavePolicy = val),
                ),
                if (!_useCompanyLeavePolicy) ...[
                  const SizedBox(height: AppSpacing.sm),
                  _stepper('Annual Paid Leaves', _paidLeaves, (v) {
                    setState(() => _paidLeaves = v);
                  }),
                  const SizedBox(height: AppSpacing.sm),
                  _stepper('Annual Sick Leaves', _sickLeaves, (v) {
                    setState(() => _sickLeaves = v);
                  }),
                ],
                const SizedBox(height: AppSpacing.xxl),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: AppColors.primary,
      ),
    );
  }

  Widget _stepper(String title, int count, ValueChanged<int> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: count > 0 ? () => onChanged(count - 1) : null,
              ),
              Text('$count', style: const TextStyle(fontWeight: FontWeight.bold)),
              IconButton(
                icon: const Icon(Icons.add_circle_outline),
                onPressed: count < 30 ? () => onChanged(count + 1) : null,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
