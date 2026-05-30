import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

import 'settings_screen.dart';
import 'referral_screen.dart';
import 'website_screen.dart';
import 'faq_screen.dart';
import 'privacy_policy_screen.dart';
import 'terms_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

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
          onPressed: () {
            Navigator.pop(context);
          },
        ),

        title: const Text(
          "More",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: Column(
        children: [

          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [

                /// SETTINGS
                _moreItem(
                  context,
                  icon: Icons.settings_outlined,
                  title: "Settings",
                  page: const SettingsScreen(),
                ),

                /// REFERRAL
                _moreItem(
                  context,
                  icon: Icons.card_giftcard_outlined,
                  title: "Referral Code",
                  page: const ReferralScreen(),
                ),

                /// WEBSITE
                _moreItem(
                  context,
                  icon: Icons.language_outlined,
                  title: "Get us on Website",
                  page: const WebsiteScreen(),
                ),

                /// FAQ
                _moreItem(
                  context,
                  icon: Icons.question_answer_outlined,
                  title: "FAQ",
                  page: const FAQScreen(),
                ),

                /// PRIVACY
                _moreItem(
                  context,
                  icon: Icons.privacy_tip_outlined,
                  title: "Privacy Policy",
                  page: const PrivacyPolicyScreen(),
                ),

                /// TERMS
                _moreItem(
                  context,
                  icon: Icons.description_outlined,
                  title: "Terms & Conditions",
                  page: const TermsScreen(),
                ),
              ],
            ),
          ),

          /// APP VERSION
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(
              top: 10,
              bottom: 25,
            ),
            color: Colors.white,
            child: Column(
              children: [

                const Divider(),

                const SizedBox(height: 10),

                Text(
                  "MMUSTCare",
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 5),

                const Text(
                  "Version 1.0.0",
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _moreItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required Widget page,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => page,
          ),
        );
      },

      child: Container(
        margin: const EdgeInsets.only(
          bottom: 14,
        ),

        padding: const EdgeInsets.all(18),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),

          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.03),
              blurRadius: 10,
              offset: const Offset(
                0,
                5,
              ),
            )
          ],
        ),

        child: Row(
          children: [

            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color:
                    AppColors.primary.withOpacity(.1),
                borderRadius:
                    BorderRadius.circular(12),
              ),

              child: Icon(
                icon,
                color: AppColors.primary,
                size: 22,
              ),
            ),

            const SizedBox(width: 16),

            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: Colors.grey,
            )
          ],
        ),
      ),
    );
  }
}