/// All user-facing string constants for PayClock.
/// Never hardcode strings in widget files — always reference these.
class AppStrings {
  AppStrings._();

  // ── App ────────────────────────────────────────────────────────────────────
  static const String appName = 'PayClock';
  static const String appTagline = 'Attendance to Payroll — Simplified';
  static const String appVersion = 'PayClock v1.0.0 | Build 1';

  // ── Auth ───────────────────────────────────────────────────────────────────
  static const String welcomeBack = 'Welcome Back';
  static const String manageTeamEase = 'Manage your team with ease';
  static const String login = 'Login';
  static const String logout = 'Log Out';
  static const String signup = 'Sign Up';
  static const String email = 'Email';
  static const String password = 'Password';
  static const String confirmPassword = 'Confirm Password';
  static const String forgotPassword = 'Forgot Password?';
  static const String resetPassword = 'Reset Password';
  static const String fullName = 'Full Name';
  static const String phone = 'Phone Number';
  static const String continueWithGoogle = 'Continue with Google';
  static const String newHereSignUp = 'New here? Sign Up →';
  static const String alreadyHaveAccount = 'Already have an account? Login';
  static const String sendResetLink = 'Send Reset Link';
  static const String checkEmailReset = 'Check your email for the reset link.';

  // ── Onboarding ─────────────────────────────────────────────────────────────
  static const String settingUpAccount = 'Setting up your account...';
  static const String businessType = 'Business Type';
  static const String selectBusinessType = 'What kind of business do you run?';
  static const String businessDetails = 'Business Details';
  static const String workSchedule = 'Work Schedule';
  static const String salaryPolicy = 'Salary & Leave Policy';
  static const String next = 'Next';
  static const String back = 'Back';
  static const String getStarted = 'Get Started';
  static const String finish = 'Finish Setup';

  // ── Employees ──────────────────────────────────────────────────────────────
  static const String employees = 'Team';
  static const String addEmployee = 'Add Employee';
  static const String editEmployee = 'Edit Employee';
  static const String saveEmployee = 'Save Employee';
  static const String noEmployees = 'No employees yet';
  static const String addFirstEmployee = 'Add your first team member to get started';
  static const String searchEmployees = 'Search by name, designation...';
  static const String deactivateEmployee = 'Deactivate Employee';
  static const String deactivateConfirm =
      'Deactivate this employee? They won\'t appear in attendance.';

  // ── Attendance ─────────────────────────────────────────────────────────────
  static const String attendance = 'Attendance';
  static const String markAttendance = 'Mark Attendance';
  static const String markAllPresent = 'Mark All Present';
  static const String markAllAbsent = 'Mark All Absent';
  static const String saveAttendance = 'Save Attendance';
  static const String offlineMode = '📵 Offline Mode — Saved locally';
  static const String allSynced = 'All records synced';
  static const String pendingSync = 'records pending sync';

  // ── Attendance Status Labels ───────────────────────────────────────────────
  static const String present = 'Present';
  static const String absent = 'Absent';
  static const String halfDay = 'Half Day';
  static const String paidLeave = 'Paid Leave';
  static const String unpaidLeave = 'Unpaid Leave';
  static const String holiday = 'Holiday';
  static const String weekOff = 'Week Off';

  // ── Leaves ─────────────────────────────────────────────────────────────────
  static const String leaves = 'Leaves';
  static const String applyLeave = 'Apply Leave';
  static const String pending = 'Pending';
  static const String approved = 'Approved';
  static const String rejected = 'Rejected';
  static const String approve = 'Approve';
  static const String reject = 'Reject';
  static const String leaveReason = 'Reason (optional)';
  static const String leaveReasonRequired = 'Reason for sick leave';
  static const String startDate = 'Start Date';
  static const String endDate = 'End Date';

  // ── Payroll ────────────────────────────────────────────────────────────────
  static const String payroll = 'Payroll';
  static const String calculatePayroll = 'Calculate All Salaries';
  static const String approvePayroll = 'Approve Payroll';
  static const String generatePayslip = 'Generate Payslip';
  static const String downloadPayslip = 'Download Payslip';
  static const String sharePayslip = 'Share Payslip';
  static const String shareViaWhatsApp = 'Share via WhatsApp';
  static const String shareViaEmail = 'Share via Email';

  // ── Settings ───────────────────────────────────────────────────────────────
  static const String settings = 'Settings';
  static const String myProfile = 'My Profile';
  static const String companySettings = 'Company Settings';
  static const String notifications = 'Notifications';
  static const String subscription = 'Subscription';
  static const String dataPrivacy = 'Data & Privacy';
  static const String exportData = 'Export My Data';
  static const String privacyPolicy = 'Privacy Policy';
  static const String termsOfService = 'Terms of Service';
  static const String doNotSell = 'Do Not Sell My Data';
  static const String support = 'Support';
  static const String contactSupport = 'Contact Support';
  static const String rateApp = 'Rate PayClock';
  static const String shareApp = 'Share App';
  static const String referFriend = 'Refer a Friend';
  static const String dangerZone = 'Danger Zone';
  static const String deleteAccount = 'Delete Account';
  static const String restorePurchases = 'Restore Purchases';

  // ── Delete Account ──────────────────────────────────────────────────────────
  static const String deleteAccountTitle = 'Delete Account';
  static const String deleteAccountWarning = 'This will permanently delete:';
  static const String deleteCannotUndo = 'THIS ACTION CANNOT BE UNDONE';
  static const String continueToDelete = 'Continue to Delete';
  static const String cancelKeepAccount = 'Cancel — Keep My Account';
  static const String typeDeleteConfirm = 'Type "DELETE" to confirm';
  static const String permanentlyDeleteAll = 'Permanently Delete Everything';

  // ── Subscription ───────────────────────────────────────────────────────────
  static const String upgradePlanTitle = '🚀 Upgrade PayClock';
  static const String upgradePlanSubtitle =
      'Manage your whole team without limits';
  static const String freeTrial = '✨ 7-day free trial — No charge until trial ends. Cancel anytime.';
  static const String alreadySubscribed = 'Already subscribed? Restore Purchases';
  static const String planFree = 'FREE';
  static const String planStarter = 'STARTER';
  static const String planPro = 'PRO';
  static const String mostPopular = 'MOST POPULAR';

  // ── Errors ─────────────────────────────────────────────────────────────────
  static const String genericError = 'Something went wrong. Please try again.';
  static const String networkError = 'No internet connection.';
  static const String serverError = 'Server error. Please try again later.';
  static const String authError = 'Authentication failed. Please login again.';
  static const String purchaseFailed = 'Purchase failed. Please try again.';
  static const String purchaseRestored = 'Subscription restored! 🎉';

  // ── Dialogs ────────────────────────────────────────────────────────────────
  static const String confirm = 'Confirm';
  static const String cancel = 'Cancel';
  static const String ok = 'OK';
  static const String yes = 'Yes';
  static const String no = 'No';
  static const String delete = 'Delete';
  static const String save = 'Save';
  static const String edit = 'Edit';

  // ── Empty States ───────────────────────────────────────────────────────────
  static const String noAttendanceData = 'No attendance data for this day';
  static const String noLeaveRequests = 'No leave requests';
  static const String noPayrollData = 'No payroll data for this month';
  static const String noPendingLeaves = 'No pending leave requests';

  // ── Premium ────────────────────────────────────────────────────────────────
  static const String premiumFeature = 'Premium Feature';
  static const String upgradeToPro = 'Upgrade to Pro';
  static const String unlockFeature = 'Unlock this feature';
}
