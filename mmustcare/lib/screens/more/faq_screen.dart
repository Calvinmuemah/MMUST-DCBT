import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class FAQScreen extends StatelessWidget {
  const FAQScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),

      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        centerTitle: true,

        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios,
            color: Colors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),

        title: const Text(
          "FAQ",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(20),
        children: const [

          _FAQItem(
            question: "What is MMUSTCare?",
            answer:
                "MMUSTCare is a mental wellness app designed to help students manage stress, anxiety, and emotional well-being through guided tools and AI support.",
          ),

          _FAQItem(
            question: "Can I talk to a therapist?",
            answer:
                "Yes. The app provides access to therapist support and guided mental health resources depending on your plan and availability.",
          ),

          _FAQItem(
            question: "Is my data private?",
            answer:
                "Yes. Your data is securely stored and not shared without your consent. We prioritize your privacy and confidentiality.",
          ),

          _FAQItem(
            question: "How does the AI help me?",
            answer:
                "The AI listens to your concerns, helps you reflect on thoughts, and suggests coping strategies based on CBT principles.",
          ),

          _FAQItem(
            question: "Is MMUSTCare free?",
            answer:
                "The core features are free, but advanced therapist services or premium tools may be introduced later.",
          ),
        ],
      ),
    );
  }
}

class _FAQItem extends StatelessWidget {
  final String question;
  final String answer;

  const _FAQItem({
    required this.question,
    required this.answer,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),

      child: Theme(
        data: Theme.of(context).copyWith(
          dividerColor: Colors.transparent,
        ),

        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),

          childrenPadding: const EdgeInsets.fromLTRB(
            16,
            0,
            16,
            16,
          ),

          iconColor: AppColors.primary,
          collapsedIconColor: Colors.grey,

          title: Text(
            question,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),

          children: [
            Text(
              answer,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}