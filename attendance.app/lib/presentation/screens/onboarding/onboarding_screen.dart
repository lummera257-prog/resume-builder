import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/core/utils/validators.dart';
import 'package:payclock/data/models/company_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:payclock/domain/enums/salary_type.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/widgets/common/app_button.dart';
import 'package:payclock/presentation/widgets/common/app_text_field.dart';
import 'package:payclock/presentation/widgets/common/loading_overlay.dart';

/// 4-step interactive wizard configuring business profile, schedule, and default policies.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  int _currentStep = 0;
  bool _isLoading = false;

  // Step 1: Business Type
  String _selectedBusinessType = 'Retail/Shop';
  final List<({String title, String icon})> _businessTypes = [
    (title: 'Retail/Shop', icon: '🏪'),
    (title: 'Workshop/Factory', icon: '🏭'),
    (title: 'Office/Startup', icon: '🏢'),
    (title: 'Field Team', icon: '👷'),
    (title: 'Restaurant', icon: '🍽️'),
    (title: 'Other', icon: '📦'),
  ];

  // Step 2: Details
  final _companyNameController = TextEditingController();
  final _ownerNameController = TextEditingController();
  String _selectedCity = 'Mumbai';
  String _selectedTeamSize = '1-5';

  final List<String> _indianCities = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Coimbatore',
    'Other'
  ];

  final List<String> _teamSizes = ['1-5', '6-20', '21-50', '51-200', '200+'];

  // Step 3: Work Schedule
  // Days: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
  final Set<int> _selectedWorkDays = {1, 2, 3, 4, 5, 6}; // Mon-Sat
  TimeOfDay _shiftStart = const TimeOfDay(hour: 9, minute: 0);
  TimeOfDay _shiftEnd = const TimeOfDay(hour: 18, minute: 0);

  // Step 4: Salary & Leave Policy
  SalaryType _salaryType = SalaryType.monthly;
  int _paidLeaves = 12;
  int _sickLeaves = 12;

  @override
  void initState() {
    super.initState();
    final name = SupabaseClientService.currentUser?.userMetadata?['full_name'] as String?;
    if (name != null && name.isNotEmpty) {
      _ownerNameController.text = name;
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _companyNameController.dispose();
    _ownerNameController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 1) {
      if (_companyNameController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Business Name is required.')),
        );
        return;
      }
    }

    if (_currentStep < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _finishOnboarding() async {
    setState(() => _isLoading = true);

    try {
      final userId = SupabaseClientService.currentUser?.id ?? '';

      final startStr =
          '${_shiftStart.hour.toString().padLeft(2, '0')}:${_shiftStart.minute.toString().padLeft(2, '0')}';
      final endStr =
          '${_shiftEnd.hour.toString().padLeft(2, '0')}:${_shiftEnd.minute.toString().padLeft(2, '0')}';

      final company = CompanyModel(
        id: '',
        ownerId: userId,
        name: _companyNameController.text.trim(),
        businessType: _selectedBusinessType,
        city: _selectedCity,
        teamSizeRange: _selectedTeamSize,
        workDays: _selectedWorkDays.toList()..sort(),
        shiftStart: startStr,
        shiftEnd: endStr,
        paidLeavesPerYear: _paidLeaves,
        sickLeavesPerYear: _sickLeaves,
      );

      await ref.read(companyProvider.notifier).createCompany(company);

      if (!mounted) return;

      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.dashboard,
        (route) => false,
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Setup failed: $e'),
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
        title: const Text('Setup Your Business'),
        leading: _currentStep > 0
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _prevStep,
              )
            : null,
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        message: AppStrings.settingUpAccount,
        child: Column(
          children: [
            // Progress Bar
            LinearProgressIndicator(
              value: (_currentStep + 1) / 4,
              backgroundColor: AppColors.surfaceVariant,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
              minHeight: 4,
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Text(
                'Step ${_currentStep + 1} of 4',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (idx) => setState(() => _currentStep = idx),
                children: [
                  _buildStep1BusinessType(),
                  _buildStep2BusinessDetails(),
                  _buildStep3WorkSchedule(),
                  _buildStep4Policies(),
                ],
              ),
            ),
            Container(
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
                text: _currentStep == 3 ? AppStrings.finish : AppStrings.next,
                onPressed: _nextStep,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Step 1 ─────────────────────────────────────────────────────────────────
  Widget _buildStep1BusinessType() {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppStrings.selectBusinessType,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'We will tailor attendance and shift settings for your team.',
            style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: AppSpacing.md,
                mainAxisSpacing: AppSpacing.md,
                childAspectRatio: 1.15,
              ),
              itemCount: _businessTypes.length,
              itemBuilder: (context, index) {
                final item = _businessTypes[index];
                final isSelected = _selectedBusinessType == item.title;
                return InkWell(
                  onTap: () => setState(() => _selectedBusinessType = item.title),
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primary.withOpacity(0.08)
                          : AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.divider,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(item.icon, style: const TextStyle(fontSize: 36)),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          item.title,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? AppColors.primary : AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ── Step 2 ─────────────────────────────────────────────────────────────────
  Widget _buildStep2BusinessDetails() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppStrings.businessDetails,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          AppTextField(
            label: 'Business / Shop Name *',
            hint: 'e.g. Acme Enterprises',
            controller: _companyNameController,
            validator: (v) => AppValidators.validateRequired(v, 'Business Name'),
          ),
          const SizedBox(height: AppSpacing.md),
          AppTextField(
            label: 'Owner / Manager Name *',
            hint: 'e.g. Ramesh Kumar',
            controller: _ownerNameController,
          ),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'City',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: AppSpacing.xs),
          DropdownButtonFormField<String>(
            value: _selectedCity,
            decoration: const InputDecoration(),
            items: _indianCities.map((city) {
              return DropdownMenuItem(value: city, child: Text(city));
            }).toList(),
            onChanged: (val) {
              if (val != null) setState(() => _selectedCity = val);
            },
          ),
          const SizedBox(height: AppSpacing.md),
          const Text(
            'Team Size',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: AppSpacing.xs),
          Wrap(
            spacing: AppSpacing.sm,
            children: _teamSizes.map((size) {
              final isSelected = _selectedTeamSize == size;
              return ChoiceChip(
                label: Text(size),
                selected: isSelected,
                selectedColor: AppColors.primary.withOpacity(0.15),
                onSelected: (selected) {
                  if (selected) setState(() => _selectedTeamSize = size);
                },
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ── Step 3 ─────────────────────────────────────────────────────────────────
  Widget _buildStep3WorkSchedule() {
    final diffHours =
        (_shiftEnd.hour + _shiftEnd.minute / 60) -
        (_shiftStart.hour + _shiftStart.minute / 60);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppStrings.workSchedule,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Select regular working days and daily shift hours.',
            style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          const Text(
            'Working Days',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _dayToggle(1, 'M'),
              _dayToggle(2, 'T'),
              _dayToggle(3, 'W'),
              _dayToggle(4, 'T'),
              _dayToggle(5, 'F'),
              _dayToggle(6, 'S'),
              _dayToggle(7, 'S'),
            ],
          ),
          const SizedBox(height: AppSpacing.xl),
          const Text(
            'Shift Timings',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: _shiftStart,
                    );
                    if (time != null) setState(() => _shiftStart = time);
                  },
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  child: Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(color: AppColors.divider),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Start Time',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _shiftStart.format(context),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: InkWell(
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: _shiftEnd,
                    );
                    if (time != null) setState(() => _shiftEnd = time);
                  },
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  child: Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.md),
                      border: Border.all(color: AppColors.divider),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'End Time',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _shiftEnd.format(context),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.12),
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.schedule, size: 18, color: AppColors.primary),
                const SizedBox(width: AppSpacing.xs),
                Text(
                  'Shift Length: ${diffHours > 0 ? diffHours.toStringAsFixed(1) : "9"} hours/day',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dayToggle(int dayIndex, String label) {
    final isSelected = _selectedWorkDays.contains(dayIndex);
    return InkWell(
      onTap: () {
        setState(() {
          if (isSelected) {
            if (_selectedWorkDays.length > 1) {
              _selectedWorkDays.remove(dayIndex);
            }
          } else {
            _selectedWorkDays.add(dayIndex);
          }
        });
      },
      borderRadius: BorderRadius.circular(AppRadius.full),
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : AppColors.surface,
          shape: BoxShape.circle,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.divider,
          ),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppColors.textPrimary,
          ),
        ),
      ),
    );
  }

  // ── Step 4 ─────────────────────────────────────────────────────────────────
  Widget _buildStep4Policies() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppStrings.salaryPolicy,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Default salary structure and annual leave allowance.',
            style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppSpacing.lg),
          const Text(
            'Default Salary Type',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
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
          const SizedBox(height: AppSpacing.xl),
          _stepperRow('Annual Paid Leaves', _paidLeaves, (val) {
            setState(() => _paidLeaves = val);
          }),
          const SizedBox(height: AppSpacing.md),
          _stepperRow('Annual Sick Leaves', _sickLeaves, (val) {
            setState(() => _sickLeaves = val);
          }),
        ],
      ),
    );
  }

  Widget _stepperRow(String label, int value, ValueChanged<int> onChanged) {
    return Container(
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
            label,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: value > 0 ? () => onChanged(value - 1) : null,
              ),
              SizedBox(
                width: 32,
                child: Text(
                  '$value',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add_circle_outline),
                onPressed: value < 30 ? () => onChanged(value + 1) : null,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
