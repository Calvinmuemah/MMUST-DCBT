import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'faq_screen.dart';
import 'privacy_policy_screen.dart';
import 'referral_screen.dart';
import 'settings_screen.dart';
import 'terms_screen.dart';
import 'website_screen.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Settings & Support",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                children: [
                  const SizedBox(height: 10),
                  
                  /// SECTION 1: ACCOUNT
                  _sectionHeader("Account & Preferences"),
                  _moreItem(
                    context,
                    icon: Icons.settings_outlined,
                    title: "App Settings",
                    subtitle: "Profile, notifications, and security",
                    page: const SettingsScreen(),
                  ),
                  _moreItem(
                    context,
                    icon: Icons.card_giftcard_outlined,
                    title: "Referral Program",
                    subtitle: "Invite friends and earn rewards",
                    page: const ReferralScreen(),
                  ),
                  _moreItem(
                    context,
                    icon: Icons.language_outlined,
                    title: "Official Website",
                    subtitle: "Access MMUSTCare on the web",
                    page: const WebsiteScreen(),
                  ),

                  const SizedBox(height: 25),

                  /// SECTION 2: SUPPORT
                  _sectionHeader("Support & Help"),
                  _moreItem(
                    context,
                    icon: Icons.help_outline_rounded,
                    title: "Help Center (FAQ)",
                    subtitle: "Common questions and answers",
                    page: const FAQScreen(),
                  ),

                  const SizedBox(height: 25),

                  /// SECTION 3: LEGAL
                  _sectionHeader("Legal & Privacy"),
                  _moreItem(
                    context,
                    icon: Icons.privacy_tip_outlined,
                    title: "Privacy Policy",
                    subtitle: "How we protect your data",
                    page: const PrivacyPolicyScreen(),
                  ),
                  _moreItem(
                    context,
                    icon: Icons.description_outlined,
                    title: "Terms of Service",
                    subtitle: "Our agreement with you",
                    page: const TermsScreen(),
                  ),
                ],
              ),
            ),

            /// FOOTER
            Container(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  Text(
                    "MMUSTCare App",
                    style: TextStyle(
                      color: Colors.black.withOpacity(0.5),
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Version 1.0.0 (Build 2026.01)",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 12),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          color: Colors.grey.shade500,
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _moreItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Widget page,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => page),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.02),
              blurRadius: 12,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(.08),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: AppColors.primary, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.grey.shade500,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 12,
              color: Colors.grey.shade300,
            )
          ],
        ),
      ),
    );
  }
}
