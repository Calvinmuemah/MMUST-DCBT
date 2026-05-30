import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:intl/intl.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

class LocalNotificationService {
  static final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static bool _initialized = false;

  static Future<void> init() async {
    if (_initialized) return;

    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings();

    const settings = InitializationSettings(
      android: android,
      iOS: ios,
    );

    await _plugin.initialize(settings);

    final androidPlugin =
        _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    await androidPlugin?.requestNotificationsPermission();

    final iosPlugin =
        _plugin.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>();
    await iosPlugin?.requestPermissions(alert: true, badge: true, sound: true);

    tz.initializeTimeZones();

    _initialized = true;
  }

  static int taskNotificationId(int taskId) {
    return 200000 + (taskId % 1000000);
  }

  static DateTime? _parseTaskTime(String value) {
    final raw = value.trim();
    if (raw.isEmpty) return null;

    final match = RegExp(r'(\d{1,2}:\d{2}\s*[aApP][mM]|\d{1,2}:\d{2})').firstMatch(raw);
    if (match == null) return null;

    final timeText = match.group(0)?.trim() ?? '';
    if (timeText.isEmpty) return null;

    DateTime? parsed;

    try {
      parsed = DateFormat.jm().parseLoose(timeText);
    } catch (_) {}

    if (parsed == null) {
      try {
        parsed = DateFormat('H:mm').parseLoose(timeText);
      } catch (_) {}
    }

    if (parsed == null) return null;

    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day, parsed.hour, parsed.minute);
  }

  static Future<bool> scheduleDayPlannerReminder({
    required int taskId,
    required String taskName,
    required String taskTimeLabel,
    int minutesBefore = 10,
  }) async {
    await init();

    final planAt = _parseTaskTime(taskTimeLabel);
    if (planAt == null) {
      await cancelTaskReminder(taskId);
      return false;
    }

    var notifyAt = planAt.subtract(Duration(minutes: minutesBefore));
    final now = DateTime.now();

    if (notifyAt.isBefore(now)) {
      notifyAt = notifyAt.add(const Duration(days: 1));
    }

    final tzNotifyAt = tz.TZDateTime.from(notifyAt, tz.local);
    final id = taskNotificationId(taskId);

    await _plugin.zonedSchedule(
      id,
      'Upcoming plan reminder',
      '"$taskName" starts at $taskTimeLabel. Get ready in 10 minutes.',
      tzNotifyAt,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'day_planner_channel',
          'Day Planner Reminders',
          channelDescription: 'Reminders for planned day tasks',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );

    return true;
  }

  static Future<void> cancelTaskReminder(int taskId) async {
    await init();
    await _plugin.cancel(taskNotificationId(taskId));
  }
}
