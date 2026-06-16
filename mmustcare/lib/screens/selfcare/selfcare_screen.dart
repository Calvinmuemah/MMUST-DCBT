import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'chat_service.dart';
import 'chat_session_screen.dart';

class SelfCareScreen extends StatefulWidget {
  const SelfCareScreen({super.key});
  @override
  State<SelfCareScreen> createState() => _SelfCareScreenState();
}

class _SelfCareScreenState extends State<SelfCareScreen> {
  List<String> favoriteTopics = [];
  List<Map<String, dynamic>> recentChats = [];
  bool loading = false;
  bool redirecting = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => loading = true);
    final prefs = await SharedPreferences.getInstance();
    final favs = prefs.getStringList('favorite_topics') ?? [];
    final chatsJson = prefs.getString('recent_chats');
    List<Map<String, dynamic>> chats = [];
    if (chatsJson != null) {
      try {
        chats = List<Map<String, dynamic>>.from(jsonDecode(chatsJson));
      } catch (_) {}
    }
    setState(() {
      favoriteTopics = favs;
      recentChats = chats;
      loading = false;
    });
  }

  Future<void> openChat(String topic) async {
    setState(() => redirecting = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null || token.isEmpty) {
      if (mounted) {
        setState(() => redirecting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please login to start a session.')),
        );
      }
      return;
    }

    // Update Favorites & Recent logic
    try {
      // 1. Update Favorites (Most Used)
      final statsJson = prefs.getString('topic_usage_stats') ?? '{}';
      Map<String, dynamic> stats = jsonDecode(statsJson);
      stats[topic] = (stats[topic] ?? 0) + 1;
      await prefs.setString('topic_usage_stats', jsonEncode(stats));

      List<String> favs = stats.keys.toList();
      favs.sort((a, b) => (stats[b] as int).compareTo(stats[a] as int));
      await prefs.setStringList('favorite_topics', favs.take(3).toList());

      // 2. Update Recent (Last Visited Unique)
      final chatsJson = prefs.getString('recent_chats') ?? '[]';
      List<dynamic> chats = jsonDecode(chatsJson);
      
      // Remove if already exists to move it to top
      chats.removeWhere((c) => c['topic'] == topic);
      
      chats.insert(0, {
        'topic': topic,
        'date': DateTime.now().toString().split(' ')[0], // Simple YYYY-MM-DD
      });
      
      await prefs.setString('recent_chats', jsonEncode(chats.take(3).toList()));
    } catch (e) {
      debugPrint("Error updating topic stats: $e");
    }

    try {
      final res = await ChatService.startSession(topic, token);
      final sessionId = res["sessionId"];
      final firstMessage = res["message"] ?? "Hello! How can I help you with $topic today?";
      if (mounted) {
        setState(() => redirecting = false);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ChatSessionScreen(
              sessionId: sessionId.toString(),
              token: token,
              initialMessage: firstMessage,
            ),
          ),
        ).then((_) => _loadData());
      }
    } catch (e) {
      if (mounted) {
        setState(() => redirecting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> toolkit = [
      {"title": "Anxiety", "icon": Icons.air, "color": Colors.blue},
      {"title": "Depression", "icon": Icons.cloud_queue, "color": Colors.indigo},
      {"title": "Stress", "icon": Icons.bolt, "color": Colors.orange},
      {"title": "Self-Esteem", "icon": Icons.face, "color": Colors.pink},
      {"title": "Relationships", "icon": Icons.favorite_border, "color": Colors.red},
      {"title": "Sleep", "icon": Icons.bedtime_outlined, "color": Colors.deepPurple},
      {"title": "Finances", "icon": Icons.payments_outlined, "color": Colors.green},
      {"title": "Work", "icon": Icons.work_outline, "color": Colors.brown},
      {"title": "Examinations", "icon": Icons.assignment_outlined, "color": Colors.cyan},
      {"title": "Studies", "icon": Icons.school_outlined, "color": Colors.blueGrey},
      {"title": "Family", "icon": Icons.people_outline, "color": Colors.teal},
      {"title": "Pain", "icon": Icons.healing_outlined, "color": Colors.orangeAccent},
      {"title": "Drugs Abuse", "icon": Icons.warning_amber_outlined, "color": Colors.deepOrange},
      {"title": "Gambling", "icon": Icons.casino_outlined, "color": Colors.purpleAccent},
      {"title": "Social Anxiety", "icon": Icons.forum_outlined, "color": Colors.blueAccent},
      {"title": "Procrastination", "icon": Icons.timer_outlined, "color": Colors.amber},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,
      body: SafeArea(
        child: Stack(
          children: [
            loading
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(16, 40, 16, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Your Mental Wellness Toolkit",
                          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          "Explore CBT-based tools to help you manage thoughts, emotions, and stress.",
                          style: TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(height: 20),
                        const Text("⭐ Favorites", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        if (favoriteTopics.isEmpty)
                          const Text(
                            'Your most used topics will appear here as you chat.',
                            style: TextStyle(color: Colors.grey),
                          )
                        else
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: favoriteTopics
                                .map((item) => GestureDetector(
                                      onTap: () => openChat(item),
                                      child: _chip(item, Colors.amber),
                                    ))
                                .toList(),
                          ),
                        const SizedBox(height: 20),
                        const Text("🕒 Recent", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        if (recentChats.isEmpty)
                          const Text(
                            'No recent activity. Start your first session below!',
                            style: TextStyle(color: Colors.grey),
                          )
                        else
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: recentChats.length,
                              itemBuilder: (ctx, i) {
                                final chat = recentChats[i];
                                final topic = chat['topic']?.toString() ?? 'general';
                                return GestureDetector(
                                  onTap: () => openChat(topic),
                                  child: Container(
                                    width: 140,
                                    margin: const EdgeInsets.only(right: 12),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade50,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: Colors.grey.shade200),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(topic, style: const TextStyle(fontWeight: FontWeight.bold)),
                                        const Spacer(),
                                        Text(chat['date'] ?? '', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        const SizedBox(height: 30),
                        const Text("🛠️ CBT Tools", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 15),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 14,
                            mainAxisSpacing: 14,
                            childAspectRatio: 1.1,
                          ),
                          itemCount: toolkit.length,
                          itemBuilder: (ctx, i) {
                            final tool = toolkit[i];
                            return GestureDetector(
                              onTap: () => openChat(tool['title']),
                              child: _topicCard(tool['title'], tool['icon'], tool['color']),
                            );
                          },
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
            if (redirecting)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.18),
                  child: const Center(
                    child: SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(strokeWidth: 2.4),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _chip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w500)),
    );
  }

  Widget _topicCard(String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            backgroundColor: color.withOpacity(0.15),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 6),
          const Text(
            "Tap to start CBT session",
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
