import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:payclock/core/utils/logger.dart';
import 'package:payclock/data/models/leave_request_model.dart';
import 'package:payclock/data/repositories/leave_repository.dart';
import 'package:payclock/data/sources/remote/supabase_client.dart';

/// Repository provider
final leaveRepoProvider = Provider<LeaveRepository>(
  (_) => LeaveRepository(),
);

/// Leaves list notifier (family by companyId)
class LeavesNotifier
    extends FamilyAsyncNotifier<List<LeaveRequestModel>, String> {
  LeaveRepository get _repo => ref.read(leaveRepoProvider);

  @override
  Future<List<LeaveRequestModel>> build(String companyId) async {
    try {
      return await _repo.getLeaveRequests(companyId: companyId);
    } catch (e, st) {
      AppLogger.error('LeavesNotifier build error', e, st);
      return [];
    }
  }

  Future<void> approveLeave(String leaveId) async {
    final userId = SupabaseClientService.currentUserId;
    if (userId == null) return;
    final current = state.value ?? [];
    try {
      final updated = await _repo.approveLeave(
        leaveId: leaveId,
        approvedBy: userId,
      );
      state = AsyncData(
        current.map((l) => l.id == leaveId ? updated : l).toList(),
      );
    } catch (e, st) {
      AppLogger.error('approveLeave error', e, st);
      state = AsyncError(e, st);
    }
  }

  Future<void> rejectLeave(String leaveId, {String? reason}) async {
    final current = state.value ?? [];
    try {
      final updated = await _repo.rejectLeave(
        leaveId: leaveId,
        reason: reason,
      );
      state = AsyncData(
        current.map((l) => l.id == leaveId ? updated : l).toList(),
      );
    } catch (e, st) {
      AppLogger.error('rejectLeave error', e, st);
      state = AsyncError(e, st);
    }
  }

  Future<void> createLeave(LeaveRequestModel request) async {
    final current = state.value ?? [];
    try {
      final saved = await _repo.createLeaveRequest(request);
      state = AsyncData([saved, ...current]);
    } catch (e, st) {
      AppLogger.error('createLeave error', e, st);
      state = AsyncError(e, st);
    }
  }

  Future<void> refresh(String companyId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => _repo.getLeaveRequests(companyId: companyId),
    );
  }
}

final leavesProvider = AsyncNotifierProviderFamily<LeavesNotifier,
    List<LeaveRequestModel>, String>(
  LeavesNotifier.new,
);

/// Pending leaves count provider
final pendingLeavesCountProvider =
    FutureProvider.family<int, String>((ref, companyId) async {
  final repo = ref.read(leaveRepoProvider);
  return repo.getPendingCount(companyId);
});
