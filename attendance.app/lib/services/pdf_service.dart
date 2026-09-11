import 'dart:typed_data';

import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:payclock/core/utils/currency_formatter.dart';
import 'package:payclock/data/models/company_model.dart';
import 'package:payclock/data/models/employee_model.dart';
import 'package:payclock/data/models/payroll_model.dart';

/// PDF generation service for PayClock payslips.
class PdfService {
  PdfService._();

  static final PdfService instance = PdfService._();

  /// Generates a professional A4 salary slip PDF.
  Future<Uint8List> generatePayslipPdf({
    required CompanyModel company,
    required EmployeeModel employee,
    required PayrollModel payroll,
  }) async {
    final pdf = pw.Document();

    final monthName = DateFormat('MMMM yyyy').format(
      DateTime(payroll.year, payroll.month),
    );

    final joiningDateFormatted = employee.joinedAt != null
        ? DateFormat('dd MMM yyyy').format(employee.joinedAt!)
        : 'N/A';

    final netInWords = CurrencyFormatter.amountToWords(payroll.netSalary);

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // 1. Header Banner
              pw.Container(
                padding: const pw.EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: const pw.BoxDecoration(
                  color: PdfColor.fromInt(0xFF1B5E20), // Dark Green
                  borderRadius: pw.BorderRadius.all(pw.Radius.circular(6)),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text(
                          company.name.toUpperCase(),
                          style: pw.TextStyle(
                            color: PdfColors.white,
                            fontSize: 16,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        if (company.city != null)
                          pw.Text(
                            company.city!,
                            style: const pw.TextStyle(
                              color: PdfColors.white,
                              fontSize: 10,
                            ),
                          ),
                      ],
                    ),
                    pw.Text(
                      'PayClock',
                      style: pw.TextStyle(
                        color: PdfColors.white,
                        fontSize: 18,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              pw.SizedBox(height: 12),

              // Title
              pw.Center(
                child: pw.Text(
                  'SALARY SLIP — ${monthName.toUpperCase()}',
                  style: pw.TextStyle(
                    fontSize: 14,
                    fontWeight: pw.FontWeight.bold,
                    color: const PdfColor.fromInt(0xFF212121),
                  ),
                ),
              ),

              pw.SizedBox(height: 12),

              // Employee Info Table
              pw.Container(
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  border: pw.Border.all(color: const PdfColor.fromInt(0xFFE0E0E0)),
                  borderRadius: const pw.BorderRadius.all(pw.Radius.circular(4)),
                ),
                child: pw.Row(
                  children: [
                    pw.Expanded(
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          _infoRow('Employee Name:', employee.name),
                          pw.SizedBox(height: 4),
                          _infoRow('Employee ID:', employee.employeeCode),
                        ],
                      ),
                    ),
                    pw.Expanded(
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          _infoRow(
                            'Designation:',
                            employee.designation ?? 'Team Member',
                          ),
                          pw.SizedBox(height: 4),
                          _infoRow('Date of Joining:', joiningDateFormatted),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              pw.SizedBox(height: 12),

              // Attendance Summary Box
              pw.Container(
                padding: const pw.EdgeInsets.all(10),
                decoration: const pw.BoxDecoration(
                  color: PdfColor.fromInt(0xFFE8F5E9), // Light green box
                  borderRadius: pw.BorderRadius.all(pw.Radius.circular(4)),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      'ATTENDANCE SUMMARY',
                      style: pw.TextStyle(
                        fontSize: 11,
                        fontWeight: pw.FontWeight.bold,
                        color: const PdfColor.fromInt(0xFF1B5E20),
                      ),
                    ),
                    pw.SizedBox(height: 6),
                    pw.Row(
                      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                      children: [
                        _metricText(
                          'Total Working Days',
                          payroll.totalWorkingDays.toStringAsFixed(0),
                        ),
                        _metricText(
                          'Days Present',
                          payroll.daysPresent.toStringAsFixed(1),
                        ),
                        _metricText(
                          'Half Days',
                          payroll.halfDays.toStringAsFixed(0),
                        ),
                        _metricText(
                          'Paid Leaves',
                          payroll.paidLeaveDays.toStringAsFixed(0),
                        ),
                        _metricText(
                          'Unpaid Leaves',
                          payroll.unpaidLeaveDays.toStringAsFixed(0),
                        ),
                        _metricText(
                          'Overtime',
                          '${payroll.overtimeHours.toStringAsFixed(1)} hrs',
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              pw.SizedBox(height: 12),

              // Earnings & Deductions Tables
              pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  // Earnings
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(8),
                      decoration: pw.BoxDecoration(
                        border: pw.Border.all(
                          color: const PdfColor.fromInt(0xFFE0E0E0),
                        ),
                        borderRadius:
                            const pw.BorderRadius.all(pw.Radius.circular(4)),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'EARNINGS',
                            style: pw.TextStyle(
                              fontWeight: pw.FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                          pw.Divider(color: const PdfColor.fromInt(0xFFE0E0E0)),
                          _amountRow(
                            'Basic Salary',
                            payroll.baseSalary,
                          ),
                          _amountRow(
                            'Overtime Pay',
                            payroll.overtimePay,
                          ),
                          _amountRow(
                            'Bonus / Incentive',
                            payroll.manualBonus,
                          ),
                          pw.Divider(color: const PdfColor.fromInt(0xFFE0E0E0)),
                          _amountRow(
                            'GROSS SALARY',
                            payroll.grossSalary,
                            isBold: true,
                          ),
                        ],
                      ),
                    ),
                  ),

                  pw.SizedBox(width: 10),

                  // Deductions
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(8),
                      decoration: pw.BoxDecoration(
                        border: pw.Border.all(
                          color: const PdfColor.fromInt(0xFFE0E0E0),
                        ),
                        borderRadius:
                            const pw.BorderRadius.all(pw.Radius.circular(4)),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'DEDUCTIONS',
                            style: pw.TextStyle(
                              fontWeight: pw.FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                          pw.Divider(color: const PdfColor.fromInt(0xFFE0E0E0)),
                          _amountRow(
                            'Unpaid Leave Deduction',
                            payroll.unpaidDeduction,
                          ),
                          _amountRow(
                            'Other Deductions',
                            0.0,
                          ),
                          pw.SizedBox(height: 18),
                          pw.Divider(color: const PdfColor.fromInt(0xFFE0E0E0)),
                          _amountRow(
                            'TOTAL DEDUCTIONS',
                            payroll.unpaidDeduction,
                            isBold: true,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              pw.SizedBox(height: 14),

              // Net Salary Banner
              pw.Container(
                padding: const pw.EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                decoration: const pw.BoxDecoration(
                  color: PdfColor.fromInt(0xFF1B5E20),
                  borderRadius: pw.BorderRadius.all(pw.Radius.circular(6)),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Row(
                      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                      children: [
                        pw.Text(
                          'NET SALARY:',
                          style: pw.TextStyle(
                            color: PdfColors.white,
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.Text(
                          CurrencyFormatter.format(payroll.netSalary),
                          style: pw.TextStyle(
                            color: PdfColors.white,
                            fontSize: 16,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text(
                      netInWords,
                      style: const pw.TextStyle(
                        color: PdfColors.white,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),

              pw.Spacer(),

              // Signatures & Footer
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.end,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.BarcodeWidget(
                        barcode: pw.Barcode.qrCode(),
                        data: 'https://payclock.in/verify?id=${payroll.id}',
                        width: 50,
                        height: 50,
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text(
                        'Scan to verify\nGenerated by PayClock',
                        style: const pw.TextStyle(
                          fontSize: 8,
                          color: PdfColor.fromInt(0xFF757575),
                        ),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Container(
                        width: 160,
                        decoration: const pw.BoxDecoration(
                          border: pw.Border(
                            bottom: pw.BorderSide(
                              color: PdfColor.fromInt(0xFF212121),
                              width: 1,
                            ),
                          ),
                        ),
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text(
                        'Authorized Signatory',
                        style: pw.TextStyle(
                          fontWeight: pw.FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                      pw.Text(
                        company.name,
                        style: const pw.TextStyle(
                          fontSize: 9,
                          color: PdfColor.fromInt(0xFF757575),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  pw.Widget _infoRow(String label, String value) {
    return pw.Row(
      children: [
        pw.Text(
          '$label ',
          style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 9),
        ),
        pw.Text(
          value,
          style: const pw.TextStyle(fontSize: 9),
        ),
      ],
    );
  }

  pw.Widget _metricText(String title, String val) {
    return pw.Column(
      children: [
        pw.Text(
          title,
          style: const pw.TextStyle(fontSize: 8, color: PdfColor.fromInt(0xFF616161)),
        ),
        pw.SizedBox(height: 2),
        pw.Text(
          val,
          style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold),
        ),
      ],
    );
  }

  pw.Widget _amountRow(String title, double amount, {bool isBold = false}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 3),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(
            title,
            style: pw.TextStyle(
              fontSize: 9,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
            ),
          ),
          pw.Text(
            CurrencyFormatter.format(amount),
            style: pw.TextStyle(
              fontSize: 9,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
