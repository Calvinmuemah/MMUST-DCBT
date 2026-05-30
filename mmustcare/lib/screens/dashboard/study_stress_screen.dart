import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import 'thinking_patterns_screen.dart';

class StudyStressScreen extends StatefulWidget {
  const StudyStressScreen({super.key});

  @override
  State<StudyStressScreen> createState() =>
      _StudyStressScreenState();
}

class _StudyStressScreenState
    extends State<StudyStressScreen> {

  // reflection fields removed per design

  final List<Map<String, dynamic>> tips = [

    {
      "title": "Break Tasks Into Small Steps",
      "description":
      "Large assignments feel easier when divided into smaller manageable tasks.",
      "icon": Icons.checklist,
      "color": Colors.blue,
    },

    {
      "title": "Take Short Breaks",
      "description":
      "Resting for a few minutes can improve focus and reduce mental exhaustion.",
      "icon": Icons.self_improvement,
      "color": Colors.green,
    },

    {
      "title": "Avoid Last Minute Rush",
      "description":
      "Planning early reduces pressure and improves confidence.",
      "icon": Icons.schedule,
      "color": Colors.orange,
    },

    {
      "title": "Sleep Matters",
      "description":
      "Good sleep improves memory, concentration, and emotional balance.",
      "icon": Icons.nightlight_round,
      "color": Colors.indigo,
    },

  ];

  final List<Map<String, dynamic>> quickActions = [

    {
      "title": "5 Minute Breathing",
      "icon": Icons.air,
      "color": Colors.teal,
    },

    {
      "title": "Stretch Break",
      "icon": Icons.accessibility_new,
      "color": Colors.purple,
    },

    {
      "title": "Drink Water",
      "icon": Icons.water_drop,
      "color": Colors.blue,
    },

    {
      "title": "Positive Reflection",
      "icon": Icons.favorite,
      "color": Colors.pink,
    },

    {
      "title": "Sleep Music",
      "icon": Icons.music_note,
      "color": Colors.indigo,
    },

  ];

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _showAllQuickActions() async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 6),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: quickActions.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 1.25,
                  ),
                  itemBuilder: (context, index) {
                    final item = quickActions[index];
                    return InkWell(
                      onTap: () {
                        Navigator.pop(context);
                        _handleQuickAction(item);
                      },
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(22),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(.04), blurRadius: 10, offset: const Offset(0, 5)),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: (item['color'] as Color).withOpacity(.12), shape: BoxShape.circle),
                              child: Icon(item['icon'] as IconData, color: item['color'] as Color),
                            ),
                            const Spacer(),
                            Text(item['title'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _handleQuickAction(Map<String, dynamic> item) async {
    final title = (item['title'] as String).toLowerCase();

    if (title.contains('breathing')) {
      await showModalBottomSheet<void>(
        context: context,
        backgroundColor: Colors.transparent,
        isScrollControlled: true,
        builder: (context) {
          return Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
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
                const Text(
                  '5 Minute Breathing',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Breathe in for 4 seconds, hold for 4, then breathe out for 6. Repeat slowly for 5 minutes.',
                  style: TextStyle(height: 1.5, color: Colors.grey),
                ),
                const SizedBox(height: 18),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('1. Inhale slowly for 4 seconds.'),
                      SizedBox(height: 8),
                      Text('2. Hold your breath for 4 seconds.'),
                      SizedBox(height: 8),
                      Text('3. Exhale gently for 6 seconds.'),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Done'),
                  ),
                ),
              ],
            ),
          );
        },
      );
      return;
    }

    if (title.contains('stretch')) {
      await showModalBottomSheet<void>(
        context: context,
        backgroundColor: Colors.transparent,
        builder: (context) {
          return Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
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
                const Text(
                  'Stretch Break',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const Text('1. Roll your shoulders back 5 times.'),
                const SizedBox(height: 8),
                const Text('2. Stretch your neck gently left and right.'),
                const SizedBox(height: 8),
                const Text('3. Stand up and walk for 1 minute.'),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Done'),
                  ),
                ),
              ],
            ),
          );
        },
      );
      return;
    }

    if (title.contains('water')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Drink a glass of water now.')),
      );
      return;
    }
    if (title.contains('reflection') || title.contains('positive')) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => const ThinkingPatternsScreen(),
        ),
      );
      return;
    }

    if (title.contains('sleep')) {
      await showModalBottomSheet<void>(
        context: context,
        backgroundColor: Colors.transparent,
        builder: (context) {
          return Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
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
                const Text(
                  'Sleep Music',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Play relaxing sleep music or sounds to help you wind down.',
                  style: TextStyle(height: 1.5, color: Colors.grey),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Play'),
                  ),
                ),
              ],
            ),
          );
        },
      );
      return;
    }
  }

  // =====================================
  // SAVE REFLECTION
  // =====================================
  // reflections removed from Study Stress per design

  // stress label removed; header now shows quick tips

  // =====================================
  // UI
  // =====================================

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
      const Color(0xFFF7F8FA),

      appBar: AppBar(

        backgroundColor: Colors.white,

        elevation: 0,

        centerTitle: true,

        iconTheme:
        const IconThemeData(
          color: Colors.black,
        ),

        title: const Text(

          "Study Stress",

          style: TextStyle(

            color: Colors.black,

            fontWeight:
            FontWeight.bold,

          ),

        ),

      ),

      body: SafeArea(

        child: SingleChildScrollView(

          padding:
          const EdgeInsets.all(20),

          child: Column(

            crossAxisAlignment:
            CrossAxisAlignment.start,

            children: [

              // =========================
              // HEADER CARD
              // =========================

              Container(

                width: double.infinity,

                padding:
                const EdgeInsets.all(24),

                decoration: BoxDecoration(

                  gradient:
                  const LinearGradient(

                    colors: [

                      AppColors.primary,

                      AppColors.secondary,

                    ],

                  ),

                  borderRadius:
                  BorderRadius.circular(28),

                ),

                child: Column(

                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [

                    const Text(

                      "Manage Academic Pressure 📚",

                      style: TextStyle(

                        color: Colors.white,

                        fontSize: 24,

                        fontWeight:
                        FontWeight.bold,

                      ),

                    ),

                    const SizedBox(height: 10),

                    const Text(

                      "Academic stress is common. Small healthy habits can help you stay balanced and focused.",

                      style: TextStyle(

                        color: Colors.white70,

                        height: 1.5,

                        fontSize: 14,

                      ),

                    ),

                    const SizedBox(height: 24),

                    // Display two quick study tips in header
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(.14),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: (tips[0]['color'] as Color).withOpacity(.12),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(tips[0]['icon'] as IconData, color: tips[0]['color'] as Color),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(tips[0]['title'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                          const SizedBox(height: 4),
                                          Text(tips[0]['description'], style: const TextStyle(color: Colors.white70, fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                  ],

                ),

              ),

              const SizedBox(height: 28),

              // =========================
              // QUICK ACTIONS
              // =========================

              const Text(

                "Quick Self-Care Actions",

                style: TextStyle(

                  fontSize: 18,

                  fontWeight:
                  FontWeight.bold,

                ),

              ),

              const SizedBox(height: 16),

              GridView.builder(

                shrinkWrap: true,

                physics:
                const NeverScrollableScrollPhysics(),

                itemCount: quickActions.length > 2 ? 2 : quickActions.length,

                gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(

                  crossAxisCount: 2,

                  crossAxisSpacing: 14,

                  mainAxisSpacing: 14,

                  childAspectRatio: 1.25,

                ),

                itemBuilder:
                    (context, index) {

                  final item = quickActions[index];

                  return InkWell(
                    borderRadius: BorderRadius.circular(22),
                    onTap: () => _handleQuickAction(item),
                    child: Container(

                    padding:
                    const EdgeInsets.all(18),

                    decoration:
                    BoxDecoration(

                      color: Colors.white,

                      borderRadius:
                      BorderRadius.circular(
                        22,
                      ),

                      boxShadow: [

                        BoxShadow(

                          color: Colors.black
                              .withOpacity(
                            .04,
                          ),

                          blurRadius: 10,

                          offset:
                          const Offset(
                            0,
                            5,
                          ),

                        ),

                      ],

                    ),

                    child: Column(

                      crossAxisAlignment:
                      CrossAxisAlignment
                          .start,

                      children: [

                        Container(

                          padding:
                          const EdgeInsets.all(
                            12,
                          ),

                          decoration:
                          BoxDecoration(

                            color:
                            (item["color"]
                            as Color)
                                .withOpacity(
                              .12,
                            ),

                            shape:
                            BoxShape.circle,

                          ),

                          child: Icon(

                            item["icon"],

                            color:
                            item["color"],

                          ),

                        ),

                        const Spacer(),

                        Text(

                          item["title"],

                          style: const TextStyle(

                            fontWeight:
                            FontWeight.bold,

                            fontSize: 14,

                          ),

                        ),

                      ],

                    ),

                  ),

                  );

                },

              ),

              if (quickActions.length > 2)
                Align(
                  alignment: Alignment.center,
                  child: TextButton(
                    onPressed: () => _showAllQuickActions(),
                    child: const Text('See more'),
                  ),
                ),

              const SizedBox(height: 30),

              // =========================
              // STUDY TIPS
              // =========================

              const Text(

                "Helpful Study Tips",

                style: TextStyle(

                  fontSize: 18,

                  fontWeight:
                  FontWeight.bold,

                ),

              ),

              const SizedBox(height: 16),

              ListView.builder(

                shrinkWrap: true,

                physics:
                const NeverScrollableScrollPhysics(),

                itemCount:
                tips.length,

                itemBuilder:
                    (context, index) {

                  final tip =
                  tips[index];

                  return Container(

                    margin:
                    const EdgeInsets.only(
                      bottom: 14,
                    ),

                    padding:
                    const EdgeInsets.all(18),

                    decoration:
                    BoxDecoration(

                      color: Colors.white,

                      borderRadius:
                      BorderRadius.circular(
                        22,
                      ),

                      boxShadow: [

                        BoxShadow(

                          color: Colors.black
                              .withOpacity(
                            .04,
                          ),

                          blurRadius: 10,

                          offset:
                          const Offset(
                            0,
                            5,
                          ),

                        ),

                      ],

                    ),

                    child: Row(

                      crossAxisAlignment:
                      CrossAxisAlignment.start,

                      children: [

                        Container(

                          padding:
                          const EdgeInsets.all(
                            12,
                          ),

                          decoration:
                          BoxDecoration(

                            color:
                            (tip["color"]
                            as Color)
                                .withOpacity(
                              .12,
                            ),

                            shape:
                            BoxShape.circle,

                          ),

                          child: Icon(

                            tip["icon"],

                            color:
                            tip["color"],

                          ),

                        ),

                        const SizedBox(width: 16),

                        Expanded(

                          child: Column(

                            crossAxisAlignment:
                            CrossAxisAlignment
                                .start,

                            children: [

                              Text(

                                tip["title"],

                                style:
                                const TextStyle(

                                  fontSize: 15,

                                  fontWeight:
                                  FontWeight
                                      .bold,

                                ),

                              ),

                              const SizedBox(
                                height: 6,
                              ),

                              Text(

                                tip["description"],

                                style: TextStyle(

                                  color:
                                  Colors.grey
                                      .shade700,

                                  height: 1.5,

                                  fontSize: 13,

                                ),

                              ),

                            ],

                          ),

                        ),

                      ],

                    ),

                  );

                },

              ),

              const SizedBox(height: 30),

              // reflection UI removed from Study Stress

            ],

          ),

        ),

      ),

    );

  }

}