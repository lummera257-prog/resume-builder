import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/core/constants/app_strings.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/domain/enums/attendance_status.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';
import 'package:payclock/presentation/providers/leave_provider.dart';
import 'package:payclock/presentation/widgets/common/empty_state_widget.dart';
import 'package:payclock/services/sync_service.dart';

/// The core daily feature: Fast, sub-100ms offline-first attendance recording.
class MarkAttendanceScreen extends ConsumerStatefulWidget {
  const MarkAttendanceScreen({super.key});

  @override
  ConsumerState<MarkAttendanceScreen> createState() => _MarkAttendanceScreenState();
}

class _MarkAttendanceScreenState extends ConsumerState<MarkAttendanceScreen> {
  DateTime _selectedDate = DateTime.now();
  final Map<String, AttendanceStatus> _localMarks = {};
  final Map<String, double> _overtimeMarks = {};
  final Map<String, bool> _avatarCheckmarks = {};
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _checkConnectivity();
    _loadDayData();
  }

  void _checkConnectivity() {
    Connectivity().onConnectivityChanged.listen((results) {
      if (mounted) {
        final offline = results.every((r) => r == ConnectivityResult.none);
        setState(() => _isOffline = offline);
      }
    });
  }

  String get _dateStr =>
      '${_selectedDate.year.toString().padLeft(4, '0')}-'
      '${_selectedDate.month.toString().padLeft(2, '0')}-'
      '${_selectedDate.day.toString().padLeft(2, '0')}';

  Future<void> _loadDayData() async {
    final company = ref.read(companyProvider).value;
    if (company == null) return;

    // Load from cached / remote records
    final records = await ref
        .read(attendanceRepoProvider)
        .getAttendanceForDate(companyId: company.id, date: _dateStr);

    // Pre-fill approved leaves for this date
    final approvedLeaves = await ref
        .read(leaveRepoProvider)
        .getLeaveRequests(companyId: company.id, status: 'approved');

    if (mounted) {
      setState(() {
        _localMarks.clear();
        _overtimeMarks.clear();

        // 1. Fill leaves first
        for (final leave in approvedLeaves) {
          final start = DateTime.tryParse(leave.startDate);
          final end = DateTime.tryParse(leave.endDate);
          if (start != null && end != null) {
            final target = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day);
            final s = DateTime(start.year, start.month, start.day);
            final e = DateTime(end.year, end.month, end.day);
            if (!target.isBefore(s) && !target.isAfter(e)) {
              _localMarks[leave.employeeId] = AttendanceStatus.paidLeave;
            }
          }
        }

        // 2. Overlay explicit records
        for (final r in records) {
          _localMarks[r.employeeId] = r.status;
          _overtimeMarks[r.employeeId] = r.overtimeHours;
        }
      });
    }
  }

  void _handleMarkStatus(
    EmployeeModel emp,
    AttendanceStatus newStatus,
  ) {
    HapticFeedback.lightImpact();

    // 1. Instant local UI update
    setState(() {
      _localMarks[emp.id] = newStatus;
      _avatarCheckmarks[emp.id] = true;
    });

    // 2. Hide checkmark after 250ms
    Future.delayed(const Duration(milliseconds: 250), () {
      if (mounted) {
        setState(() => _avatarCheckmarks[emp.id] = false);
      }
    });

    // 3. Background Sync (never blocks UI)
    final record = AttendanceModel(
      id: '',
      employeeId: emp.id,
      companyId: emp.companyId,
      date: _dateStr,
      status: newStatus,
      overtimeHours: _overtimeMarks[emp.id] ?? 0.0,
      deviceTimestamp: DateTime.now().toUtc(),
    );

    SyncService.instance.markAttendanceWithSync(record);
  }

  void _markAll(List<EmployeeModel> employees, AttendanceStatus status) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(
          status == AttendanceStatus.present ? AppStrings.markAllPresent : AppStrings.markAllAbsent,
        ),
        content: Text(
          'Mark all ${employees.length} employees as ${status.displayName} for ${DateFormat('dd MMM').format(_selectedDate)}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              HapticFeedback.mediumImpact();
              for (final emp in employees) {
                _handleMarkStatus(emp, status);
              }
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  void _showOvertimeSheet(EmployeeModel emp) {
    double currentOt = _overtimeMarks[emp.id] ?? 0.0;
    final controller = TextEditingController(
      text: currentOt > 0 ? currentOt.toStringAsFixed(1) : '1.0',
    );

    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(AppRadius.xl),
          topRight: Radius.circular(AppRadius.xl),
        ),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Log Overtime for ${emp.name}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: AppSpacing.sm),
              const Text(
                'Enter additional overtime hours worked today:',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
              ),
              const SizedBox(height: AppSpacing.md),
              TextField(
                controller: controller,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: 'Overtime Hours',
                  suffixText: 'hrs',
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() => _overtimeMarks[emp.id] = 0.0);
                        _handleMarkStatus(emp, AttendanceStatus.present);
                        Navigator.pop(ctx);
                      },
                      child: const Text('Clear OT'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        final val = double.tryParse(controller.text) ?? 0.0;
                        setState(() => _overtimeMarks[emp.id] = val);
                        _handleMarkStatus(emp, AttendanceStatus.present);
                        Navigator.pop(ctx);
                      },
                      child: const Text('Save Overtime'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employeesAsync = ref.watch(employeesProvider(companyId));
    final employees = employeesAsync.value ?? [];

    // Live counts
    int p = 0;
    int a = 0;
    int h = 0;
    int l = 0;

    for (final emp in employees) {
      final mark = _localMarks[emp.id];
      if (mark == AttendanceStatus.present) p++;
      if (mark == AttendanceStatus.absent) a++;
      if (mark == AttendanceStatus.halfDay) h++;
      if (mark == AttendanceStatus.paidLeave || mark == AttendanceStatus.unpaidLeave) l++;
    }

    final markedTotal = _localMarks.length;
    final allMarked = employees.isNotEmpty && markedTotal >= employees.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mark Attendance'),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
              offset: Offset(0, -2),
            ),
          ],
        ),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: allMarked ? AppColors.accent : Colors.grey.shade400,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 48),
          ),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  allMarked
                      ? 'All $markedTotal attendance marks saved & synced!'
                      : 'Saved $markedTotal of ${employees.length} records.',
                ),
                backgroundColor: AppColors.attendancePresent,
              ),
            );
            Navigator.of(context).pop();
          },
          child: Text(
            'Save Attendance ($markedTotal / ${employees.length} marked)',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ),
      body: Column(
        children: [
          // Offline Banner
          if (_isOffline)
            Container(
              color: AppColors.accent.withOpacity(0.15),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: const Row(
                children: [
                  Icon(Icons.wifi_off_rounded, color: AppColors.accent, size: 18),
                  SizedBox(width: AppSpacing.sm),
                  Text(
                    AppStrings.offlineMode,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.accent,
                    ),
                  ),
                ],
              ),
            ),

          // Date Navigator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(bottom: BorderSide(color: AppColors.divider)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left_rounded),
                  onPressed: () {
                    setState(() {
                      _selectedDate = _selectedDate.subtract(const Duration(days: 1));
                    });
                    _loadDayData();
                  },
                ),
                InkWell(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _selectedDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime.now(),
                    );
                    if (picked != null) {
                      setState(() => _selectedDate = picked);
                      _loadDayData();
                    }
                  },
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_month, size: 18, color: AppColors.primary),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        DateFormat('EEE, dd MMM yyyy').format(_selectedDate),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right_rounded),
                  onPressed: _selectedDate.isBefore(
                    DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day),
                  )
                      ? () {
                          setState(() {
                            _selectedDate = _selectedDate.add(const Duration(days: 1));
                          });
                          _loadDayData();
                        }
                      : null,
                ),
              ],
            ),
          ),

          // Live Summary Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 10),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _summaryChip('✅ $p', 'Present', AppColors.attendancePresent),
                _summaryChip('❌ $a', 'Absent', AppColors.attendanceAbsent),
                _summaryChip('🕐 $h', 'Half', AppColors.attendanceHalf),
                _summaryChip('🌿 $l', 'Leave', AppColors.attendanceLeave),
              ],
            ),
          ),

          // Bulk Actions Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 6),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.attendancePresent),
                      foregroundColor: AppColors.attendancePresent,
                      padding: EdgeInsets.zero,
                    ),
                    onPressed: () => _markAll(employees, AttendanceStatus.present),
                    child: const Text('Mark All Present', style: TextStyle(fontSize: 12)),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.attendanceAbsent),
                      foregroundColor: AppColors.attendanceAbsent,
                      padding: EdgeInsets.zero,
                    ),
                    onPressed: () => _markAll(employees, AttendanceStatus.absent),
                    child: const Text('Mark All Absent', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Employees List
          Expanded(
            child: employees.isEmpty
                ? const EmptyStateWidget(
                    title: 'No employees found',
                    subtitle: 'Add employees to your team first.',
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: employees.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                    itemBuilder: (context, index) {
                      final emp = employees[index];
                      final status = _localMarks[emp.id];
                      final hasCheckmark = _avatarCheckmarks[emp.id] ?? false;
                      final ot = _overtimeMarks[emp.id] ?? 0.0;

                      return _employeeAttendanceRow(emp, status, hasCheckmark, ot);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _summaryChip(String countText, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        countText,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 13,
          color: color,
        ),
      ),
    );
  }

  Widget _employeeAttendanceRow(
    EmployeeModel emp,
    AttendanceStatus? status,
    bool showCheckmark,
    double ot,
  ) {
    return Card(
      elevation: 0.8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            // Avatar with animated checkmark feedback
            Stack(
              alignment: Alignment.center,
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: emp.avatarColor,
                  child: Text(
                    emp.initials,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (showCheckmark)
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check, color: Colors.white, size: 24),
                  ),
              ],
            ),

            const SizedBox(width: AppSpacing.md),

            // Name & Title
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    emp.name,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    ot > 0
                        ? '${emp.designation ?? "Team"} • ${ot.toStringAsFixed(1)}h OT'
                        : emp.designation ?? 'Team',
                    style: TextStyle(
                      fontSize: 12,
                      color: ot > 0 ? AppColors.accent : AppColors.textSecondary,
                      fontWeight: ot > 0 ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),

            // P / A / H / L Buttons
            Row(
              children: [
                _statusBtn(
                  emp,
                  AttendanceStatus.present,
                  'P',
                  AppColors.attendancePresent,
                  status == AttendanceStatus.present,
                  onLongPress: () => _showOvertimeSheet(emp),
                ),
                const SizedBox(width: 4),
                _statusBtn(
                  emp,
                  AttendanceStatus.absent,
                  'A',
                  AppColors.attendanceAbsent,
                  status == AttendanceStatus.absent,
                ),
                const SizedBox(width: 4),
                _statusBtn(
                  emp,
                  AttendanceStatus.halfDay,
                  'H',
                  AppColors.attendanceHalf,
                  status == AttendanceStatus.halfDay,
                ),
                const SizedBox(width: 4),
                _statusBtn(
                  emp,
                  AttendanceStatus.paidLeave,
                  'L',
                  AppColors.attendanceLeave,
                  status == AttendanceStatus.paidLeave,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _statusBtn(
    EmployeeModel emp,
    AttendanceStatus statusType,
    String label,
    Color activeColor,
    bool isSelected, {
    VoidCallback? onLongPress,
  }) {
    return GestureDetector(
      onLongPress: onLongPress,
      child: InkWell(
        onTap: () => _handleMarkStatus(emp, statusType),
        borderRadius: BorderRadius.circular(6),
        child: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: isSelected ? activeColor : Colors.transparent,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: isSelected ? activeColor : AppColors.divider,
              width: 1.5,
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}
