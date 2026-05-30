import 'package:flutter/material.dart';
import 'package:mmustcare/core/theme/app_colors.dart';
import 'package:mmustcare/screens/auth/login_screen.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,

        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xffEFF6FF),
              Colors.white,
              Color(0xffCCFBF1),
            ],
          ),
        ),

        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24,
            ),

            child: Column(
              children: [

                const SizedBox(height: 20),

                /// LOGO
                Container(
                  width: 75,
                  height: 75,

                  decoration: BoxDecoration(
                    borderRadius:
                        BorderRadius.circular(25),

                    gradient: const LinearGradient(
                      colors: [
                        AppColors.primary,
                        AppColors.secondary
                      ],
                    ),

                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary
                            .withOpacity(.3),
                        blurRadius: 25,
                      )
                    ],
                  ),

                  child: const Center(
                    child: Text(
                      "M",
                      style: TextStyle(
                        fontSize: 35,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                const Text(
                  "MMUSTCare",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),

                const SizedBox(height: 10),

                const Text(
                  "Your Mental Wellbeing Matters",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: AppColors.textLight,
                  ),
                ),

                const SizedBox(height: 45),

                /// MAIN CARD

                Expanded(
                  child: Container(
                    width: double.infinity,

                    padding: const EdgeInsets.all(25),

                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(.75),

                      borderRadius:
                          BorderRadius.circular(40),

                      boxShadow: [
                        BoxShadow(
                          blurRadius: 30,
                          color: Colors.black
                              .withOpacity(.05),
                        )
                      ],
                    ),

                    child: Column(
                      children: [

                        const SizedBox(height: 15),

                        const Text(
                          "🧠",
                          style: TextStyle(
                            fontSize: 80,
                          ),
                        ),

                        const SizedBox(height: 25),

                        const Text(
                          "Digital CBT Support for Students",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight:
                                FontWeight.bold,
                            color:
                                AppColors.textDark,
                          ),
                        ),

                        const SizedBox(height: 15),

                        const Text(
                          "Manage stress, anxiety, depression and academic pressure through personalized support and AI guidance.",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            height: 1.6,
                            fontSize: 16,
                            color:
                                AppColors.textLight,
                          ),
                        ),

                        const Spacer(),

                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment
                                  .spaceAround,
                          children: [

                            feature(
                                "🤖",
                                "AI Support"),

                            feature(
                                "📈",
                                "Mood Tracking"),

                            feature(
                                "🧠",
                                "CBT"),

                          ],
                        ),

                        const SizedBox(height: 35),

                        SizedBox(
                          width: double.infinity,
                          height: 60,

                          child: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const LoginScreen(),
                                  ),
                                );
                              },

                            style:
                                ElevatedButton
                                    .styleFrom(
                              shape:
                                  RoundedRectangleBorder(
                                borderRadius:
                                    BorderRadius
                                        .circular(
                                            18),
                              ),

                              backgroundColor:
                                  AppColors
                                      .primary,
                            ),

                            child: const Text(
                              "Get Started",
                              style: TextStyle(
                                color:
                                    Colors.white,
                                fontWeight:
                                    FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 15),

                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20)
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget feature(
      String emoji,
      String title,
      ) {
    return Column(
      children: [

        Text(
          emoji,
          style: const TextStyle(
            fontSize: 28,
          ),
        ),

        const SizedBox(height: 8),

        Text(
          title,
          style: const TextStyle(
            color: AppColors.textLight,
            fontWeight: FontWeight.w500,
          ),
        )
      ],
    );
  }
}