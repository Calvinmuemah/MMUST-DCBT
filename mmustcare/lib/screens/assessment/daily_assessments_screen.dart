import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/services/auth_service.dart';
import '../../core/theme/app_colors.dart';
import '../dashboard/dashboard_screen.dart';

class DailyAssessmentsScreen extends StatefulWidget {
  const DailyAssessmentsScreen({super.key});

  @override
  State<DailyAssessmentsScreen> createState() => _DailyAssessmentsScreenState();
}

class _DailyAssessmentsScreenState extends State<DailyAssessmentsScreen> {
  final AuthService _authService = AuthService();

  int step = 1;
  bool loading = false;

  String? stress;
  String? challenge;
  String? mood;

  final List<String> stressOptions = ["Low", "Moderate", "High", "Very High"];
  final List<String> challengeOptions = [
    "Academics",
    "Finances",
    "Relationships",
    "Anxiety",
    "Depression",
    "Substance Use",
  ];
  final List<String> moodOptions = ["Rarely", "Sometimes", "Often", "Almost Always"];

  void next() {
    if (step < 4) {
      setState(() {
        step += 1;
      });
    }
  }

  void back() {
    if (step > 1) {
      setState(() {
        step -= 1;
      });
    }
  }

  int _scoreFromSelection() {
    final stressScore = stressOptions.indexOf(stress ?? "");
    final moodScore = moodOptions.indexOf(mood ?? "");

    final safeStress = stressScore < 0 ? 0 : stressScore;
    final safeMood = moodScore < 0 ? 0 : moodScore;

    return safeStress + safeMood;
  }

  String _riskLevelFromScore(int score) {
    if (score <= 1) return "Low";
    if (score <= 3) return "Mild";
    if (score <= 5) return "Moderate";
    return "High";
  }

  Future<void> finish() async {
    if (stress == null || challenge == null || mood == null) return;

    setState(() {
      loading = true;
    });

    final totalScore = _scoreFromSelection();
    final riskLevel = _riskLevelFromScore(totalScore);

    final answers = [
      {
        "questionNumber": 1,
        "question": "How would you rate your stress level?",
        "answer": stress,
        "score": stressOptions.indexOf(stress!),
      },
      {
        "questionNumber": 2,
        "question": "What is your main challenge?",
        "answer": challenge,
        "score": 0,
      },
      {
        "questionNumber": 3,
        "question": "How often do you feel overwhelmed?",
        "answer": mood,
        "score": moodOptions.indexOf(mood!),
      },
    ];

    final result = await _authService.submitDailyAssessment(
      payload: {
        "stressLevel": stress,
        "mainChallenge": challenge,
        "overwhelmFrequency": mood,
        "answers": answers,
        "totalScore": totalScore,
        "riskLevel": riskLevel,
      },
    );

    if (!mounted) return;

    setState(() {
      loading = false;
    });

    final ok = result["success"] == true ||
        (result["statusCode"] is int &&
            (result["statusCode"] as int) >= 200 &&
            (result["statusCode"] as int) < 300);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          result["message"]?.toString() ??
              (ok ? "Daily assessment submitted" : "Could not submit daily assessment"),
        ),
        backgroundColor: ok ? Colors.green : Colors.red,
      ),
    );

    if (!ok) return;

    // Update local data to reflect daily assessment completion
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString('user');
      if (userJson != null) {
        final user = jsonDecode(userJson);
        user['dailyAssessmentRequired'] = false;
        await prefs.setString('user', jsonEncode(user));
      }
    } catch (e) {
      debugPrint("Error updating daily status locally: $e");
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const DashboardScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isLastStep = step == 4;

    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.black,
        title: const Text("Daily Assessment"),
        leading: step > 1
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: back,
              )
            : null,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Step $step/4",
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 20),
              LinearProgressIndicator(
                value: step / 4,
                borderRadius: BorderRadius.circular(10),
                minHeight: 10,
              ),
              const SizedBox(height: 30),
              Expanded(
                child: _buildStepContent(),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: _canProceed() && !loading
                      ? (isLastStep ? finish : next)
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                  ),
                  child: loading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation(Colors.white),
                          ),
                        )
                      : Text(
                          isLastStep ? "Finish" : "Next",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    if (step == 1) {
      return _buildChoiceStep(
        title: "How would you rate your stress level?",
        selectedValue: stress,
        options: stressOptions,
        onSelect: (value) => setState(() => stress = value),
      );
    }

    if (step == 2) {
      return _buildChoiceStep(
        title: "What is your main challenge?",
        selectedValue: challenge,
        options: challengeOptions,
        onSelect: (value) => setState(() => challenge = value),
      );
    }

    if (step == 3) {
      return _buildChoiceStep(
        title: "How often do you feel overwhelmed?",
        selectedValue: mood,
        options: moodOptions,
        onSelect: (value) => setState(() => mood = value),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Your Daily Summary",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 30),
        _buildSummaryItem("Stress Level", stress),
        _buildSummaryItem("Main Challenge", challenge),
        _buildSummaryItem("Overwhelmed", mood),
        const SizedBox(height: 20),
        const Text(
          "This helps personalize your daily CBT support.",
          style: TextStyle(
            color: Colors.grey,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryItem(String label, String? value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          Text(
            value ?? "-",
            style: const TextStyle(color: AppColors.primary, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildChoiceStep({
    required String title,
    required String? selectedValue,
    required List<String> options,
    required ValueChanged<String> onSelect,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 30),
        Expanded(
          child: ListView.builder(
            itemCount: options.length,
            itemBuilder: (context, index) {
              final option = options[index];
              final isSelected = selectedValue == option;
              return GestureDetector(
                onTap: () => onSelect(option),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isSelected ? AppColors.primary : Colors.grey.shade300,
                    ),
                  ),
                  child: Text(
                    option,
                    style: TextStyle(
                      fontSize: 16,
                      color: isSelected ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  bool _canProceed() {
    if (step == 1) return stress != null;
    if (step == 2) return challenge != null;
    if (step == 3) return mood != null;
    return true;
  }
}
