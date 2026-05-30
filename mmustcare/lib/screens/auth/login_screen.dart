import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/services/auth_service.dart';
import '../../core/theme/app_colors.dart';
import '../assessment/assessment_screen.dart';
import '../assessment/daily_assessments_screen.dart';
import '../dashboard/dashboard_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final TextEditingController emailController =
      TextEditingController();

  final TextEditingController passwordController =
      TextEditingController();

  final AuthService authService =
      AuthService();

  bool loading = false;

  bool obscurePassword = true;

  @override
  void dispose() {

    emailController.dispose();

    passwordController.dispose();

    super.dispose();

  }

  // =====================================
  // DEBUG STORAGE
  // =====================================

  Future<void> debugStorage() async {

    final prefs =
    await SharedPreferences.getInstance();

    debugPrint(
        "\n========== SHARED PREFS DEBUG =========="
    );

    debugPrint(
        "TOKEN: ${prefs.getString('token')}"
    );

    debugPrint(
        "USER: ${prefs.getString('user')}"
    );

    debugPrint(
        "USER ID: ${prefs.getString('userId')}"
    );

    debugPrint(
        "NAME: ${prefs.getString('name')}"
    );

    debugPrint(
        "EMAIL: ${prefs.getString('email')}"
    );

    debugPrint(
        "=======================================\n"
    );

  }

  // =====================================
  // LOGIN
  // =====================================

  Future<void> handleLogin() async {

    final messenger =
    ScaffoldMessenger.of(context);

    final email =
    emailController.text.trim();

    final password =
    passwordController.text.trim();

    if (
    email.isEmpty ||
        password.isEmpty
    ) {

      messenger.showSnackBar(

        const SnackBar(

          content: Text(
            "Please fill all fields",
          ),

        ),

      );

      return;

    }

    setState(() {
      loading = true;
    });

    try {

      final result =
      await authService.login(

        email: email,

        password: password,

      );

      if (!mounted) return;

      setState(() {
        loading = false;
      });

      // LOGIN FAILED

      if (result["token"] == null) {

        messenger.showSnackBar(

          SnackBar(

            content: Text(

              result["message"]
                  ?.toString() ??

                  "Login failed",

            ),

          ),

        );

        return;

      }

      // LOGIN SUCCESS

      await debugStorage();

      messenger.showSnackBar(
        const SnackBar(
          content: Text("Login successful"),
        ),
      );

      // Decide where to navigate based on onboarding completion
      final user = result['user'];
      final bool onboardingCompleted = user is Map<String, dynamic>
          ? (user['onboardingCompleted'] == true)
          : false;

      if (!onboardingCompleted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const AssessmentScreen()),
        );

        return;
      }

      final bool dailyAssessmentRequired =
          result['dailyAssessmentRequired'] == true;

      if (dailyAssessmentRequired) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const DailyAssessmentsScreen()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const DashboardScreen()),
        );
      }

    } catch (e) {

      if (!mounted) return;

      setState(() {
        loading = false;
      });

      messenger.showSnackBar(

        SnackBar(

          content: Text(
            "Error: $e",
          ),

        ),

      );

    }

  }

  // =====================================
  // INPUT DECORATION
  // =====================================

  InputDecoration inputDecoration({
    required String hint,
    required IconData icon,
    Widget? suffixIcon,
  }) {

    return InputDecoration(

      hintText: hint,

      prefixIcon: Icon(icon),

      suffixIcon: suffixIcon,

      filled: true,

      fillColor: Colors.grey.shade50,

      border: OutlineInputBorder(

        borderRadius:
        BorderRadius.circular(14),

        borderSide: BorderSide.none,

      ),

      enabledBorder: OutlineInputBorder(

        borderRadius:
        BorderRadius.circular(14),

        borderSide: BorderSide.none,

      ),

      focusedBorder: OutlineInputBorder(

        borderRadius:
        BorderRadius.circular(14),

        borderSide: BorderSide.none,

      ),

    );

  }

  // =====================================
  // UI
  // =====================================

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.white,

      body: SafeArea(

        child: LayoutBuilder(

          builder: (context, constraints) {

            return SingleChildScrollView(

              child: ConstrainedBox(

                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight,
                ),

                child: Center(

                  child: Padding(

                    padding:
                    const EdgeInsets.symmetric(
                      horizontal: 24,
                    ),

                    child: Column(

                      mainAxisAlignment:
                      MainAxisAlignment.center,

                      children: [

                        // =========================
                        // TITLE
                        // =========================

                        const Text(

                          "Welcome Back",

                          textAlign: TextAlign.center,

                          style: TextStyle(

                            fontSize: 32,

                            fontWeight:
                            FontWeight.bold,

                            color: Colors.black,

                          ),

                        ),

                        const SizedBox(height: 8),

                        const Text(

                          "Continue your mental wellness journey",

                          textAlign: TextAlign.center,

                          style: TextStyle(

                            color: Colors.grey,

                            fontSize: 15,

                          ),

                        ),

                        const SizedBox(height: 35),

                        // =========================
                        // CARD
                        // =========================

                        Container(

                          padding:
                          const EdgeInsets.all(22),

                          decoration: BoxDecoration(

                            color: Colors.white,

                            borderRadius:
                            BorderRadius.circular(24),

                            boxShadow: [

                              BoxShadow(

                                color:
                                Colors.black.withOpacity(
                                  0.05,
                                ),

                                blurRadius: 20,

                                offset:
                                const Offset(0, 10),

                              )

                            ],

                          ),

                          child: Column(

                            children: [

                              // =====================
                              // EMAIL
                              // =====================

                              TextField(

                                controller:
                                emailController,

                                keyboardType:
                                TextInputType.emailAddress,

                                decoration:
                                inputDecoration(

                                  hint: "Email",

                                  icon:
                                  Icons.email_outlined,

                                ),

                              ),

                              const SizedBox(height: 16),

                              // =====================
                              // PASSWORD
                              // =====================

                              TextField(

                                controller:
                                passwordController,

                                obscureText:
                                obscurePassword,

                                decoration:
                                inputDecoration(

                                  hint: "Password",

                                  icon:
                                  Icons.lock_outline,

                                  suffixIcon: IconButton(

                                    onPressed: () {

                                      setState(() {

                                        obscurePassword =
                                        !obscurePassword;

                                      });

                                    },

                                    icon: Icon(

                                      obscurePassword

                                          ? Icons.visibility_off

                                          : Icons.visibility,

                                      color: Colors.grey,

                                    ),

                                  ),

                                ),

                              ),

                              const SizedBox(height: 25),

                              // =====================
                              // LOGIN BUTTON
                              // =====================

                              SizedBox(

                                width: double.infinity,

                                height: 52,

                                child: ElevatedButton(

                                  onPressed:
                                  loading
                                      ? null
                                      : handleLogin,

                                  style:
                                  ElevatedButton.styleFrom(

                                    backgroundColor:
                                    AppColors.primary,

                                    foregroundColor:
                                    Colors.white,

                                    elevation: 0,

                                    shape:
                                    RoundedRectangleBorder(

                                      borderRadius:
                                      BorderRadius.circular(
                                        14,
                                      ),

                                    ),

                                  ),

                                  child: loading

                                      ? const SizedBox(

                                    height: 22,

                                    width: 22,

                                    child:
                                    CircularProgressIndicator(

                                      color: Colors.white,

                                      strokeWidth: 2.5,

                                    ),

                                  )

                                      : const Text(

                                    "Login",

                                    style: TextStyle(

                                      color: Colors.white,

                                      fontSize: 16,

                                      fontWeight:
                                      FontWeight.bold,

                                    ),

                                  ),

                                ),

                              ),

                              const SizedBox(height: 18),

                              // =====================
                              // REGISTER
                              // =====================

                              TextButton(

                                onPressed: () {

                                  Navigator.push(

                                    context,

                                    MaterialPageRoute(

                                      builder: (_) =>
                                      const RegisterScreen(),

                                    ),

                                  );

                                },

                                child: Text(

                                  "Don't have an account? Register",

                                  style: TextStyle(

                                    color:
                                    AppColors.primary,

                                    fontWeight:
                                    FontWeight.w600,

                                  ),

                                ),

                              ),

                            ],

                          ),

                        ),

                      ],

                    ),

                  ),

                ),

              ),

            );

          },

        ),

      ),

    );

  }

}