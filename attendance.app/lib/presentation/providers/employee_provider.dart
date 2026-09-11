import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/data/repositories/employee_repository.dart';

/// Repository provider
final employeeRepoProvider = Provider<EmployeeRepository>(
  (_) => EmployeeRepository(),
);

/// Employees list notifier (family by companyId)
class EmployeesNotifier
    extends FamilyAsyncNotifier<List<EmployeeModel>, String> {
  EmployeeRepository get _repo => ref.read(employeeRepoProvider);

  @override
  Future<List<EmployeeModel>> build(String companyId) async {
    try {
      return await _repo.getEmployees(companyId);
    } catch (e, st) {
      AppLogger.error('EmployeesNotifier build error', e, st);
      return [];
    }
  }

  Future<void> addEmployee(EmployeeModel employee) async {
    // Optimistic update
    final current = state.value ?? [];
    state = AsyncData([...current, employee]);
    try {
      final saved = await _repo.addEmployee(employee);
      state = AsyncData([
        ...current,
        saved,
      ]);
    } on AppException catch (e, st) {
      state = AsyncData(current); // Rollback
      state = AsyncError(e, st);
    } catch (e, st) {
      state = AsyncData(current);
      state = AsyncError(AppException.server(), st);
    }
  }

  Future<void> updateEmployee(EmployeeModel employee) async {
    final current = state.value ?? [];
    final updated = current.map((e) => e.id == employee.id ? employee : e).toList();
    state = AsyncData(updated); // Optimistic
    try {
      final saved = await _repo.updateEmployee(employee);
      state = AsyncData(
        current.map((e) => e.id == saved.id ? saved : e).toList(),
      );
    } on AppException catch (e, st) {
      state = AsyncData(current);
      state = AsyncError(e, st);
    } catch (e, st) {
      state = AsyncData(current);
      state = AsyncError(AppException.server(), st);
    }
  }

  Future<void> deactivateEmployee(String employeeId) async {
    final current = state.value ?? [];
    // Remove from list immediately (optimistic)
    state = AsyncData(current.where((e) => e.id != employeeId).toList());
    try {
      await _repo.deactivateEmployee(employeeId);
    } catch (e, st) {
      state = AsyncData(current); // Rollback
      AppLogger.error('deactivateEmployee error', e, st);
    }
  }

  Future<void> refresh(String companyId) async {
    state = const AsyncLoading();
    state =
        await AsyncValue.guard(() => _repo.getEmployees(companyId));
  }
}

final employeesProvider = AsyncNotifierProviderFamily<EmployeesNotifier,
    List<EmployeeModel>, String>(
  EmployeesNotifier.new,
);

/// Single employee provider (for detail screens)
final employeeDetailProvider =
    FutureProvider.family<EmployeeModel?, String>((ref, employeeId) async {
  final repo = ref.read(employeeRepoProvider);
  return repo.getEmployee(employeeId);
});

/// Next employee code provider
final nextEmployeeCodeProvider =
    FutureProvider.family<String, String>((ref, companyId) async {
  final repo = ref.read(employeeRepoProvider);
  return repo.getNextEmployeeCode(companyId);
});
