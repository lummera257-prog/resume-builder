import 'package:intl/intl.dart';

/// Currency formatting utilities for Indian locale.
/// Uses ₹ symbol and the Indian comma system (1,23,456).
class CurrencyFormatter {
  CurrencyFormatter._();

  static final NumberFormat _indianFormat = NumberFormat(
    '#,##,##0.00',
    'en_IN',
  );

  static final NumberFormat _indianFormatNoDecimal = NumberFormat(
    '#,##,##0',
    'en_IN',
  );

  /// Formats a double as Indian currency with 2 decimal places.
  /// Example: 123456.50 → "₹1,23,456.50"
  static String format(double amount, {String symbol = '₹'}) {
    return '$symbol${_indianFormat.format(amount)}';
  }

  /// Formats without decimal places for whole numbers.
  /// Example: 13650 → "₹13,650"
  static String formatWhole(double amount, {String symbol = '₹'}) {
    return '$symbol${_indianFormatNoDecimal.format(amount)}';
  }

  /// Compact format for large numbers: ₹1.2L, ₹45K.
  /// Example: 123456 → "₹1.23L" | 45000 → "₹45K"
  static String formatCompact(double amount, {String symbol = '₹'}) {
    if (amount >= 10000000) {
      // Crore
      return '$symbol${(amount / 10000000).toStringAsFixed(2)}Cr';
    } else if (amount >= 100000) {
      // Lakh
      return '$symbol${(amount / 100000).toStringAsFixed(2)}L';
    } else if (amount >= 1000) {
      // Thousand
      return '$symbol${(amount / 1000).toStringAsFixed(1)}K';
    }
    return format(amount, symbol: symbol);
  }

  /// Converts a double amount to Indian words.
  /// Example: 13650.0 → "Thirteen Thousand Six Hundred and Fifty Rupees Only"
  static String amountToWords(double amount) {
    final rupees = amount.floor();
    final paise = ((amount - rupees) * 100).round();

    String words = _numberToWords(rupees);
    words = '${_capitalize(words)} Rupees';

    if (paise > 0) {
      words += ' and ${_capitalize(_numberToWords(paise))} Paise';
    }

    return '$words Only';
  }

  static String _capitalize(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }

  static String _numberToWords(int number) {
    if (number == 0) return 'zero';

    final ones = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
      'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
      'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
    ];
    final tens = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty',
      'sixty', 'seventy', 'eighty', 'ninety',
    ];

    String result = '';

    if (number >= 10000000) {
      result += '${_numberToWords(number ~/ 10000000)} crore ';
      number %= 10000000;
    }
    if (number >= 100000) {
      result += '${_numberToWords(number ~/ 100000)} lakh ';
      number %= 100000;
    }
    if (number >= 1000) {
      result += '${_numberToWords(number ~/ 1000)} thousand ';
      number %= 1000;
    }
    if (number >= 100) {
      result += '${ones[number ~/ 100]} hundred ';
      number %= 100;
      if (number > 0) result += 'and ';
    }
    if (number >= 20) {
      result += '${tens[number ~/ 10]} ';
      number %= 10;
    }
    if (number > 0) {
      result += ones[number];
    }

    return result.trim();
  }

  /// Parses a currency string back to double. Returns 0.0 if parsing fails.
  static double parse(String value) {
    final cleaned = value.replaceAll(RegExp(r'[₹,\s]'), '');
    return double.tryParse(cleaned) ?? 0.0;
  }
}
