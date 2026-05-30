import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class TherapistScreen extends StatelessWidget {
  const TherapistScreen({super.key});

  IconData _contactIcon(Map<String, String> contact) {
    final key = (contact['label'] ?? contact['value'] ?? contact['iconCode'] ?? '')
        .toLowerCase();

    if (key.contains('phone') || key.contains('call')) return Icons.phone;
    if (key.contains('whatsapp')) return Icons.chat;
    if (key.contains('email') || key.contains('mail')) return Icons.email;
    if (key.contains('location') || key.contains('address')) return Icons.location_on;
    if (key.contains('website') || key.contains('web') || key.contains('link')) return Icons.language;
    if (key.contains('facebook')) return Icons.facebook;
    if (key.contains('telegram')) return Icons.send;
    return Icons.info_outline;
  }

  Color _getSafetyColor(String level) {
    switch (level) {
      case "Very High":
        return Colors.green;
      case "High":
        return Colors.lightGreen;
      case "Medium":
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  void _showTherapistContacts(
    BuildContext context,
    Map<String, dynamic> therapist,
  ) {
    final contacts = therapist["contacts"] as List<Map<String, String>>;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.62,
          minChildSize: 0.45,
          maxChildSize: 0.9,
          builder: (context, scrollController) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(28),
                ),
              ),
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                children: [
                  Center(
                    child: Container(
                      width: 46,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.support_agent,
                          color: AppColors.primary,
                          size: 30,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              therapist["name"] as String,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              therapist["role"] as String,
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text(
                    therapist["description"] as String,
                    style: const TextStyle(
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    "Direct contact",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF7F8FA),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.email_outlined,
                            color: AppColors.primary),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text(
                                "Email",
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                "kelvinmuemah855@gmail.com",
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF7F8FA),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.phone_outlined,
                            color: AppColors.primary),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text(
                                "Phone",
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                "0110975075",
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.lightPrimary.withOpacity(0.25),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.schedule, color: AppColors.primary),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Availability: ${therapist["availability"]}",
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    "Contact options",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...contacts.map(
                    (contact) => Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF7F8FA),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          Icon(_contactIcon(contact), color: AppColors.primary, size: 22),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  contact["label"] ?? "Contact",
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  contact["value"] ?? "",
                                  style: TextStyle(
                                    color: Colors.grey.shade700,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final therapists = [
      {
        "name": "Dean of Students Office",
        "role": "Student Welfare & Support Unit",
        "description":
            "Provides emotional, academic, and disciplinary support. Helps students handle stress, conflicts, and personal challenges.",
        "availability": "Mon - Fri (8:00 AM - 5:00 PM)",
        "safety": "Very High",
        "contacts": [
          {
            "label": "Support desk",
            "value": "Student welfare reception for in-person help",
            "iconCode": "57474",
          },
          {
            "label": "Help type",
            "value": "Academic, personal, and disciplinary guidance",
            "iconCode": "59429",
          },
        ],
        "tags": [
          "Academic Stress",
          "Relationships",
          "Financial Stress",
          "Crisis Support"
        ],
      },
      {
        "name": "MMUST University Clinic",
        "role": "Medical & Mental Health Support",
        "description":
            "Offers medical consultation and basic mental health screening with referral to professional care when needed.",
        "availability": "24/7 Emergency / OPD Hours",
        "safety": "Very High",
        "contacts": [
          {
            "label": "Clinic reception",
            "value": "Medical and mental health support desk",
            "iconCode": "59552",
          },
          {
            "label": "Support type",
            "value": "Screening, referral, and emergency care support",
            "iconCode": "59504",
          },
        ],
        "tags": [
          "Anxiety",
          "Depression Screening",
          "Stress",
          "Emergency Care"
        ],
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),

      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              /// =========================
              /// HEADER SECTION
              /// =========================
              const Text(
                "Get a Therapist",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                "Professional support is available within the university whenever you need it.",
                style: TextStyle(
                  color: Colors.grey,
                  height: 1.3,
                ),
              ),

              const SizedBox(height: 14),

              /// CALM INFO BANNER
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.white),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        "Support staff are trained to handle stress, anxiety, and academic pressure confidentially.",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              /// LIST
              Expanded(
                child: ListView.builder(
                  itemCount: therapists.length,
                  itemBuilder: (context, index) {
                    final t = therapists[index];
                    final safetyColor =
                        _getSafetyColor(t["safety"] as String);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [

                          /// TITLE
                          Text(
                            t["name"] as String,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 4),

                          Text(
                            t["role"] as String,
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 12),

                          /// DESCRIPTION
                          Text(
                            t["description"] as String,
                            style: const TextStyle(
                              fontSize: 14,
                              height: 1.4,
                            ),
                          ),

                          const SizedBox(height: 12),

                          /// SAFETY BADGE
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: safetyColor.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              "Safety Level: ${t["safety"]}",
                              style: TextStyle(
                                color: safetyColor,
                                fontWeight: FontWeight.w600,
                                fontSize: 12,
                              ),
                            ),
                          ),

                          const SizedBox(height: 10),

                          /// AVAILABILITY
                          Text(
                            "Availability: ${t["availability"]}",
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 12),

                          /// TAGS
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: (t["tags"] as List<String>)
                                .map((tag) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.lightPrimary
                                      .withOpacity(0.5),
                                  borderRadius:
                                      BorderRadius.circular(20),
                                ),
                                child: Text(
                                  tag,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.blue.shade900,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),

                          const SizedBox(height: 16),

                          /// BUTTON (SOFT BLUE + BETTER READABILITY)
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                  AppColors.primary,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(
                                    vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: () {
                                _showTherapistContacts(context, t);
                              },
                              child: const Text(
                                "Connect / View Support",
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}