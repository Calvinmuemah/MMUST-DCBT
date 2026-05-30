import 'package:flutter/material.dart';

import '../../core/services/reflection_service.dart';
import '../../core/theme/app_colors.dart';

class ThinkingPatternsScreen extends StatefulWidget {
  const ThinkingPatternsScreen({super.key});

  @override
  State<ThinkingPatternsScreen> createState() =>
      _ThinkingPatternsScreenState();
}

class _ThinkingPatternsScreenState
    extends State<ThinkingPatternsScreen> {
  static const String _thinkingTag = 'thinking_patterns';

  int selectedPatternIndex = 0;
  bool _loadingReflections = false;
  bool _savingReflection = false;
  final List<Map<String, dynamic>> _savedReflections = [];

  final TextEditingController thoughtController =
      TextEditingController();

  final TextEditingController balancedController =
      TextEditingController();

  final List<Map<String, dynamic>> patterns = [

    {
      "title": "Overthinking",
      "icon": Icons.sync,
      "color": Colors.deepPurple,
      "description":
      "Repeating negative thoughts over and over.",
      "example":
      "I keep thinking I will fail no matter how much I study.",
      "tip":
      "Pause and focus on evidence instead of assumptions.",
    },

    {
      "title": "Catastrophizing",
      "icon": Icons.warning_amber_rounded,
      "color": Colors.redAccent,
      "description":
      "Expecting the worst possible outcome.",
      "example":
      "If I fail this test, my whole future is ruined.",
      "tip":
      "Ask yourself: what is the most realistic outcome?",
    },

    {
      "title": "Negative Self-Talk",
      "icon": Icons.person_off,
      "color": Colors.orange,
      "description":
      "Being overly harsh or critical to yourself.",
      "example":
      "I am useless and never do anything right.",
      "tip":
      "Speak to yourself the way you would speak to a friend.",
    },

    {
      "title": "Mind Reading",
      "icon": Icons.psychology_alt,
      "color": Colors.teal,
      "description":
      "Assuming you know what others think about you.",
      "example":
      "Everyone thinks I am awkward.",
      "tip":
      "You cannot know thoughts without communication.",
    },

    {
      "title": "All-or-Nothing",
      "icon": Icons.compare_arrows,
      "color": Colors.indigo,
      "description":
      "Seeing situations as complete success or failure.",
      "example":
      "If I don't get an A, I am a failure.",
      "tip":
      "Progress matters more than perfection.",
    },

  ];

  @override
  void initState() {
    super.initState();
    _loadSavedReflections();
  }

  @override
  void dispose() {

    thoughtController.dispose();

    balancedController.dispose();

    super.dispose();

  }

  // =====================================
  // CURRENT PATTERN
  // =====================================

  Map<String, dynamic> get currentPattern =>
      patterns[selectedPatternIndex];

  // =====================================
  // SAVE REFLECTION
  // =====================================

  String _buildReflectionText({
    required String negativeThought,
    required String balancedThought,
    required String patternTitle,
  }) {
    return 'Pattern: $patternTitle\n\nNegative Thought:\n$negativeThought\n\nBalanced Thought:\n$balancedThought';
  }

  Map<String, String> _parseReflectionText(String text) {
    final raw = text.trim();

    String extract(String start, [String? end]) {
      final s = raw.indexOf(start);
      if (s < 0) return '';
      final from = s + start.length;
      if (end == null) {
        return raw.substring(from).trim();
      }
      final e = raw.indexOf(end, from);
      if (e < 0) {
        return raw.substring(from).trim();
      }
      return raw.substring(from, e).trim();
    }

    final pattern = extract('Pattern:', '\n\nNegative Thought:');
    final thought = extract('Negative Thought:\n', '\n\nBalanced Thought:\n');
    final balanced = extract('Balanced Thought:\n');

    if (thought.isNotEmpty || balanced.isNotEmpty || pattern.isNotEmpty) {
      return {
        'pattern': pattern,
        'thought': thought,
        'balanced': balanced,
      };
    }

    return {
      'pattern': '',
      'thought': raw,
      'balanced': '',
    };
  }

  bool _isThinkingPatternItem(Map<String, dynamic> item) {
    final tags = item['tags'];
    if (tags is List) {
      for (final t in tags) {
        if (t.toString().toLowerCase() == _thinkingTag) {
          return true;
        }
      }
    }

    final sessionId = item['sessionId']?.toString().toLowerCase();
    return sessionId == _thinkingTag;
  }

  Future<void> _loadSavedReflections() async {
    setState(() {
      _loadingReflections = true;
    });

    final res = await ReflectionService.getReflections(
      tag: _thinkingTag,
      limit: 100,
    );

    if (!mounted) return;

    if (res['success'] == true) {
      final data = res['data'];
      final rows = (data is List ? data : const <dynamic>[])
          .whereType<Map<String, dynamic>>()
          .where(_isThinkingPatternItem)
          .toList();

      setState(() {
        _savedReflections
          ..clear()
          ..addAll(rows);
        _loadingReflections = false;
      });
      return;
    }

    setState(() {
      _loadingReflections = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          res['message']?.toString() ?? 'Unable to load reflections right now.',
        ),
      ),
    );
  }

  Future<void> _deleteReflection(Map<String, dynamic> item) async {
    final id = item['id']?.toString();
    if (id == null || id.isEmpty) return;

    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete reflection'),
        content: const Text('Are you sure you want to delete this reflection?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (shouldDelete != true) return;

    final res = await ReflectionService.deleteReflection(reflectionId: id);
    if (!mounted) return;

    if (res['success'] == true) {
      setState(() {
        _savedReflections.removeWhere((entry) => entry['id']?.toString() == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Reflection deleted')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(res['message']?.toString() ?? 'Failed to delete reflection')),
    );
  }

  Future<void> saveReflection() async {

    if (
    thoughtController.text.trim().isEmpty ||
        balancedController.text.trim().isEmpty
    ) {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        const SnackBar(

          content: Text(
            "Please fill all reflection fields",
          ),

        ),

      );

      return;

    }

    if (_savingReflection) {
      return;
    }

    setState(() {
      _savingReflection = true;
    });

    final text = _buildReflectionText(
      negativeThought: thoughtController.text.trim(),
      balancedThought: balancedController.text.trim(),
      patternTitle: currentPattern['title'].toString(),
    );

    final res = await ReflectionService.saveReflection(
      text: text,
      tags: [_thinkingTag, currentPattern['title'].toString().toLowerCase()],
      sessionId: _thinkingTag,
    );

    if (!mounted) return;

    setState(() {
      _savingReflection = false;
    });

    if (res['success'] != true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            res['message']?.toString() ?? 'Failed to save reflection',
          ),
        ),
      );
      return;
    }

    final saved = res['data'];
    if (saved is Map<String, dynamic>) {
      setState(() {
        _savedReflections.insert(0, saved);
      });
    }

    ScaffoldMessenger.of(context)
        .showSnackBar(

      const SnackBar(

        content: Text(
          "Reflection saved successfully",
        ),

      ),

    );

    thoughtController.clear();

    balancedController.clear();

  }

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

          "Thinking Patterns",

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

              // =====================
              // HEADER
              // =====================

              Container(

                width: double.infinity,

                padding:
                const EdgeInsets.all(22),

                decoration: BoxDecoration(

                  gradient:
                  const LinearGradient(

                    colors: [

                      AppColors.primary,

                      AppColors.secondary,

                    ],

                  ),

                  borderRadius:
                  BorderRadius.circular(26),

                ),

                child: Column(

                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [

                    const Text(

                      "Understand Your Thoughts",

                      style: TextStyle(

                        color: Colors.white,

                        fontSize: 23,

                        fontWeight:
                        FontWeight.bold,

                      ),

                    ),

                    const SizedBox(height: 10),

                    const Text(

                      "CBT helps identify unhealthy thinking patterns and replace them with healthier balanced thoughts.",

                      style: TextStyle(

                        color: Colors.white70,

                        height: 1.5,

                        fontSize: 14,

                      ),

                    ),

                  ],

                ),

              ),

              const SizedBox(height: 28),

              // =====================
              // PATTERNS TITLE
              // =====================

              const Text(

                "Common Thinking Patterns",

                style: TextStyle(

                  fontSize: 18,

                  fontWeight:
                  FontWeight.bold,

                ),

              ),

              const SizedBox(height: 16),

              // =====================
              // PATTERNS LIST
              // =====================

              SizedBox(

                height: 146,

                child: ListView.separated(

                  scrollDirection:
                  Axis.horizontal,

                  itemCount:
                  patterns.length,

                  separatorBuilder:
                      (_, __) =>
                  const SizedBox(width: 14),

                  itemBuilder:
                      (context, index) {

                    final pattern =
                    patterns[index];

                    final selected =
                        selectedPatternIndex ==
                            index;

                    return GestureDetector(

                      onTap: () {

                        setState(() {

                          selectedPatternIndex =
                              index;

                        });

                      },

                      child: AnimatedContainer(

                        duration:
                        const Duration(
                          milliseconds: 250,
                        ),

                        width: 160,

                        padding:
                        const EdgeInsets.all(18),

                        decoration: BoxDecoration(

                          color: selected

                              ? pattern["color"]
                              .withOpacity(.15)

                              : Colors.white,

                          borderRadius:
                          BorderRadius.circular(
                            22,
                          ),

                          border: Border.all(

                            color: selected

                                ? pattern["color"]

                                : Colors.grey
                                .shade200,

                            width: 1.4,

                          ),

                          boxShadow: [

                            BoxShadow(

                              color:
                              Colors.black
                                  .withOpacity(
                                .03,
                              ),

                              blurRadius: 8,

                              offset:
                              const Offset(
                                0,
                                4,
                              ),

                            )

                          ],

                        ),

                        child: Column(

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
                                pattern["color"]
                                    .withOpacity(
                                  .12,
                                ),

                                shape:
                                BoxShape.circle,

                              ),

                              child: Icon(

                                pattern["icon"],

                                color:
                                pattern["color"],

                              ),

                            ),

                            const Spacer(),

                            Text(

                              pattern["title"],

                              style: TextStyle(

                                fontWeight:
                                FontWeight.bold,

                                fontSize: 15,

                                color: selected

                                    ? pattern["color"]

                                    : Colors.black,

                              ),

                            ),

                            const SizedBox(height: 6),

                            Text(

                              pattern["description"],

                              maxLines: 2,

                              overflow:
                              TextOverflow.ellipsis,

                              style: TextStyle(

                                fontSize: 12,

                                color:
                                Colors.grey
                                    .shade600,

                              ),

                            ),

                          ],

                        ),

                      ),

                    );

                  },

                ),

              ),

              const SizedBox(height: 28),

              // =====================
              // DETAILS CARD
              // =====================

              Container(

                width: double.infinity,

                padding:
                const EdgeInsets.all(22),

                decoration: BoxDecoration(

                  color: Colors.white,

                  borderRadius:
                  BorderRadius.circular(24),

                  boxShadow: [

                    BoxShadow(

                      color:
                      Colors.black.withOpacity(
                        .04,
                      ),

                      blurRadius: 10,

                      offset:
                      const Offset(0, 5),

                    ),

                  ],

                ),

                child: Column(

                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [

                    Row(

                      children: [

                        Container(

                          padding:
                          const EdgeInsets.all(12),

                          decoration:
                          BoxDecoration(

                            color:
                            currentPattern["color"]
                                .withOpacity(.12),

                            shape:
                            BoxShape.circle,

                          ),

                          child: Icon(

                            currentPattern["icon"],

                            color:
                            currentPattern["color"],

                          ),

                        ),

                        const SizedBox(width: 14),

                        Expanded(

                          child: Text(

                            currentPattern["title"],

                            style: const TextStyle(

                              fontSize: 20,

                              fontWeight:
                              FontWeight.bold,

                            ),

                          ),

                        ),

                      ],

                    ),

                    const SizedBox(height: 22),

                    _infoTile(

                      title: "Description",

                      content:
                      currentPattern["description"],

                    ),

                    const SizedBox(height: 16),

                    _infoTile(

                      title: "Example",

                      content:
                      currentPattern["example"],

                    ),

                    const SizedBox(height: 16),

                    _infoTile(

                      title: "Helpful Tip",

                      content:
                      currentPattern["tip"],

                    ),

                  ],

                ),

              ),

              const SizedBox(height: 28),

              // =====================
              // REFLECTION SECTION
              // =====================

              Container(

                width: double.infinity,

                padding:
                const EdgeInsets.all(22),

                decoration: BoxDecoration(

                  color: Colors.white,

                  borderRadius:
                  BorderRadius.circular(24),

                  boxShadow: [

                    BoxShadow(

                      color:
                      Colors.black.withOpacity(
                        .04,
                      ),

                      blurRadius: 10,

                      offset:
                      const Offset(0, 5),

                    ),

                  ],

                ),

                child: Column(

                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [

                    const Text(

                      "Thought Reflection",

                      style: TextStyle(

                        fontSize: 18,

                        fontWeight:
                        FontWeight.bold,

                      ),

                    ),

                    const SizedBox(height: 10),

                    const Text(

                      "Write your thoughts and try reframing them in a more balanced way.",

                      style: TextStyle(

                        color: Colors.grey,

                        height: 1.5,

                      ),

                    ),

                    const SizedBox(height: 22),

                    // =====================
                    // NEGATIVE THOUGHT
                    // =====================

                    TextField(

                      controller:
                      thoughtController,

                      minLines: 4,

                      maxLines: 6,

                      decoration:
                      InputDecoration(

                        hintText:
                        "What negative thought have you been experiencing?",

                        filled: true,

                        fillColor:
                        Colors.grey.shade50,

                        border:
                        OutlineInputBorder(

                          borderRadius:
                          BorderRadius.circular(
                            18,
                          ),

                          borderSide:
                          BorderSide.none,

                        ),

                      ),

                    ),

                    const SizedBox(height: 18),

                    // =====================
                    // BALANCED THOUGHT
                    // =====================

                    TextField(

                      controller:
                      balancedController,

                      minLines: 4,

                      maxLines: 6,

                      decoration:
                      InputDecoration(

                        hintText:
                        "What would be a more balanced or realistic thought?",

                        filled: true,

                        fillColor:
                        Colors.grey.shade50,

                        border:
                        OutlineInputBorder(

                          borderRadius:
                          BorderRadius.circular(
                            18,
                          ),

                          borderSide:
                          BorderSide.none,

                        ),

                      ),

                    ),

                    const SizedBox(height: 22),

                    SizedBox(

                      width: double.infinity,

                      height: 52,

                      child: ElevatedButton.icon(

                        onPressed: _savingReflection ? null : saveReflection,

                        icon: const Icon(
                          Icons.check_circle,
                          color: Colors.white,
                        ),

                        label: const Text(

                          "Save Reflection",

                          style: TextStyle(

                            color: Colors.white,

                            fontWeight:
                            FontWeight.bold,

                            fontSize: 15,

                          ),

                        ),

                        style:
                        ElevatedButton.styleFrom(

                          backgroundColor:
                          AppColors.primary,

                          elevation: 0,

                          shape:
                          RoundedRectangleBorder(

                            borderRadius:
                            BorderRadius.circular(
                              16,
                            ),

                          ),

                        ),

                      ),

                    ),

                    const SizedBox(height: 22),

                    const Divider(height: 1),

                    const SizedBox(height: 18),

                    const Text(
                      'Saved Reflections',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    if (_loadingReflections)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 18),
                        child: Center(child: CircularProgressIndicator()),
                      )
                    else if (_savedReflections.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'No saved reflections yet.',
                          style: TextStyle(color: Colors.black54),
                        ),
                      )
                    else
                      ..._savedReflections.map((item) {
                        final parsed = _parseReflectionText(item['text']?.toString() ?? '');
                        final patternTitle = parsed['pattern']?.isNotEmpty == true
                            ? parsed['pattern']!
                            : 'Thinking pattern reflection';
                        final negative = parsed['thought']?.isNotEmpty == true
                            ? parsed['thought']!
                            : 'No thought captured';
                        final balanced = parsed['balanced']?.isNotEmpty == true
                            ? parsed['balanced']!
                            : 'No balanced thought captured';

                        return Container(
                          margin: const EdgeInsets.only(top: 12),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade50,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.grey.shade200),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      patternTitle,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    tooltip: 'Delete reflection',
                                    onPressed: () => _deleteReflection(item),
                                    icon: const Icon(Icons.delete_outline),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Negative thought',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black54,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(negative),
                              const SizedBox(height: 10),
                              const Text(
                                'Balanced thought',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black54,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(balanced),
                            ],
                          ),
                        );
                      }).toList(),

                  ],

                ),

              ),

            ],

          ),

        ),

      ),

    );

  }

  // =====================================
  // INFO TILE
  // =====================================

  Widget _infoTile({

    required String title,

    required String content,

  }) {

    return Column(

      crossAxisAlignment:
      CrossAxisAlignment.start,

      children: [

        Text(

          title,

          style: const TextStyle(

            fontWeight:
            FontWeight.bold,

            fontSize: 15,

          ),

        ),

        const SizedBox(height: 8),

        Text(

          content,

          style: const TextStyle(

            color: Colors.black87,

            height: 1.6,

            fontSize: 14,

          ),

        ),

      ],

    );

  }

}