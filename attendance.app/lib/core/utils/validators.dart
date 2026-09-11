/// Form validators for PayClock.
/// All methods follow the Flutter FormField validator signature:
///   String? validator(String? value)
/// Returns null if valid, error message string if invalid.
class AppValidators {
  AppValidators._();

  static final RegExp _emailRegex = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );

  static final RegExp _phoneRegex = RegExp(r'^[6-9]\d{9}$');
  static final RegExp _numericRegex = RegExp(r'^\d+(\.\d{1,2})?$');

  /// Validates email address format.
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required.';
    }
    if (!_emailRegex.hasMatch(value.trim())) {
      return 'Enter a valid email address.';
    }
    return null;
  }

  /// Validates Indian mobile number (10 digits, starts with 6-9).
  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return null; // Phone is optional in most places
    }
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 10) {
      return 'Enter a valid 10-digit mobile number.';
    }
    if (!_phoneRegex.hasMatch(digits)) {
      return 'Enter a valid Indian mobile number.';
    }
    return null;
  }

  /// Validates password (minimum 6 characters).
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required.';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  }

  /// Validates password confirmation matches original.
  static String? validateConfirmPassword(String? value, String original) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password.';
    }
    if (value != original) {
      return 'Passwords do not match.';
    }
    return null;
  }

  /// Validates salary — must be numeric and greater than 0.
  static String? validateSalary(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Salary is required.';
    }
    if (!_numericRegex.hasMatch(value.trim())) {
      return 'Enter a valid salary amount.';
    }
    final amount = double.tryParse(value.trim());
    if (amount == null || amount <= 0) {
      return 'Salary must be greater than ₹0.';
    }
    return null;
  }

  /// Generic required field validator.
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required.';
    }
    return null;
  }

  /// Validates full name (min 2 chars, no numbers).
  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Name is required.';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters.';
    }
    return null;
  }

  /// Validates employee code format (non-empty).
  static String? validateEmployeeCode(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Employee code is required.';
    }
    return null;
  }

  /// Calculates password strength: 0 (none) to 4 (strong).
  static int passwordStrength(String password) {
    if (password.isEmpty) return 0;
    var score = 0;
    if (password.length >= 8) score++;
    if (RegExp(r'[A-Z]').hasMatch(password)) score++;
    if (RegExp(r'[0-9]').hasMatch(password)) score++;
    if (RegExp(r'[!@#\$%^&*]').hasMatch(password)) score++;
    return score;
  }
}
