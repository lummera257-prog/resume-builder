import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/company_model.dart';
import 'package:payclock/data/repositories/company_repository.dart';

/// Repository provider
final companyRepoProvider = Provider<CompanyRepository>(
  (_) => CompanyRepository(),
);

/// Company state notifier
class CompanyNotifier extends AsyncNotifier<CompanyModel?> {
  CompanyRepository get _repo => ref.read(companyRepoProvider);

  @override
  Future<CompanyModel?> build() async {
    try {
      return await _repo.getMyCompany();
    } catch (e, st) {
      AppLogger.error('CompanyNotifier build error', e, st);
      return null;
    }
  }

  Future<void> createCompany(CompanyModel company) async {
    state = const AsyncLoading();
    try {
      final saved = await _repo.createCompany(company);
      state = AsyncData(saved);
    } on AppException catch (e, st) {
      state = AsyncError(e, st);
    } catch (e, st) {
      state = AsyncError(AppException.server(), st);
    }
  }

  Future<void> updateCompany(CompanyModel company) async {
    final previous = state;
    state = AsyncData(company); // Optimistic update
    try {
      final saved = await _repo.updateCompany(company);
      state = AsyncData(saved);
    } on AppException catch (e, st) {
      state = previous; // Rollback
      state = AsyncError(e, st);
    } catch (e, st) {
      state = previous;
      state = AsyncError(AppException.server(), st);
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.getMyCompany());
  }
}

final companyProvider =
    AsyncNotifierProvider<CompanyNotifier, CompanyModel?>(
  CompanyNotifier.new,
);
