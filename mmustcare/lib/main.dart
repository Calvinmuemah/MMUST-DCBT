import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/theme/app_theme.dart';
import 'core/services/local_notification_service.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/dashboard/reflection_history_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/assessment/assessment_screen.dart';
import 'screens/assessment/daily_assessments_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LocalNotificationService.init();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  final userJson = prefs.getString('user');
  
  Widget home = const OnboardingScreen();
  
  if (token != null && userJson != null) {
    try {
      final user = jsonDecode(userJson);
      final bool onboardingCompleted = prefs.getBool('onboarding_completed') ?? 
                                     user['onboardingCompleted'] == true;
      
      if (onboardingCompleted) {
        // Only check daily status if onboarding is done
        final bool dailyRequired = user['dailyAssessmentRequired'] == true;
        if (dailyRequired) {
          home = DailyAssessmentsScreen();
        } else {
          home = DashboardScreen();
        }
      } else {
        home = AssessmentScreen();
      }
    } catch (e) {
      debugPrint("Error parsing user data: $e");
    }
  }

  runApp(MMUSTCare(home: home));
}

class MMUSTCare extends StatelessWidget {
  final Widget home;
  const MMUSTCare({super.key, required this.home});

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
      child: MaterialApp(
        title: "MMUSTCare",
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: home,
        routes: {
          '/reflections': (ctx) => const ReflectionHistoryScreen(),
        },
      ),
    );
  }
}