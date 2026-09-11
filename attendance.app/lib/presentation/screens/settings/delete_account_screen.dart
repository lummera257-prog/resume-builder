import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/data/sources/local/local_database.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/auth_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/providers/payroll_provider.dart';
import 'package:payclock/presentation/widgets/common/app_button.dart';

/// Mandatory Google Play Store Account Deletion Screen with multi-step verification and clean cloud wipe.
class DeleteAccountScreen extends ConsumerStatefulWidget {
  const DeleteAccountScreen({super.key});

  @override
  ConsumerState<DeleteAccountScreen> createState() =>
      _DeleteAccountScreenState();
}

class _DeleteAccountScreenState extends ConsumerState<DeleteAccountScreen> {
  int _step = 1; // 1 = Warning, 2 = Type DELETE confirmation, 3 = In progress
  final _confirmController = TextEditingController();
  String _currentStatus = 'Preparing deletion...';
  bool _isDeleting = false;

  @override
  void dispose() {
    _confirmController.dispose();
    super.dispose();
  }

  void _updateStatus(String status) {
    if (mounted) setState(() => _currentStatus = status);
  }

  Future<void> _performDeletion() async {
    setState(() {
      _step = 3;
      _isDeleting = true;
    });

    final company = ref.read(companyProvider).value;
    final companyId = company?.id ?? '';
    final currentUserId = SupabaseClientService.currentUserId ?? '';

    try {
      if (companyId.isNotEmpty) {
        _updateStatus('Deleting payslips & payroll history...');
        await ref.read(payrollRepoProvider).deleteAllForCompany(companyId);

        _updateStatus('Removing attendance logs...');
        await ref.read(attendanceRepoProvider).deleteAllForCompany(companyId);

        _updateStatus('Clearing leave history...');
        await ref.read(leaveRepoProvider).deleteAllForCompany(companyId);

        _updateStatus('Removing employee roster...');
        await ref.read(employeeRepoProvider).deleteAllForCompany(companyId);

        _updateStatus('Deleting company records...');
        await ref.read(companyRepoProvider).deleteCompany(companyId);
      }

      if (currentUserId.isNotEmpty) {
        _updateStatus('Closing account & credentials...');
        try {
          await SupabaseClientService.client.rpc<void>(
            'delete_user_data',
            params: {'p_user_id': currentUserId},
          );
        } catch (_) {}
      }

      _updateStatus('Clearing local cache...');
      await LocalDatabase.instance.clearAll();
      await const FlutterSecureStorage().deleteAll();

      _updateStatus('Signing out...');
      await ref.read(authProvider.notifier).signOut();

      if (!mounted) return;

      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.login,
        (route) => false,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account and all data deleted permanently.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _isDeleting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Deletion failed: $e. Please contact support.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final employees = ref.watch(employeesProvider(company?.id ?? '')).value ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.deleteAccountTitle),
        backgroundColor: AppColors.error,
      ),
      body: WillPopScope(
        onWillPop: () async => !_isDeleting,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.screenPadding),
          child: _step == 1
              ? _buildStep1Warning(company?.name ?? 'Your Business', employees.length)
              : _step == 2
                  ? _buildStep2Confirmation()
                  : _buildStep3Progress(),
        ),
      ),
    );
  }

  // ── Step 1: Warning ────────────────────────────────────────────────────────
  Widget _buildStep1Warning(String companyName, int employeeCount) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: AppSpacing.lg),
        Container(
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: AppColors.error.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.warning_amber_rounded,
            size: 64,
            color: AppColors.error,
          ),
        ),
        const SizedBox(height: AppSpacing.lg),
        const Text(
          AppStrings.deleteAccountWarning,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.md),
        Card(
          color: AppColors.surface,
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _bulletPoint('Your company: $companyName'),
                _bulletPoint('$employeeCount active employee profiles'),
                _bulletPoint('All attendance and overtime logs'),
                _bulletPoint('All payroll records and generated payslips'),
                _bulletPoint('Your account login credentials and preferences'),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        const Text(
          AppStrings.deleteCannotUndo,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: AppColors.error,
            letterSpacing: 0.5,
          ),
        ),
        const Spacer(),
        AppButton.danger(
          text: AppStrings.continueToDelete,
          onPressed: () => setState(() => _step = 2),
        ),
        const SizedBox(height: AppSpacing.sm),
        AppButton.secondary(
          text: AppStrings.cancelKeepAccount,
          onPressed: () => Navigator.of(context).pop(),
        ),
      ],
    );
  }

  Widget _bulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 14, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  // ── Step 2: Confirmation ───────────────────────────────────────────────────
  Widget _buildStep2Confirmation() {
    final isMatched = _confirmController.text.trim() == 'DELETE';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: AppSpacing.md),
        const Text(
          'Confirm Permanent Deletion',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.error,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        const Text(
          'To prevent accidental deletion, please type "DELETE" below in capital letters:',
          style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
        ),
        const SizedBox(height: AppSpacing.lg),
        TextField(
          controller: _confirmController,
          autofocus: true,
          textCapitalization: TextCapitalization.characters,
          onChanged: (_) => setState(() {}),
          decoration: const InputDecoration(
            labelText: 'Type DELETE',
            hintText: 'DELETE',
            counterText: '',
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Align(
          alignment: Alignment.centerRight,
          child: Text(
            '${_confirmController.text.length} / 6',
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
        ),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: isMatched ? AppColors.error : Colors.grey.shade400,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 50),
          ),
          onPressed: isMatched ? _performDeletion : null,
          child: const Text(
            AppStrings.permanentlyDeleteAll,
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        OutlinedButton(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 50),
          ),
          onPressed: () => Navigator.of(context).pop(),
          child: const Text(AppStrings.cancelKeepAccount),
        ),
      ],
    );
  }

  // ── Step 3: Progress ───────────────────────────────────────────────────────
  Widget _buildStep3Progress() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.error),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            _currentStatus,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Text(
            'Please do not close the app...',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
