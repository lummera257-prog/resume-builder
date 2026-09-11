import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all attendance CRUD operations via Supabase.
class AttendanceRepository {
  static const String _table = 'attendance_records';

  /// Upserts a single attendance record.
  /// Uses onConflict to prevent duplicates (employee_id + date is unique).
  Future<AttendanceModel> markAttendance(AttendanceModel record) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .upsert(
            record.toJson(),
            onConflict: 'employee_id,date',
          )
          .select()
          .single();
      return AttendanceModel.fromJson(data);
    } on PostgrestException catch (e) {
      AppLogger.error('markAttendance PostgrestError', e);
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('markAttendance error', e, st);
      throw AppException.server();
    }
  }

  /// Upserts multiple attendance records in a batch.
  Future<List<AttendanceModel>> markBulkAttendance(
    List<AttendanceModel> records,
  ) async {
    try {
      final jsonList = records.map((r) => r.toJson()).toList();
      final data = await SupabaseClientService.client
          .from(_table)
          .upsert(jsonList, onConflict: 'employee_id,date')
          .select();
      return (data as List)
          .map((e) => AttendanceModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('markBulkAttendance error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all attendance records for a company on a specific date.
  Future<List<AttendanceModel>> getAttendanceForDate({
    required String companyId,
    required String date,
  }) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .eq('date', date);
      return (data as List)
          .map((e) => AttendanceModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getAttendanceForDate error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all attendance records for a company in a given month/year.
  Future<List<AttendanceModel>> getMonthlyAttendance({
    required String companyId,
    required int month,
    required int year,
  }) async {
    try {
      final startDate =
          '${year.toString().padLeft(4, '0')}-${month.toString().padLeft(2, '0')}-01';
      final endMonth = month == 12 ? 1 : month + 1;
      final endYear = month == 12 ? year + 1 : year;
      final endDate =
          '${endYear.toString().padLeft(4, '0')}-${endMonth.toString().padLeft(2, '0')}-01';

      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .gte('date', startDate)
          .lt('date', endDate)
          .order('date');
      return (data as List)
          .map((e) => AttendanceModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getMonthlyAttendance error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all attendance records for a specific employee in a month.
  Future<List<AttendanceModel>> getEmployeeMonthlyAttendance({
    required String employeeId,
    required int month,
    required int year,
  }) async {
    try {
      final startDate =
          '${year.toString().padLeft(4, '0')}-${month.toString().padLeft(2, '0')}-01';
      final endMonth = month == 12 ? 1 : month + 1;
      final endYear = month == 12 ? year + 1 : year;
      final endDate =
          '${endYear.toString().padLeft(4, '0')}-${endMonth.toString().padLeft(2, '0')}-01';

      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('employee_id', employeeId)
          .gte('date', startDate)
          .lt('date', endDate)
          .order('date');
      return (data as List)
          .map((e) => AttendanceModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployeeMonthlyAttendance error', e, st);
      throw AppException.server();
    }
  }

  /// Deletes all attendance records for a company (account deletion).
  Future<void> deleteAllForCompany(String companyId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .delete()
          .eq('company_id', companyId);
      AppLogger.info('All attendance deleted for company: $companyId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deleteAllForCompany error', e, st);
      throw AppException.server();
    }
  }
}
