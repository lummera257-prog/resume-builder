import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:payclock/core/constants/app_colors.dart';
import 'package:payclock/core/constants/app_spacing.dart';
import 'package:payclock/data/models/attendance_model.dart';
import 'package:payclock/presentation/providers/attendance_provider.dart';
import 'package:payclock/presentation/providers/company_provider.dart';
import 'package:payclock/presentation/providers/employee_provider.dart';

/// Monthly attendance calendar screen showing colored markers for each working day.
class AttendanceCalendarScreen extends ConsumerStatefulWidget {
  const AttendanceCalendarScreen({
    super.key,
    this.employeeId,
  });

  final String? employeeId;

  @override
  ConsumerState<AttendanceCalendarScreen> createState() =>
      _AttendanceCalendarScreenState();
}

class _AttendanceCalendarScreenState
    extends ConsumerState<AttendanceCalendarScreen> {
  DateTime _currentMonth = DateTime(DateTime.now().year, DateTime.now().month);
  String? _selectedEmployeeId;

  @override
  void initState() {
    super.initState();
    _selectedEmployeeId = widget.employeeId;
  }

  void _prevMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1);
    });
  }

  void _nextMonth() {
    if (_currentMonth.isBefore(DateTime(DateTime.now().year, DateTime.now().month))) {
      setState(() {
        _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final company = ref.watch(companyProvider).value;
    final companyId = company?.id ?? '';
    final employees = ref.watch(employeesProvider(companyId)).value ?? [];

    final monthlyAttendanceAsync = ref.watch(
      monthlyAttendanceProvider((
        companyId: companyId,
        month: _currentMonth.month,
        year: _currentMonth.year,
      )),
    );

    final allRecords = monthlyAttendanceAsync.value ?? [];
    final records = _selectedEmployeeId == null
        ? allRecords
        : allRecords.where((a) => a.employeeId == _selectedEmployeeId).toList();

    // Map records by date string
    final Map<String, List<AttendanceModel>> recordsByDate = {};
    for (final r in records) {
      recordsByDate.putIfAbsent(r.date, () => []).add(r);
    }

    final daysInMonth = DateUtils.getDaysInMonth(_currentMonth.year, _currentMonth.month);
    final firstDayOffset = DateTime(_currentMonth.year, _currentMonth.month, 1).weekday % 7;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Calendar'),
      ),
      body: Column(
        children: [
          // Employee Filter Dropdown
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
            child: DropdownButtonFormField<String?>(
              value: _selectedEmployeeId,
              decoration: const InputDecoration(
                labelText: 'Filter by Employee',
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              items: [
                const DropdownMenuItem<String?>(
                  value: null,
                  child: Text('All Employees'),
                ),
                ...employees.map((e) => DropdownMenuItem<String?>(
                      value: e.id,
                      child: Text('${e.name} (${e.employeeCode})'),
                    )),
              ],
              onChanged: (val) => setState(() => _selectedEmployeeId = val),
            ),
          ),

          // Month Navigator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 8),
            color: AppColors.surface,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left_rounded),
                  onPressed: _prevMonth,
                ),
                Text(
                  DateFormat('MMMM yyyy').format(_currentMonth),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right_rounded),
                  onPressed: _nextMonth,
                ),
              ],
            ),
          ),

          // Day of week headers
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) {
                return SizedBox(
                  width: 40,
                  child: Text(
                    d,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const Divider(height: 1),

          // Calendar Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(AppSpacing.sm),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7,
                mainAxisSpacing: 6,
                crossAxisSpacing: 6,
              ),
              itemCount: firstDayOffset + daysInMonth,
              itemBuilder: (context, index) {
                if (index < firstDayOffset) {
                  return const SizedBox.shrink();
                }

                final day = index - firstDayOffset + 1;
                final dateStr =
                    '${_currentMonth.year.toString().padLeft(4, '0')}-'
                    '${_currentMonth.month.toString().padLeft(2, '0')}-'
                    '${day.toString().padLeft(2, '0')}';

                final dayRecords = recordsByDate[dateStr] ?? [];

                return Container(
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                    border: Border.all(
                      color: dayRecords.isNotEmpty
                          ? AppColors.primary.withOpacity(0.3)
                          : AppColors.divider,
                    ),
                  ),
                  padding: const EdgeInsets.all(4),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '$day',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (dayRecords.isNotEmpty)
                        Wrap(
                          spacing: 2,
                          runSpacing: 2,
                          alignment: WrapAlignment.center,
                          children: dayRecords.take(4).map((r) {
                            return Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: r.status.color,
                                shape: BoxShape.circle,
                              ),
                            );
                          }).toList(),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Legend
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _legendItem('Present', AppColors.attendancePresent),
                _legendItem('Absent', AppColors.attendanceAbsent),
                _legendItem('Half Day', AppColors.attendanceHalf),
                _legendItem('Leave', AppColors.attendanceLeave),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _legendItem(String label, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
        ),
      ],
    );
  }
}
