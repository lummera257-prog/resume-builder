import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/payroll_model.dart';
import 'package:payclock/data/repositories/payroll_repository.dart';

/// Repository provider
final payrollRepoProvider = Provider<PayrollRepository>(
  (_) => PayrollRepository(),
);

/// Payroll params typedef
typedef PayrollParams = ({String companyId, int month, int year});

/// Payroll notifier (family by companyId + month + year)
class PayrollNotifier
    extends FamilyAsyncNotifier<List<PayrollModel>, PayrollParams> {
  PayrollRepository get _repo => ref.read(payrollRepoProvider);

  @override
  Future<List<PayrollModel>> build(PayrollParams params) async {
    try {
      return await _repo.getPayroll(
        companyId: params.companyId,
        month: params.month,
        year: params.year,
      );
    } catch (e, st) {
      AppLogger.error('PayrollNotifier build error', e, st);
      return [];
    }
  }

  Future<void> upsertPayroll(PayrollModel record) async {
    final current = state.value ?? [];
    final optimistic = [
      ...current.where((p) => p.employeeId != record.employeeId),
      record,
    ];
    state = AsyncData(optimistic);
    try {
      final saved = await _repo.upsertPayroll(record);
      state = AsyncData([
        ...current.where((p) => p.employeeId != saved.employeeId),
        saved,
      ]);
    } catch (e, st) {
      state = AsyncData(current);
      state = AsyncError(e, st);
    }
  }

  Future<void> upsertBulk(List<PayrollModel> records) async {
    state = const AsyncLoading();
    try {
      final saved = await _repo.upsertBulkPayroll(records);
      state = AsyncData(saved);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> approvePayroll(PayrollParams params) async {
    try {
      await _repo.approvePayroll(
        companyId: params.companyId,
        month: params.month,
        year: params.year,
      );
      // Update all records in state to approved
      final current = state.value ?? [];
      state = AsyncData(
        current.map((p) => p.copyWith(status: 'approved')).toList(),
      );
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> refresh(PayrollParams params) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.getPayroll(
          companyId: params.companyId,
          month: params.month,
          year: params.year,
        ));
  }
}

final payrollProvider = AsyncNotifierProviderFamily<PayrollNotifier,
    List<PayrollModel>, PayrollParams>(
  PayrollNotifier.new,
);
