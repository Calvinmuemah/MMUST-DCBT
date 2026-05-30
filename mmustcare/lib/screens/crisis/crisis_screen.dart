import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class CrisisScreen extends StatelessWidget {
  const CrisisScreen({super.key});

  void _showContactSheet(
    BuildContext context,
    Map<String, dynamic> contact,
  ) {
    final items = contact['contacts'] as List<Map<String, String>>;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.62,
          minChildSize: 0.42,
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
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: contact['color'].withOpacity(0.12),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Icon(
                          contact['icon'] as IconData,
                          color: contact['color'] as Color,
                          size: 26,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              contact['title'] as String,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              contact['subtitle'] as String,
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
                    contact['description'] as String,
                    style: const TextStyle(
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    "Contact details",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...items.map(
                    (item) => Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF7F8FA),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            item['icon'] == 'phone'
                                ? Icons.phone_outlined
                                : item['icon'] == 'email'
                                    ? Icons.email_outlined
                                    : Icons.location_on_outlined,
                            color: AppColors.primary,
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['label'] ?? 'Contact',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item['value'] ?? '',
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

  Widget _buildContactCard(
    BuildContext context,
    Map<String, dynamic> contact,
  ) {
    final color = contact['color'] as Color;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: color.withOpacity(0.08)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Icon(
              Icons.support_agent,
              color: color,
              size: 24,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  contact['title'] as String,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  contact['subtitle'] as String,
                  style: const TextStyle(
                    color: AppColors.textLight,
                    fontSize: 12.5,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: color,
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            onPressed: () => _showContactSheet(context, contact),
            child: Text(
              contact['action'] as String,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final contacts = [
      {
        'title': 'MMUST Security',
        'subtitle': 'Campus security and emergency response (24/7)',
        'description':
            'Campus security responds to urgent safety incidents, escorts, and emergency situations on campus.',
        'action': 'Call 911',
        'color': Colors.red,
        'icon': Icons.security,
        'contacts': [
          {
            'label': 'Phone number',
            'value': '0110975071',
            'icon': 'phone',
          },
          {
            'label': 'Emergency line',
            'value': '911',
            'icon': 'phone',
          },
          {
            'label': 'Support type',
            'value': 'Campus safety and incident response',
            'icon': 'info',
          },
        ],
      },
      {
        'title': 'MMUST Ambulance',
        'subtitle': 'Medical transport and urgent response',
        'description':
            'Use this contact for urgent medical transport or immediate medical assistance around the university.',
        'action': 'View Contact',
        'color': AppColors.secondary,
        'icon': Icons.local_hospital,
        'contacts': [
          {
            'label': 'Phone number',
            'value': '0110975071',
            'icon': 'phone',
          },
          {
            'label': 'Ambulance desk',
            'value': 'University emergency transport support',
            'icon': 'phone',
          },
          {
            'label': 'Service type',
            'value': 'Medical transport and urgent response',
            'icon': 'info',
          },
        ],
      },
      {
        'title': 'MMUST Clinic',
        'subtitle': 'University mental health support',
        'description':
            'The clinic supports students with basic medical care, screening, and referrals for deeper care when needed.',
        'action': 'View Contact',
        'color': AppColors.primary,
        'icon': Icons.medical_services,
        'contacts': [
          {
            'label': 'Phone number',
            'value': '0110975071',
            'icon': 'phone',
          },
          {
            'label': 'Clinic support',
            'value': 'Medical and mental health screening desk',
            'icon': 'phone',
          },
          {
            'label': 'Follow-up',
            'value': 'Referrals and consultation support',
            'icon': 'email',
          },
        ],
      },
      {
        'title': 'Dean of Students',
        'subtitle': 'Student welfare support office',
        'description':
            'The Dean of Students office handles welfare concerns, guidance, and support for students facing difficulties.',
        'action': 'View Contact',
        'color': Colors.orange,
        'icon': Icons.groups,
        'contacts': [
          {
            'label': 'Phone number',
            'value': '0110975071',
            'icon': 'phone',
          },
          {
            'label': 'Office support',
            'value': 'Student welfare and guidance desk',
            'icon': 'phone',
          },
          {
            'label': 'Support type',
            'value': 'Welfare, guidance, and follow-up',
            'icon': 'info',
          },
        ],
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,

      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
          children: [

            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primary,
                    AppColors.secondary,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(26),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.22),
                    blurRadius: 24,
                    offset: const Offset(0, 12),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: -18,
                    top: -12,
                    child: Container(
                      width: 110,
                      height: 110,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    right: 18,
                    bottom: -20,
                    child: Container(
                      width: 74,
                      height: 74,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.shield_outlined,
                        color: Colors.white,
                        size: 34,
                      ),
                      SizedBox(height: 14),
                      Text(
                        "Crisis Support",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        "If you're in danger or feeling overwhelmed, reach out immediately using the contacts below.",
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 13.5,
                          height: 1.45,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 12,
              ),
              decoration: BoxDecoration(
                color: AppColors.lightPrimary.withOpacity(0.35),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: AppColors.primary),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Use these contacts for urgent help, university support, or immediate follow-up.",
                      style: TextStyle(
                        color: AppColors.textDark,
                        fontSize: 12.5,
                        height: 1.35,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            const Text(
              "Immediate Help",
              style: TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),

            const SizedBox(height: 8),

            const Text(
              "Tap a contact to get support quickly.",
              style: TextStyle(
                color: AppColors.textLight,
                fontSize: 13,
              ),
            ),

            const SizedBox(height: 18),

            Row(
              children: [
                Expanded(
                  child: _buildStatTile(
                    title: "24/7",
                    subtitle: "Emergency help",
                    color: Colors.red,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatTile(
                    title: "2",
                    subtitle: "University contacts",
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatTile(
                    title: "Fast",
                    subtitle: "Direct support",
                    color: AppColors.secondary,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            /// ================= CONTACTS =================
            ...contacts.map((contact) => _buildContactCard(context, contact)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatTile({
    required String title,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: color.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              color: AppColors.textLight,
              fontSize: 11.5,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}