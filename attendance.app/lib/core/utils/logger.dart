import 'package:logger/logger.dart';

/// App-wide logger singleton using the logger package.
/// Usage: AppLogger.debug('message') | AppLogger.error('msg', error, stackTrace)
class AppLogger {
  AppLogger._();

  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
    ),
    level: Level.trace,
  );

  static void trace(dynamic message) => _logger.t(message);
  static void debug(dynamic message) => _logger.d(message);
  static void info(dynamic message) => _logger.i(message);
  static void warning(dynamic message, [dynamic error]) =>
      _logger.w(message, error: error);
  static void error(
    dynamic message, [
    dynamic error,
    StackTrace? stackTrace,
  ]) =>
      _logger.e(message, error: error, stackTrace: stackTrace);
  static void fatal(dynamic message, [dynamic error, StackTrace? stackTrace]) =>
      _logger.f(message, error: error, stackTrace: stackTrace);
}
