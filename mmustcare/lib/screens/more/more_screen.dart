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
        surfaceTintColor: Colors.transparent,
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
          "More",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
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
                    icon: Icons.card_giftcard,
                    title: "Referral Program",
                    page: const ReferralScreen(),
                  ),
                  /// WEBSITE
                  _moreItem(
                    context,
                    icon: Icons.language,
                    title: "Get Us on Website",
                    page: const WebsiteScreen(),
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 20),
                  /// FAQ
                  _moreItem(
                    context,
                    icon: Icons.help_outline,
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
                  const SizedBox(height: 40),
                  const Center(
                    child: Text(
                      "Version 1.0.0",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
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
          MaterialPageRoute(builder: (_) => page),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.02),
              blurRadius: 10,
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.primary, size: 22),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
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
