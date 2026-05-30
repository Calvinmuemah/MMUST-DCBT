import 'package:flutter/material.dart';

import '../../core/services/auth_service.dart';
import '../assessment/assessment_screen.dart';
import '../../core/theme/app_colors.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() =>
      _RegisterScreenState();
}

class _RegisterScreenState
    extends State<RegisterScreen> {

  final TextEditingController nameController =
      TextEditingController();

  final TextEditingController emailController =
      TextEditingController();

  final TextEditingController passwordController =
      TextEditingController();

  final TextEditingController confirmPasswordController =
      TextEditingController();

  final AuthService authService =
      AuthService();

  bool loading = false;

  bool obscurePassword = true;

  bool obscureConfirmPassword = true;

  @override
  void dispose() {

    nameController.dispose();

    emailController.dispose();

    passwordController.dispose();

    confirmPasswordController.dispose();

    super.dispose();

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
  // REGISTER
  // =====================================

  Future<void> handleRegister() async {

    final messenger =
    ScaffoldMessenger.of(context);

    final name =
    nameController.text.trim();

    final email =
    emailController.text.trim();

    final password =
    passwordController.text.trim();

    final confirmPassword =
    confirmPasswordController.text.trim();

    // =====================
    // VALIDATION
    // =====================

    if (
    name.isEmpty ||
        email.isEmpty ||
        password.isEmpty ||
        confirmPassword.isEmpty
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

    if (
    password != confirmPassword
    ) {

      messenger.showSnackBar(

        const SnackBar(

          content: Text(
            "Passwords do not match",
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
      await authService.register(

        name: name,

        email: email,

        password: password,

      );

      if (!mounted) return;

      setState(() {
        loading = false;
      });

      final success =

          result["token"] != null ||

          result["user"] != null ||

          result["success"] == true;

      if (success) {

        messenger.showSnackBar(

          const SnackBar(

            content: Text(
              "Account created successfully",
            ),

          ),

        );

        // Navigate to assessment/onboarding immediately after register
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => const AssessmentScreen(),
          ),
        );

      } else {

        messenger.showSnackBar(

          SnackBar(

            content: Text(

              result["message"]
                  ?.toString() ??

                  "Registration failed",

            ),

          ),

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
  // UI
  // =====================================

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.white,

      body: SafeArea(

        child: LayoutBuilder(

          builder: (
              context,
              constraints
              ) {

            return SingleChildScrollView(

              child: ConstrainedBox(

                constraints: BoxConstraints(

                  minHeight:
                  constraints.maxHeight,

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

                        // =====================
                        // HEADER
                        // =====================

                        const Text(

                          "Create Account",

                          textAlign:
                          TextAlign.center,

                          style: TextStyle(

                            fontSize: 30,

                            fontWeight:
                            FontWeight.bold,

                            color: Colors.black,

                          ),

                        ),

                        const SizedBox(height: 8),

                        const Text(

                          "Begin your mental wellness journey",

                          textAlign:
                          TextAlign.center,

                          style: TextStyle(

                            fontSize: 15,

                            color: Colors.grey,

                            height: 1.4,

                          ),

                        ),

                        const SizedBox(height: 30),

                        // =====================
                        // CARD
                        // =====================

                        Container(

                          width: double.infinity,

                          padding:
                          const EdgeInsets.all(22),

                          decoration: BoxDecoration(

                            color: Colors.white,

                            borderRadius:
                            BorderRadius.circular(
                              24,
                            ),

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
                              // NAME
                              // =====================

                              TextField(

                                controller:
                                nameController,

                                decoration:
                                inputDecoration(

                                  hint: "Full Name",

                                  icon:
                                  Icons.person_outline,

                                ),

                              ),

                              const SizedBox(height: 14),

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

                              const SizedBox(height: 14),

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

                                  suffixIcon:
                                  IconButton(

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

                              const SizedBox(height: 14),

                              // =====================
                              // CONFIRM PASSWORD
                              // =====================

                              TextField(

                                controller:
                                confirmPasswordController,

                                obscureText:
                                obscureConfirmPassword,

                                decoration:
                                inputDecoration(

                                  hint:
                                  "Confirm Password",

                                  icon:
                                  Icons.lock_outline,

                                  suffixIcon:
                                  IconButton(

                                    onPressed: () {

                                      setState(() {

                                        obscureConfirmPassword =
                                        !obscureConfirmPassword;

                                      });

                                    },

                                    icon: Icon(

                                      obscureConfirmPassword

                                          ? Icons.visibility_off

                                          : Icons.visibility,

                                      color: Colors.grey,

                                    ),

                                  ),

                                ),

                              ),

                              const SizedBox(height: 22),

                              // =====================
                              // REGISTER BUTTON
                              // =====================

                              SizedBox(

                                width: double.infinity,

                                height: 52,

                                child: ElevatedButton(

                                  onPressed:
                                  loading
                                      ? null
                                      : handleRegister,

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

                                    height: 20,

                                    width: 20,

                                    child:
                                    CircularProgressIndicator(

                                      color: Colors.white,

                                      strokeWidth: 2,

                                    ),

                                  )

                                      : const Text(

                                    "Create Account",

                                    style: TextStyle(

                                      fontSize: 16,

                                      fontWeight:
                                      FontWeight.bold,

                                      color: Colors.white,

                                    ),

                                  ),

                                ),

                              ),

                              const SizedBox(height: 14),

                              // =====================
                              // LOGIN LINK
                              // =====================

                              TextButton(

                                onPressed: () {

                                  Navigator.pushReplacement(

                                    context,

                                    MaterialPageRoute(

                                      builder: (_) =>
                                      const LoginScreen(),

                                    ),

                                  );

                                },

                                child: Text(

                                  "Already have an account? Login",

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