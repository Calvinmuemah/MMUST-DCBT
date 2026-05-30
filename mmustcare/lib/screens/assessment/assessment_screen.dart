import 'package:flutter/material.dart';
import '../../core/services/auth_service.dart';
import '../../core/theme/app_colors.dart';
import '../dashboard/dashboard_screen.dart';

class AssessmentScreen extends StatefulWidget {
  const AssessmentScreen({super.key});

  @override
  State<AssessmentScreen> createState() =>
      _AssessmentScreenState();
}

class _AssessmentScreenState
    extends State<AssessmentScreen> {

  final authService = AuthService();

  bool isSubmitting = false;

  int currentQuestion = 0;

  int selected = -1;

  List<int> answers = [];

  final List<String> options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
  ];

  final List<String> questions = [

    "How often have you found yourself thinking that you might fail before even starting a task?",

    "How often have academic responsibilities felt overwhelming or difficult to manage?",

    "How often have negative thoughts affected your mood or motivation?",

    "How often have you avoided assignments, activities, or situations because they felt stressful?",

    "How often have you felt unable to control worrying thoughts?",

  ];

  Future<void> submitAssessment() async {

    setState(() {
      isSubmitting = true;
    });

    final payload = [];

    for (int i = 0; i < questions.length; i++) {

      payload.add({

        "questionNumber": i + 1,
        "question": questions[i],
        "answer": options[answers[i]],
        "score": answers[i]

      });

    }

    int totalScore = answers.fold(
      0,
      (sum, score) => sum + score,
    );

    String level;

    if (totalScore <= 4) {
      level = "Low";
    } else if (totalScore <= 8) {
      level = "Mild";
    } else if (totalScore <= 11) {
      level = "Moderate";
    } else {
      level = "High";
    }

    final result =
        await authService.submitOnboarding(
      payload: {

        "answers": payload,
        "totalScore": totalScore,
        "riskLevel": level,

      },
    );

    if (!mounted) return;

    setState(() {
      isSubmitting = false;
    });

    final bool success = result["success"] == true ||
      (result["statusCode"] is int &&
        (result["statusCode"] as int) >= 200 &&
        (result["statusCode"] as int) < 300);

    ScaffoldMessenger.of(context)
        .showSnackBar(

      SnackBar(

        content: Text(
          result["message"] ??
              (success
                  ? "Assessment submitted successfully"
                  : "Assessment submission failed"),
        ),

        backgroundColor:
            success ? Colors.green : Colors.red,

      ),

    );

    print(
      "Score: $totalScore"
    );

    print(
      "Level: $level"
    );

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) =>
              const DashboardScreen(),
        ),
      );
    }
  }

  void nextQuestion() {

    if (selected == -1) {
      return;
    }

    answers.add(selected);

    if (currentQuestion <
        questions.length - 1) {

      setState(() {

        currentQuestion++;

        selected = -1;

      });

    } else {

      submitAssessment();

    }

  }

  @override
  Widget build(BuildContext context) {

    bool isLastQuestion =
        currentQuestion ==
            questions.length - 1;

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          "Mental Assessment",
        ),
      ),

      body: Padding(
        padding:
            const EdgeInsets.all(20),

        child: Column(

          crossAxisAlignment:
              CrossAxisAlignment.start,

          children: [

            Text(

              "Question ${currentQuestion + 1}/${questions.length}",

              style: const TextStyle(

                color:
                    AppColors.primary,

                fontWeight:
                    FontWeight.bold,

                fontSize: 18,

              ),

            ),

            const SizedBox(
              height: 20,
            ),

            LinearProgressIndicator(
              value:
                  (currentQuestion + 1) /
                      questions.length,

              borderRadius:
                  BorderRadius.circular(
                      10),

              minHeight: 10,
            ),

            const SizedBox(
              height: 30,
            ),

            Text(

              questions[
                  currentQuestion],

              style:
                  const TextStyle(

                fontSize: 24,

                fontWeight:
                    FontWeight.bold,

              ),

            ),

            const SizedBox(
              height: 30,
            ),

            Expanded(

              child:
                  ListView.builder(

                itemCount:
                    options.length,

                itemBuilder:
                    (context,
                        index) {

                  return GestureDetector(

                    onTap: () {

                      setState(() {

                        selected =
                            index;

                      });

                    },

                    child:
                        Container(

                      margin:
                          const EdgeInsets.only(
                        bottom:
                            16,
                      ),

                      padding:
                          const EdgeInsets.all(
                        18,
                      ),

                      decoration:
                          BoxDecoration(

                        color:
                            selected ==
                                    index
                                ? AppColors
                                    .primary
                                : Colors
                                    .white,

                        borderRadius:
                            BorderRadius.circular(
                                18),

                        border:
                            Border.all(

                          color:
                              selected ==
                                      index
                                  ? AppColors
                                      .primary
                                  : Colors
                                      .grey
                                      .shade300,

                        ),

                      ),

                      child: Text(

                        options[
                            index],

                        style:
                            TextStyle(

                          fontSize:
                              16,

                          color:
                              selected ==
                                      index
                                  ? Colors
                                      .white
                                  : Colors
                                      .black,

                        ),

                      ),

                    ),

                  );

                },

              ),

            ),

            SizedBox(

              width:
                  double.infinity,

              height: 55,

              child:
                  ElevatedButton(

                onPressed:
                    selected >= 0 &&
                            !isSubmitting
                        ? nextQuestion
                        : null,

                style:
                    ElevatedButton.styleFrom(

                  backgroundColor:
                      AppColors
                          .primary,

                ),

                child:
                    isSubmitting

                        ? const SizedBox(
                            width:
                                22,
                            height:
                                22,
                            child:
                                CircularProgressIndicator(
                              strokeWidth:
                                  2.5,
                              valueColor:
                                  AlwaysStoppedAnimation(
                                      Colors.white),
                            ),
                          )

                        : Text(

                            isLastQuestion
                                ? "Submit"
                                : "Next",

                            style:
                                const TextStyle(

                              color:
                                  Colors.white,

                              fontSize:
                                  16,

                            ),

                          ),

              ),

            )

          ],

        ),

      ),

    );

  }

}