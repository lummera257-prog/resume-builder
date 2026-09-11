import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/subscription_provider.dart';
import 'package:payclock/presentation/widgets/common/empty_state_widget.dart';

/// Screen listing team members with search, plan cap warnings, and quick management.
class EmployeesScreen extends ConsumerStatefulWidget {
  const EmployeesScreen({super.key});

  @override
  ConsumerState<EmployeesScreen> createState() => _EmployeesScreenState();
}

class _EmployeesScreenState extends ConsumerState<EmployeesScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employeesAsync = ref.watch(employeesProvider(companyId));
    final isPremium = ref.watch(isPremiumProvider).value ?? false;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Team Members'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          final count = employeesAsync.value?.length ?? 0;
          if (!isPremium && count >= 5) {
            _showLimitReachedDialog();
            return;
          }
          Navigator.of(context).pushNamed(AppRoutes.addEmployee);
        },
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Add Employee'),
      ),
      body: Column(
        children: [
          // Free Plan Limit Banner
          if (!isPremium && (employeesAsync.value?.length ?? 0) >= 5)
            Container(
              color: AppColors.accent.withOpacity(0.12),
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: 8,
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.accent, size: 20),
                  const SizedBox(width: AppSpacing.sm),
                  const Expanded(
                    child: Text(
                      'Free plan limit reached (5/5 employees). Upgrade to add more.',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushNamed(AppRoutes.paywall),
                    child: const Text('Upgrade'),
                  ),
                ],
              ),
            ),

          // Search Bar
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val.trim().toLowerCase()),
              decoration: InputDecoration(
                hintText: AppStrings.searchEmployees,
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              ),
            ),
          ),

          // Employees List
          Expanded(
            child: employeesAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(
                child: Text('Failed to load team: $err'),
              ),
              data: (employees) {
                final filtered = employees.where((e) {
                  if (_searchQuery.isEmpty) return true;
                  final matchName = e.name.toLowerCase().contains(_searchQuery);
                  final matchDesignation =
                      (e.designation ?? '').toLowerCase().contains(_searchQuery);
                  final matchCode = e.employeeCode.toLowerCase().contains(_searchQuery);
                  return matchName || matchDesignation || matchCode;
                }).toList();

                if (filtered.isEmpty) {
                  return EmptyStateWidget(
                    title: _searchQuery.isEmpty ? AppStrings.noEmployees : 'No matching employees',
                    subtitle: _searchQuery.isEmpty
                        ? AppStrings.addFirstEmployee
                        : 'Try searching with another name or code.',
                    icon: Icons.people_outline_rounded,
                    buttonText: _searchQuery.isEmpty ? AppStrings.addEmployee : null,
                    onButtonPressed: _searchQuery.isEmpty
                        ? () => Navigator.of(context).pushNamed(AppRoutes.addEmployee)
                        : null,
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.xs,
                  ),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, index) {
                    final emp = filtered[index];
                    return _employeeCard(emp);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _employeeCard(EmployeeModel emp) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.md),
        onTap: () {
          Navigator.of(context).pushNamed(
            AppRoutes.employeeDetail,
            arguments: emp.id,
          );
        },
        onLongPress: () => _showEmployeeActionsSheet(emp),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              // Avatar
              CircleAvatar(
                radius: 24,
                backgroundColor: emp.avatarColor,
                child: Text(
                  emp.initials,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),

              // Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            emp.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: emp.isActive
                                ? AppColors.attendancePresent.withOpacity(0.12)
                                : AppColors.divider,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            emp.employeeCode,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: emp.isActive
                                  ? AppColors.attendancePresent
                                  : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      emp.designation ?? 'Team Member',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${CurrencyFormatter.format(emp.baseSalary)}${emp.salaryType.unitLabel}',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),

              const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showEmployeeActionsSheet(EmployeeModel emp) {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: const Icon(Icons.edit_rounded, color: AppColors.primary),
                  title: const Text('Edit Employee'),
                  onTap: () {
                    Navigator.pop(ctx);
                    Navigator.of(context).pushNamed(
                      AppRoutes.addEmployee,
                      arguments: emp,
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.person_off_rounded, color: AppColors.error),
                  title: const Text(
                    'Deactivate Employee',
                    style: TextStyle(color: AppColors.error),
                  ),
                  onTap: () async {
                    Navigator.pop(ctx);
                    _confirmDeactivate(emp);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _confirmDeactivate(EmployeeModel emp) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text(AppStrings.deactivateEmployee),
        content: const Text(AppStrings.deactivateConfirm),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final company = ref.read(companyProvider).value;
              if (company != null) {
                await ref
                    .read(employeesProvider(company.id).notifier)
                    .deactivateEmployee(emp.id);
              }
            },
            child: const Text('Deactivate', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  void _showLimitReachedDialog() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Employee Limit Reached'),
        content: const Text(
          'Your free plan supports up to 5 employees. Upgrade to Starter (25 employees) or Pro (Unlimited) to add more.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Later'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.of(context).pushNamed(AppRoutes.paywall);
            },
            child: const Text('View Plans'),
          ),
        ],
      ),
    );
  }
}
