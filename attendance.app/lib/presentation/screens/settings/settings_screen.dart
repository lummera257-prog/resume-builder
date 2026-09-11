import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/domain/enums/subscription_plan.dart';
import 'package:payclock/presentation/providers/auth_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/subscription_provider.dart';
import 'package:payclock/services/revenue_cat_service.dart';
import 'package:payclock/services/share_service.dart';

/// Settings screen organizing account, subscription, privacy, support, and danger zone actions.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final plan = ref.watch(currentPlanProvider).value ?? SubscriptionPlan.free;
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];
    final ownerName = ref.watch(currentUserNameProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        children: [
          // ── Section 1: Account ─────────────────────────────────────────────
          _sectionHeader('ACCOUNT'),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.person_outline_rounded, color: AppColors.primary),
                  title: Text(ownerName),
                  subtitle: Text(company?.name ?? 'My Business'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.business_outlined, color: AppColors.primary),
                  title: const Text(AppStrings.companySettings),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Company settings are configured during onboarding.')),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.lg),

          // ── Section 2: Subscription ────────────────────────────────────────
          _sectionHeader('SUBSCRIPTION'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Active Plan',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: plan == SubscriptionPlan.pro
                              ? AppColors.accent.withOpacity(0.15)
                              : AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          plan.displayName.toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: plan == SubscriptionPlan.pro
                                ? AppColors.accent
                                : AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    plan == SubscriptionPlan.free
                        ? '${employees.length} of ${plan.maxEmployees} free employees used.'
                        : 'Unlimited team attendance and automated payroll unlocked.',
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  if (plan == SubscriptionPlan.free)
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accent,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 44),
                      ),
                      onPressed: () => Navigator.of(context).pushNamed(AppRoutes.paywall),
                      icon: const Icon(Icons.star_rounded),
                      label: const Text(AppStrings.upgradeToPro),
                    )
                  else
                    OutlinedButton(
                      onPressed: () => launchUrl(
                        Uri.parse('https://play.google.com/store/account/subscriptions'),
                        mode: LaunchMode.externalApplication,
                      ),
                      child: const Text('Manage on Google Play'),
                    ),
                  const SizedBox(height: AppSpacing.xs),
                  Center(
                    child: TextButton(
                      onPressed: () async {
                        final info = await RevenueCatService.instance.restorePurchases();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                info != null
                                    ? AppStrings.purchaseRestored
                                    : 'No active purchases found.',
                              ),
                            ),
                          );
                        }
                      },
                      child: const Text(AppStrings.restorePurchases),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.lg),

          // ── Section 3: Data & Privacy ──────────────────────────────────────
          _sectionHeader('DATA & PRIVACY'),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.file_download_outlined, color: AppColors.primary),
                  title: const Text(AppStrings.exportData),
                  onTap: () {
                    ShareService.instance.shareText(
                      'PayClock Backup Export for ${company?.name ?? "Business"}\nExported on ${DateTime.now()}',
                      subject: 'PayClock Data Export',
                    );
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.privacy_tip_outlined, color: AppColors.primary),
                  title: const Text(AppStrings.privacyPolicy),
                  trailing: const Icon(Icons.open_in_new_rounded, size: 18),
                  onTap: () => launchUrl(
                    Uri.parse('https://payclock.in/privacy'),
                    mode: LaunchMode.externalApplication,
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.description_outlined, color: AppColors.primary),
                  title: const Text(AppStrings.termsOfService),
                  trailing: const Icon(Icons.open_in_new_rounded, size: 18),
                  onTap: () => launchUrl(
                    Uri.parse('https://payclock.in/terms'),
                    mode: LaunchMode.externalApplication,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.lg),

          // ── Section 4: Support & Share ─────────────────────────────────────
          _sectionHeader('SUPPORT & COMMUNITY'),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.support_agent_rounded, color: AppColors.primary),
                  title: const Text(AppStrings.contactSupport),
                  subtitle: const Text('support@payclock.in'),
                  onTap: () => launchUrl(Uri.parse('mailto:support@payclock.in')),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.star_rate_rounded, color: Colors.amber),
                  title: const Text(AppStrings.rateApp),
                  onTap: () => launchUrl(
                    Uri.parse('market://details?id=com.payclock.app'),
                    mode: LaunchMode.externalApplication,
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.share_rounded, color: AppColors.primary),
                  title: const Text(AppStrings.shareApp),
                  onTap: () {
                    ShareService.instance.shareText(
                      'Check out PayClock — Simplified attendance and payroll for your business! https://payclock.in',
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.lg),

          // ── Section 5: Danger Zone ─────────────────────────────────────────
          _sectionHeader('DANGER ZONE'),
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              side: const BorderSide(color: AppColors.error, width: 1.2),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.logout_rounded, color: AppColors.textPrimary),
                  title: const Text(AppStrings.logout),
                  onTap: () => _confirmLogout(context, ref),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.delete_forever_rounded, color: AppColors.error),
                  title: const Text(
                    AppStrings.deleteAccount,
                    style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold),
                  ),
                  onTap: () => Navigator.of(context).pushNamed(AppRoutes.deleteAccount),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          // App Version Footer
          const Center(
            child: Text(
              AppStrings.appVersion,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ),

          const SizedBox(height: AppSpacing.lg),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: AppSpacing.xs),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: AppColors.textSecondary,
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  void _confirmLogout(BuildContext context, WidgetRef ref) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text(AppStrings.logout),
        content: const Text('Are you sure you want to log out of PayClock?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authProvider.notifier).signOut();
              if (context.mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.login, (r) => false);
              }
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }
}
