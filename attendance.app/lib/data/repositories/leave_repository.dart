import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/leave_request_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all leave request operations via Supabase.
class LeaveRepository {
  static const String _table = 'leave_requests';

  /// Creates a new leave request.
  Future<LeaveRequestModel> createLeaveRequest(
    LeaveRequestModel request,
  ) async {
    try {
      final json = request.toJson()..remove('id');
      final data = await SupabaseClientService.client
          .from(_table)
          .insert(json)
          .select()
          .single();
      AppLogger.info('Leave request created: ${data['id']}');
      return LeaveRequestModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('createLeaveRequest error', e, st);
      throw AppException.server();
    }
  }

  /// Returns all leave requests for a company, optionally filtered by status.
  Future<List<LeaveRequestModel>> getLeaveRequests({
    required String companyId,
    String? status,
  }) async {
    try {
      var query = SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId);
      if (status != null) {
        query = query.eq('status', status);
      }
      final data = await query.order('created_at', ascending: false);
      return (data as List)
          .map((e) => LeaveRequestModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getLeaveRequests error', e, st);
      throw AppException.server();
    }
  }

  /// Returns leave requests for a specific employee.
  Future<List<LeaveRequestModel>> getEmployeeLeaves(
    String employeeId,
  ) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('employee_id', employeeId)
          .order('created_at', ascending: false);
      return (data as List)
          .map((e) => LeaveRequestModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getEmployeeLeaves error', e, st);
      throw AppException.server();
    }
  }

  /// Approves a leave request.
  Future<LeaveRequestModel> approveLeave({
    required String leaveId,
    required String approvedBy,
  }) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .update({'status': 'approved', 'approved_by': approvedBy})
          .eq('id', leaveId)
          .select()
          .single();
      AppLogger.info('Leave approved: $leaveId');
      return LeaveRequestModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('approveLeave error', e, st);
      throw AppException.server();
    }
  }

  /// Rejects a leave request with optional reason.
  Future<LeaveRequestModel> rejectLeave({
    required String leaveId,
    String? reason,
  }) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .update({
            'status': 'rejected',
            if (reason != null) 'rejection_reason': reason,
          })
          .eq('id', leaveId)
          .select()
          .single();
      AppLogger.info('Leave rejected: $leaveId');
      return LeaveRequestModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('rejectLeave error', e, st);
      throw AppException.server();
    }
  }

  /// Counts pending leave requests for a company.
  Future<int> getPendingCount(String companyId) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('company_id', companyId)
          .eq('status', 'pending')
          .count(CountOption.exact);
      return data.count;
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getPendingCount error', e, st);
      throw AppException.server();
    }
  }

  /// Deletes all leave requests for a company (account deletion).
  Future<void> deleteAllForCompany(String companyId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .delete()
          .eq('company_id', companyId);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deleteAllForCompany error', e, st);
      throw AppException.server();
    }
  }
}
