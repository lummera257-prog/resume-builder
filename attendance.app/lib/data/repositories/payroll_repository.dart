import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/payroll_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all payroll CRUD operations via Supabase.
class PayrollRepository {
  static const String _table = 'payroll_records';

  /// Returns payroll records for a company in a given month/year.
  Future<List<PayrollModel>> getPayroll({
    required String companyId,
    required int month,
    required int year,
  }) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .eq('month', month)
          .eq('year', year)
          .order('created_at');
      return (data as List)
          .map((e) => PayrollModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getPayroll error', e, st);
      throw AppException.server();
    }
  }

  /// Upserts a payroll record (one record per employee per month).
  Future<PayrollModel> upsertPayroll(PayrollModel record) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .upsert(
            record.toJson(),
            onConflict: 'employee_id,month,year',
          )
          .select()
          .single();
      return PayrollModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('upsertPayroll error', e, st);
      throw AppException.server();
    }
  }

  /// Upserts multiple payroll records in a batch.
  Future<List<PayrollModel>> upsertBulkPayroll(
    List<PayrollModel> records,
  ) async {
    try {
      final jsonList = records.map((r) => r.toJson()).toList();
      final data = await SupabaseClientService.client
          .from(_table)
          .upsert(jsonList, onConflict: 'employee_id,month,year')
          .select();
      return (data as List)
          .map((e) => PayrollModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('upsertBulkPayroll error', e, st);
      throw AppException.server();
    }
  }

  /// Approves payroll for a company/month/year — updates all draft records.
  Future<void> approvePayroll({
    required String companyId,
    required int month,
    required int year,
  }) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .update({'status': 'approved'})
          .eq('company_id', companyId)
          .eq('month', month)
          .eq('year', year)
          .eq('status', 'draft');
      AppLogger.info('Payroll approved: $month/$year for $companyId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('approvePayroll error', e, st);
      throw AppException.server();
    }
  }

  /// Updates the payslip URL after PDF generation and upload.
  Future<void> updatePayslipUrl({
    required String payrollId,
    required String url,
  }) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .update({'payslip_url': url})
          .eq('id', payrollId);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('updatePayslipUrl error', e, st);
      throw AppException.server();
    }
  }

  /// Returns payroll history for a single employee.
  Future<List<PayrollModel>> getEmployeePayrollHistory(
    String employeeId,
  ) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('employee_id', employeeId)
          .order('year', ascending: false)
          .order('month', ascending: false);
      return (data as List)
          .map((e) => PayrollModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployeePayrollHistory error', e, st);
      throw AppException.server();
    }
  }

  /// Deletes all payroll records for a company (account deletion).
  Future<void> deleteAllForCompany(String companyId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .delete()
          .eq('company_id', companyId);
      AppLogger.info('All payroll deleted for company: $companyId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deleteAllForCompany error', e, st);
      throw AppException.server();
    }
  }
}
