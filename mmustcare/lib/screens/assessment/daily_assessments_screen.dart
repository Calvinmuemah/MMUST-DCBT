import 'package:flutter/material.dart';

import '../../core/services/auth_service.dart';
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
    if (score <= 1) {
      return "Low";
    }

    if (score <= 3) {
      return "Mild";
    }

    if (score <= 5) {
      return "Moderate";
    }

    return "High";
  }

  Future<void> finish() async {
    if (stress == null || challenge == null || mood == null) {
      return;
    }

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

    if (!mounted) {
      return;
    }

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

    if (!ok) {
      return;
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const DashboardScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final progress = (step / 4) * 100;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFEFF6FF), Color(0xFFFFFFFF), Color(0xFFF0FDFA)],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              Positioned(
                top: 20,
                left: 16,
                child: _BlurCircle(color: Colors.blue.withOpacity(0.25)),
              ),
              Positioned(
                bottom: 20,
                right: 16,
                child: _BlurCircle(color: Colors.teal.withOpacity(0.25)),
              ),
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    width: 560,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: Colors.white),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x22000000),
                          blurRadius: 24,
                          offset: Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Center(
                          child: Text(
                            "Daily Assessments",
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Center(
                          child: Text(
                            "Quick check-in before your dashboard",
                            style: TextStyle(color: Color(0xFF64748B)),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          height: 8,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(99),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: progress / 100,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF2563EB), Color(0xFF14B8A6)],
                                ),
                                borderRadius: BorderRadius.circular(99),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildStepContent(),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (step > 1)
                              OutlinedButton(
                                onPressed: back,
                                child: const Text("Back"),
                              )
                            else
                              const SizedBox(width: 72),
                            if (step < 4)
                              ElevatedButton(
                                onPressed: _canProceed() ? next : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF2563EB),
                                  foregroundColor: Colors.white,
                                ),
                                child: const Text("Next"),
                              )
                            else
                              ElevatedButton(
                                onPressed: loading ? null : finish,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF4F46E5),
                                  foregroundColor: Colors.white,
                                ),
                                child: Text(loading ? "Saving..." : "Finish"),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
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
        activeColor: const Color(0xFFDBEAFE),
        activeBorder: const Color(0xFF60A5FA),
      );
    }

    if (step == 2) {
      return _buildChoiceStep(
        title: "What is your main challenge?",
        selectedValue: challenge,
        options: challengeOptions,
        onSelect: (value) => setState(() => challenge = value),
        activeColor: const Color(0xFFCCFBF1),
        activeBorder: const Color(0xFF2DD4BF),
      );
    }

    if (step == 3) {
      return _buildChoiceStep(
        title: "How often do you feel overwhelmed?",
        selectedValue: mood,
        options: moodOptions,
        onSelect: (value) => setState(() => mood = value),
        activeColor: const Color(0xFFEDE9FE),
        activeBorder: const Color(0xFFA78BFA),
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
            color: Color(0xFF1E293B),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Stress Level: ${stress ?? '-'}"),
              const SizedBox(height: 6),
              Text("Challenge: ${challenge ?? '-'}"),
              const SizedBox(height: 6),
              Text("Overwhelm Frequency: ${mood ?? '-'}"),
            ],
          ),
        ),
        const SizedBox(height: 10),
        const Text(
          "This helps personalize your daily CBT support.",
          style: TextStyle(color: Color(0xFF64748B)),
        ),
      ],
    );
  }

  Widget _buildChoiceStep({
    required String title,
    required String? selectedValue,
    required List<String> options,
    required ValueChanged<String> onSelect,
    required Color activeColor,
    required Color activeBorder,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1E293B),
          ),
        ),
        const SizedBox(height: 14),
        ...options.map(
          (option) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: InkWell(
              onTap: () => onSelect(option),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: selectedValue == option ? activeColor : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selectedValue == option ? activeBorder : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Text(option),
              ),
            ),
          ),
        ),
      ],
    );
  }

  bool _canProceed() {
    if (step == 1) {
      return stress != null;
    }

    if (step == 2) {
      return challenge != null;
    }

    if (step == 3) {
      return mood != null;
    }

    return true;
  }
}

class _BlurCircle extends StatelessWidget {
  const _BlurCircle({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: 170,
        height: 170,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color,
          boxShadow: [
            BoxShadow(
              color: color,
              blurRadius: 64,
              spreadRadius: 8,
            ),
          ],
        ),
      ),
    );
  }
}
