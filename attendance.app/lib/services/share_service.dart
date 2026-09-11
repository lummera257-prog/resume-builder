import 'dart:io';
import 'dart:typed_data';

import 'package:path_provider/path_provider.dart';
import 'package:printing/printing.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/core/utils/logger.dart';

/// Service for sharing payslips and application links via WhatsApp, email, system share sheet, and in-app preview.
class ShareService {
  ShareService._();

  static final ShareService instance = ShareService._();

  /// Share payslip PDF file to system share sheet.
  Future<void> sharePayslipFile(Uint8List pdfBytes, String filename) async {
    try {
      final tempDir = await getTemporaryDirectory();
      final sanitizedFilename = filename.replaceAll(RegExp(r'[^\w\.-]'), '_');
      final file = File('${tempDir.path}/$sanitizedFilename');
      await file.writeAsBytes(pdfBytes);

      await Share.shareXFiles(
        [XFile(file.path)],
        text: 'Salary Slip generated with PayClock',
      );
    } catch (e, st) {
      AppLogger.error('sharePayslipFile failed', e, st);
    }
  }

  /// Share payslip directly via WhatsApp chat with prefilled message.
  Future<void> shareViaWhatsApp({
    required String phone, // 10 digits without +91
    required String employeeName,
    required String month,
    required double netSalary,
    required Uint8List pdfBytes,
  }) async {
    try {
      // Clean phone number: remove non-digits, take last 10 digits
      final digits = phone.replaceAll(RegExp(r'\D'), '');
      final cleanPhone = digits.length > 10 ? digits.substring(digits.length - 10) : digits;

      final message = Uri.encodeComponent(
        '$employeeName,\n\n'
        'Your $month salary slip is ready.\n'
        'Net Salary: ${CurrencyFormatter.format(netSalary)}\n\n'
        'Sent via PayClock 📊\npayclock.in/download',
      );

      final url = 'https://wa.me/91$cleanPhone?text=$message';
      final uri = Uri.parse(url);

      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        await Future<void>.delayed(const Duration(seconds: 1));
        await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
      } else {
        // Fallback to general file share
        await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
      }
    } catch (e, st) {
      AppLogger.error('shareViaWhatsApp failed', e, st);
      await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
    }
  }

  /// Share payslip via Email client.
  Future<bool> shareViaEmail({
    required String email,
    required String employeeName,
    required String month,
    required double netSalary,
    required Uint8List pdfBytes,
  }) async {
    try {
      final subject = Uri.encodeComponent('Salary Slip for $month — PayClock');
      final body = Uri.encodeComponent(
        'Dear $employeeName,\n\n'
        'Please find attached your salary slip for $month.\n'
        'Net Salary: ${CurrencyFormatter.format(netSalary)}\n\n'
        'Regards,\n'
        'Accounts Department\n'
        'Generated via PayClock',
      );

      final mailtoUri = Uri.parse('mailto:$email?subject=$subject&body=$body');
      if (await canLaunchUrl(mailtoUri)) {
        await launchUrl(mailtoUri);
        await Future<void>.delayed(const Duration(seconds: 1));
        await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
        return true;
      } else {
        await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
        return true;
      }
    } catch (e, st) {
      AppLogger.error('shareViaEmail error', e, st);
      await sharePayslipFile(pdfBytes, '${employeeName}_${month}_Salary.pdf');
      return false;
    }
  }

  /// Preview and print PDF inside app.
  Future<void> previewPayslip(Uint8List pdfBytes, String title) async {
    try {
      await Printing.layoutPdf(
        onLayout: (_) async => pdfBytes,
        name: title,
      );
    } catch (e, st) {
      AppLogger.error('previewPayslip failed', e, st);
    }
  }

  /// Generic link / text share.
  Future<void> shareText(String text, {String? subject}) async {
    await Share.share(text, subject: subject);
  }
}
