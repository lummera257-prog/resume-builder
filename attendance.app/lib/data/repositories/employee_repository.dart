import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all employee CRUD operations via Supabase.
class EmployeeRepository {
  static const String _table = 'employees';

  /// Returns the next auto-generated employee code for a company.
  /// Calls the `generate_employee_code` Supabase RPC function.
  Future<String> getNextEmployeeCode(String companyId) async {
    try {
      final code = await SupabaseClientService.client.rpc<String>(
        'generate_employee_code',
        params: {'p_company_id': companyId},
      );
      return code as String? ?? 'EMP001';
    } catch (e, st) {
      AppLogger.error('getNextEmployeeCode error', e, st);
      return 'EMP001';
    }
  }

  /// Adds a new employee. Employee code is fetched fresh from RPC before saving.
  Future<EmployeeModel> addEmployee(EmployeeModel employee) async {
    try {
      final json = employee.toJson()..remove('id');
      final data = await SupabaseClientService.client
          .from(_table)
          .insert(json)
          .select()
          .single();
      AppLogger.info('Employee added: ${data['name']}');
      return EmployeeModel.fromJson(data);
    } on PostgrestException catch (e) {
      AppLogger.error('addEmployee PostgrestError', e);
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('addEmployee error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all active employees for a company.
  Future<List<EmployeeModel>> getEmployees(String companyId) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .eq('status', 'active')
          .order('name');
      return (data as List)
          .map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployees error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all employees (active + inactive) for a company.
  Future<List<EmployeeModel>> getAllEmployees(String companyId) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .order('name');
      return (data as List)
          .map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getAllEmployees error', e, st);
      throw AppException.server();
    }
  }

  /// Returns a single employee by ID.
  Future<EmployeeModel?> getEmployee(String employeeId) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('id', employeeId)
          .maybeSingle();
      if (data == null) return null;
      return EmployeeModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployee error', e, st);
      throw AppException.server();
    }
  }

  /// Updates an existing employee.
  Future<EmployeeModel> updateEmployee(EmployeeModel employee) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .update(employee.toJson())
          .eq('id', employee.id)
          .select()
          .single();
      AppLogger.info('Employee updated: ${employee.id}');
      return EmployeeModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('updateEmployee error', e, st);
      throw AppException.server();
    }
  }

  /// Deactivates an employee (soft delete — never hard delete).
  Future<void> deactivateEmployee(String employeeId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .update({'status': 'inactive'})
          .eq('id', employeeId);
      AppLogger.info('Employee deactivated: $employeeId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deactivateEmployee error', e, st);
      throw AppException.server();
    }
  }

  /// Deletes all employees for a company (used in account deletion).
  Future<void> deleteAllForCompany(String companyId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .delete()
          .eq('company_id', companyId);
      AppLogger.info('All employees deleted for company: $companyId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deleteAllForCompany error', e, st);
      throw AppException.server();
    }
  }

  /// Returns the active employee count for a company.
  Future<int> getEmployeeCount(String companyId) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .eq('status', 'active')
          .count(CountOption.exact);
      return data.count;
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployeeCount error', e, st);
      throw AppException.server();
    }
  }
}
