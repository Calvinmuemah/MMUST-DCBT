import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/theme/app_colors.dart';

import '../therapist/therapist_screen.dart';
import '../selfcare/selfcare_screen.dart';
import '../crisis/crisis_screen.dart';
import '../more/more_screen.dart';

// JOURNEY PAGES
import 'journal_screen.dart';
import 'day_planner_screen.dart';
import 'thinking_patterns_screen.dart';
import 'finance_planner_screen.dart';
import 'study_stress_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() =>
      _DashboardScreenState();
}

class _DashboardScreenState
    extends State<DashboardScreen> {

  int currentIndex = 0;

  String userName = "Student";

  @override
  void initState() {

    super.initState();

    loadUserData();

  }

  // =====================================
  // LOAD USER DATA
  // =====================================

  Future<void> loadUserData() async {

    final prefs =
    await SharedPreferences.getInstance();

    final savedName =
    prefs.getString("name");

    if (!mounted) return;

    setState(() {

      userName =

      savedName != null &&
          savedName.isNotEmpty

          ? savedName

          : "Student";

    });

  }

  // =====================================
  // GREETING
  // =====================================

  String getGreeting() {

    final hour =
    DateTime.now().hour;

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";

  }

  // =====================================
  // USER INITIALS
  // =====================================

  String getInitials(String name) {

    final parts =
    name.trim().split(" ");

    if (parts.isEmpty) {
      return "S";
    }

    if (parts.length == 1) {
      return parts.first[0].toUpperCase();
    }

    return
        "${parts[0][0]}${parts[1][0]}"
            .toUpperCase();

  }

  // =====================================
  // NAVIGATION
  // =====================================

  void openPage(Widget page) {

    Navigator.push(

      context,

      MaterialPageRoute(
        builder: (_) => page,
      ),

    );

  }

  // =====================================
  // MORE PAGE
  // =====================================

  void goToMoreScreen() {

    openPage(
      const MoreScreen(),
    );

  }

  // =====================================
  // MAIN UI
  // =====================================

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.white,

      bottomNavigationBar:
      BottomNavigationBar(

        currentIndex: currentIndex,

        backgroundColor: Colors.white,

        selectedItemColor:
        AppColors.primary,

        unselectedItemColor:
        Colors.grey,

        elevation: 8,

        type:
        BottomNavigationBarType.fixed,

        onTap: (index) {

          setState(() {
            currentIndex = index;
          });

        },

        items: const [

          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.psychology),
            label: "Therapist",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.self_improvement),
            label: "Self Care",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.warning),
            label: "Crisis",
          ),

        ],

      ),

      body: SafeArea(

        child: IndexedStack(

          index: currentIndex,

          children: [

            buildHome(),

            const TherapistScreen(),

            const SelfCareScreen(),

            const CrisisScreen(),

          ],

        ),

      ),

    );

  }

  // =====================================
  // HOME
  // =====================================

  Widget buildHome() {

    return SingleChildScrollView(

      padding: const EdgeInsets.fromLTRB(
        20,
        40,
        20,
        20,
      ),

      child: Column(

        crossAxisAlignment:
        CrossAxisAlignment.start,

        children: [

          // =========================
          // TOP BAR
          // =========================

          Row(

            mainAxisAlignment:
            MainAxisAlignment.spaceBetween,

            children: [

              CircleAvatar(

                radius: 26,

                backgroundColor:
                AppColors.primary
                    .withOpacity(.15),

                child: Text(

                  getInitials(userName),

                  style: const TextStyle(

                    color: AppColors.primary,

                    fontWeight:
                    FontWeight.bold,

                    fontSize: 16,

                  ),

                ),

              ),

              GestureDetector(

                onTap: goToMoreScreen,

                child: Container(

                  padding:
                  const EdgeInsets.all(10),

                  decoration: BoxDecoration(

                    color: Colors.white,

                    borderRadius:
                    BorderRadius.circular(14),

                    boxShadow: [

                      BoxShadow(

                        color:
                        Colors.black.withOpacity(.05),

                        blurRadius: 10,

                      )

                    ],

                  ),

                  child: const Icon(
                    Icons.more_vert,
                  ),

                ),

              ),

            ],

          ),

          const SizedBox(height: 35),

          // =========================
          // GREETING
          // =========================

          Text(

            "${getGreeting()}, $userName 👋",

            style: const TextStyle(

              fontSize: 28,

              fontWeight:
              FontWeight.bold,

            ),

          ),

          const SizedBox(height: 8),

          const Text(

            "Let's take care of your mind today",

            style: TextStyle(

              color: Colors.grey,

              fontSize: 14,

            ),

          ),

          const SizedBox(height: 30),

          // =========================
          // AI CARD
          // =========================

          Container(

            width: double.infinity,

            padding:
            const EdgeInsets.all(22),

            decoration: BoxDecoration(

              gradient:
              const LinearGradient(

                colors: [

                  AppColors.primary,

                  AppColors.secondary,

                ],

              ),

              borderRadius:
              BorderRadius.circular(25),

            ),

            child: Column(

              crossAxisAlignment:
              CrossAxisAlignment.start,

              children: [

                const Text(

                  "Talk to MMUSTCare AI",

                  style: TextStyle(

                    color: Colors.white,

                    fontSize: 18,

                    fontWeight:
                    FontWeight.bold,

                  ),

                ),

                const SizedBox(height: 10),

                const Text(

                  "What is on your mind today?",

                  style: TextStyle(
                    color: Colors.white70,
                  ),

                ),

                const SizedBox(height: 18),

                ElevatedButton(

                  onPressed: () {

                    setState(() {
                      currentIndex = 2;
                    });

                  },

                  style:
                  ElevatedButton.styleFrom(

                    backgroundColor:
                    Colors.white,

                    foregroundColor:
                    AppColors.primary,

                    elevation: 0,

                    shape:
                    RoundedRectangleBorder(

                      borderRadius:
                      BorderRadius.circular(12),

                    ),

                  ),

                  child: const Text(
                    "Let's Talk",
                  ),

                ),

              ],

            ),

          ),

          const SizedBox(height: 28),

          // =========================
          // JOURNEY SECTION
          // =========================

          const Text(

            "Your Mental Journey",

            style: TextStyle(

              fontSize: 18,

              fontWeight:
              FontWeight.bold,

            ),

          ),

          const SizedBox(height: 15),

          journeyCard(

            title: "Journal",

            description:
            "Write your thoughts and emotions safely",

            icon: Icons.menu_book_rounded,

            color: Colors.teal,

            onTap: () {

              openPage(
                const JournalScreen(),
              );

            },

          ),

          journeyCard(

            title: "Plan Your Day",

            description:
            "Organize tasks to reduce stress and improve focus",

            icon: Icons.calendar_month,

            color: Colors.blue,

            onTap: () {

              openPage(
                const DayPlannerScreen(),
              );

            },

          ),

          journeyCard(

            title: "Thinking Patterns",

            description:
            "Identify CBT distortions in your thoughts",

            icon: Icons.psychology_alt,

            color: Colors.deepPurple,

            onTap: () {

              openPage(
                const ThinkingPatternsScreen(),
              );

            },

          ),

          journeyCard(

            title: "Plan Your Finances",

            description:
            "Reduce money stress with simple budgeting",

            icon: Icons.account_balance_wallet,

            color: Colors.green,

            onTap: () {

              openPage(
                const FinancePlannerScreen(),
              );

            },

          ),

          journeyCard(

            title: "Study Stress",

            description:
            "Manage academic pressure effectively",

            icon: Icons.school,

            color: Colors.orange,

            onTap: () {

              openPage(
                const StudyStressScreen(),
              );

            },

          ),

        ],

      ),

    );

  }

  // =====================================
  // JOURNEY CARD
  // =====================================

  Widget journeyCard({

    required String title,

    required String description,

    required IconData icon,

    required Color color,

    required VoidCallback onTap,

  }) {

    return GestureDetector(

      onTap: onTap,

      child: Container(

        margin:
        const EdgeInsets.only(
          bottom: 12,
        ),

        padding:
        const EdgeInsets.all(16),

        decoration: BoxDecoration(

          color: Colors.white,

          borderRadius:
          BorderRadius.circular(18),

          boxShadow: [

            BoxShadow(

              color:
              Colors.black.withOpacity(.04),

              blurRadius: 10,

              offset: const Offset(0, 5),

            )

          ],

        ),

        child: Row(

          children: [

            Container(

              padding:
              const EdgeInsets.all(12),

              decoration: BoxDecoration(

                color:
                color.withOpacity(.12),

                shape: BoxShape.circle,

              ),

              child: Icon(

                icon,

                color: color,

              ),

            ),

            const SizedBox(width: 14),

            Expanded(

              child: Column(

                crossAxisAlignment:
                CrossAxisAlignment.start,

                children: [

                  Text(

                    title,

                    style: const TextStyle(

                      fontWeight:
                      FontWeight.bold,

                      fontSize: 15,

                    ),

                  ),

                  const SizedBox(height: 5),

                  Text(

                    description,

                    style: const TextStyle(

                      color: Colors.grey,

                      fontSize: 12,

                    ),

                  ),

                ],

              ),

            ),

            const Icon(

              Icons.arrow_forward_ios,

              size: 14,

              color: Colors.grey,

            ),

          ],

        ),

      ),

    );

  }

}