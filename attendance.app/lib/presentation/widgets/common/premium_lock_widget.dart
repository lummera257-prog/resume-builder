import 'package:flutter/material.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_routes.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/presentation/widgets/common/app_button.dart';

/// Screen gate for premium features when user is on Free plan.
class PremiumLockWidget extends StatelessWidget {
  const PremiumLockWidget({
    super.key,
    required this.featureName,
    required this.reason,
  });

  final String featureName;
  final String reason;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Card(
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.xl),
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.lock_rounded,
                    size: 48,
                    color: AppColors.accent,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: const Text(
                    'PRO FEATURE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.accent,
                      letterSpacing: 1,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  featureName,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  reason,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppSpacing.lg),
                AppButton.primary(
                  text: 'Upgrade to Unlock',
                  icon: Icons.star_rounded,
                  onPressed: () {
                    Navigator.of(context).pushNamed(AppRoutes.paywall);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
