import 'package:payclock/core/errors/app_exception.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/company_model.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Handles all company CRUD operations via Supabase.
class CompanyRepository {
  static const String _table = 'companies';

  /// Creates a new company for the authenticated owner.
  Future<CompanyModel> createCompany(CompanyModel company) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .insert(company.toJson()..remove('id'))
          .select()
          .single();
      AppLogger.info('Company created: ${data['name']}');
      return CompanyModel.fromJson(data);
    } on PostgrestException catch (e) {
      AppLogger.error('createCompany PostgrestError', e);
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('createCompany error', e, st);
      throw AppException.server();
    }
  }

  /// Fetches the company owned by the current user.
  Future<CompanyModel?> getMyCompany() async {
    try {
      final userId = SupabaseClientService.currentUser?.id;
      if (userId == null) return null;
      final data = await SupabaseClientService.client
          .from(_table)
          .select()
          .eq('owner_id', userId)
          .maybeSingle();
      if (data == null) return null;
      return CompanyModel.fromJson(data);
    } on PostgrestException catch (e) {
      AppLogger.error('getMyCompany PostgrestError', e);
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('getMyCompany error', e, st);
      throw AppException.server();
    }
  }

  /// Updates company details.
  Future<CompanyModel> updateCompany(CompanyModel company) async {
    try {
      final data = await SupabaseClientService.client
          .from(_table)
          .update(company.toJson())
          .eq('id', company.id)
          .select()
          .single();
      AppLogger.info('Company updated: ${company.id}');
      return CompanyModel.fromJson(data);
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('updateCompany error', e, st);
      throw AppException.server();
    }
  }

  /// Deletes the company (used in account deletion flow).
  Future<void> deleteCompany(String companyId) async {
    try {
      await SupabaseClientService.client
          .from(_table)
          .delete()
          .eq('id', companyId);
      AppLogger.info('Company deleted: $companyId');
    } on PostgrestException catch (e) {
      throw AppException(message: e.message, code: e.code);
    } catch (e, st) {
      AppLogger.error('deleteCompany error', e, st);
      throw AppException.server();
    }
  }
}
