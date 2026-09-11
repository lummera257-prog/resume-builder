/// All route string constants and route generation for PayClock.
library;

import 'package:flutter/material.dart';
import 'package:payclock/presentation/screens/attendance/attendance_calendar_screen.dart';
import 'package:payclock/presentation/screens/attendance/mark_attendance_screen.dart';
import 'package:payclock/presentation/screens/auth/forgot_password_screen.dart';
import 'package:payclock/presentation/screens/auth/login_screen.dart';
import 'package:payclock/presentation/screens/auth/signup_screen.dart';
import 'package:payclock/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/presentation/screens/employees/add_employee_screen.dart';
import 'package:payclock/presentation/screens/employees/employee_detail_screen.dart';
import 'package:payclock/presentation/screens/employees/employees_screen.dart';
import 'package:payclock/presentation/screens/leaves/apply_leave_screen.dart';
import 'package:payclock/presentation/screens/leaves/leave_detail_screen.dart';
import 'package:payclock/presentation/screens/leaves/leaves_screen.dart';
import 'package:payclock/presentation/screens/onboarding/onboarding_screen.dart';
import 'package:payclock/presentation/screens/payroll/payroll_screen.dart';
import 'package:payclock/presentation/screens/payroll/payslip_list_screen.dart';
import 'package:payclock/presentation/screens/settings/delete_account_screen.dart';
import 'package:payclock/presentation/screens/settings/settings_screen.dart';
import 'package:payclock/presentation/screens/splash/splash_screen.dart';
import 'package:payclock/presentation/screens/subscription/paywall_screen.dart';

/// All named route strings. Use these constants everywhere — never hardcode strings.
class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String forgotPassword = '/forgot-password';
  static const String onboarding = '/onboarding';
  static const String dashboard = '/dashboard';
  static const String employees = '/employees';
  static const String addEmployee = '/employees/add';
  static const String editEmployee = '/employees/edit';
  static const String employeeDetail = '/employees/detail';
  static const String markAttendance = '/attendance/mark';
  static const String attendanceCalendar = '/attendance/calendar';
  static const String leaves = '/leaves';
  static const String applyLeave = '/leaves/apply';
  static const String leaveDetail = '/leaves/detail';
  static const String payroll = '/payroll';
  static const String payslipList = '/payroll/payslips';
  static const String paywall = '/subscription/paywall';
  static const String settings = '/settings';
  static const String deleteAccount = '/settings/delete-account';

  /// Generates routes. Plug into MaterialApp.onGenerateRoute.
  static Route<dynamic>? onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _fadeRoute(const SplashScreen(), settings);

      case login:
        return _fadeRoute(const LoginScreen(), settings);

      case signup:
        return _slideRoute(const SignupScreen(), settings);

      case forgotPassword:
        return _slideRoute(const ForgotPasswordScreen(), settings);

      case onboarding:
        return _fadeRoute(const OnboardingScreen(), settings);

      case dashboard:
        return _fadeRoute(const DashboardScreen(), settings);

      case employees:
        return _slideRoute(const EmployeesScreen(), settings);

      case addEmployee:
        return _slideRoute(
          AddEmployeeScreen(employee: settings.arguments as EmployeeModel?),
          settings,
        );

      case editEmployee:
        return _slideRoute(
          AddEmployeeScreen(employee: settings.arguments as EmployeeModel?),
          settings,
        );

      case employeeDetail:
        return _slideRoute(
          EmployeeDetailScreen(employeeId: settings.arguments as String),
          settings,
        );

      case markAttendance:
        return _slideRoute(const MarkAttendanceScreen(), settings);

      case attendanceCalendar:
        return _slideRoute(
          AttendanceCalendarScreen(
            employeeId: settings.arguments as String?,
          ),
          settings,
        );

      case leaves:
        return _slideRoute(const LeavesScreen(), settings);

      case applyLeave:
        return _slideRoute(
          ApplyLeaveScreen(employeeId: settings.arguments as String?),
          settings,
        );

      case leaveDetail:
        return _slideRoute(
          LeaveDetailScreen(leaveId: settings.arguments as String),
          settings,
        );

      case payroll:
        return _slideRoute(const PayrollScreen(), settings);

      case payslipList:
        return _slideRoute(const PayslipListScreen(), settings);

      case paywall:
        return _slideRoute(const PaywallScreen(), settings);

      case AppRoutes.settings:
        return _slideRoute(const SettingsScreen(), settings);

      case deleteAccount:
        return _slideRoute(const DeleteAccountScreen(), settings);

      default:
        return _fadeRoute(const SplashScreen(), settings);
    }
  }

  // ── Transition helpers ─────────────────────────────────────────────────────

  static PageRoute<T> _slideRoute<T>(Widget page, RouteSettings settings) =>
      PageRouteBuilder<T>(
        settings: settings,
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, animation, __, child) => SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(1, 0),
            end: Offset.zero,
          ).animate(CurvedAnimation(parent: animation, curve: Curves.easeInOut)),
          child: child,
        ),
        transitionDuration: const Duration(milliseconds: 250),
      );

  static PageRoute<T> _fadeRoute<T>(Widget page, RouteSettings settings) =>
      PageRouteBuilder<T>(
        settings: settings,
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, animation, __, child) =>
            FadeTransition(opacity: animation, child: child),
        transitionDuration: const Duration(milliseconds: 300),
      );
}
