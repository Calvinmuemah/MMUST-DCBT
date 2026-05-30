import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'core/services/local_notification_service.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/dashboard/reflection_history_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LocalNotificationService.init();
  runApp(const MMUSTCare());
}

class MMUSTCare extends StatelessWidget {
  const MMUSTCare({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "MMUSTCare",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const OnboardingScreen(),
      routes: {
        '/reflections': (ctx) => const ReflectionHistoryScreen(),
      },
    );
  }
}