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
  String? token;

  bool loading = true;
  bool redirecting = false;
  Map<String, int> topicUsage = {};
  List<Map<String, dynamic>> recentChats = [];

  static const String _topicUsageKey = 'selfcare_topic_usage_v1';
  static const String _recentChatsKey = 'selfcare_recent_chats_v1';

  final List<Map<String, dynamic>> topics = [
    {"title": "Low Mood", "icon": Icons.mood_bad, "color": Colors.blue},
    {"title": "Worry & Anxiety", "icon": Icons.psychology, "color": Colors.orange},
    {"title": "Sleep", "icon": Icons.nightlight_round, "color": Colors.indigo},
    {"title": "Relationships", "icon": Icons.people, "color": Colors.pink},
    {"title": "Confidence", "icon": Icons.emoji_events, "color": Colors.green},
    {"title": "Study Stress", "icon": Icons.school, "color": Colors.redAccent},
    {"title": "Think–Act–Feel", "icon": Icons.sync_alt, "color": Colors.deepPurple},
    {"title": "Pain & Emotions", "icon": Icons.healing, "color": Colors.teal},
    {"title": "Psychoeducation", "icon": Icons.menu_book, "color": Colors.brown},
    {"title": "Finances & Stress", "icon": Icons.attach_money, "color": Colors.greenAccent},
  ];

  @override
  void initState() {
    super.initState();
    loadState();
  }

  Future<void> loadState() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      token = prefs.getString('token');
      topicUsage = _decodeUsage(prefs.getString(_topicUsageKey));
      recentChats = _decodeRecentChats(prefs.getString(_recentChatsKey));
      loading = false;
    });
  }

  Map<String, int> _decodeUsage(String? raw) {
    if (raw == null || raw.isEmpty) return {};

    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return decoded.map((key, value) => MapEntry(key, (value as num).toInt()));
    } catch (_) {
      return {};
    }
  }

  List<Map<String, dynamic>> _decodeRecentChats(String? raw) {
    if (raw == null || raw.isEmpty) return [];

    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded
          .map((item) => Map<String, dynamic>.from(item as Map))
          .where((item) => item['sessionId'] != null)
          .map(
            (item) => {
              'sessionId': item['sessionId'].toString(),
              'title': (item['title'] ?? item['topic'] ?? 'Recent chat').toString(),
              'topic': (item['topic'] ?? 'general').toString(),
              'updatedAt': item['updatedAt']?.toString(),
            },
          )
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> _saveUsage() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_topicUsageKey, jsonEncode(topicUsage));
  }

  Future<void> _saveRecentChats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_recentChatsKey, jsonEncode(recentChats));
  }

  List<String> get favoriteTopics {
    final entries = topicUsage.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    return entries.take(3).map((entry) => entry.key).toList();
  }

  void _recordTopicUse(String title) {
    setState(() {
      topicUsage[title] = (topicUsage[title] ?? 0) + 1;
    });
    _saveUsage();
  }

  void _recordRecentChat({
    required String sessionId,
    required String title,
    required String topic,
  }) {
    setState(() {
      recentChats.removeWhere((item) => item['sessionId']?.toString() == sessionId);
      recentChats.insert(0, {
        'sessionId': sessionId,
        'title': title,
        'topic': topic,
        'updatedAt': DateTime.now().toIso8601String(),
      });

      if (recentChats.length > 5) {
        recentChats = recentChats.take(5).toList();
      }
    });

    _saveRecentChats();
  }

  void _setRedirecting(bool value) {
    if (!mounted) return;

    setState(() {
      redirecting = value;
    });
  }

  String mapTopic(String title) {
    switch (title.toLowerCase()) {
      case "low mood":
        return "depression";
      case "worry & anxiety":
        return "anxiety";
      case "sleep":
        return "sleep";
      case "relationships":
        return "relationships";
      case "study stress":
        return "academic stress";
      case "think–act–feel":
        return "overthinking";
      case "pain & emotions":
        return "depression";
      default:
        return "general";
    }
  }

  Future<void> openChat(String title) async {
    if (token == null || token!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please login again to start a chat.")),
      );
      return;
    }

    final topic = mapTopic(title);

    try {
      _setRedirecting(true);

      final res = await ChatService.startSession(topic, token!);

      final sessionId = res["sessionId"];
      final firstMessage = res["message"] ?? "Hello 👋";

      if (sessionId == null) {
        throw Exception("Session ID is null");
      }

      _setRedirecting(false);

      if (!mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChatSessionScreen(
            sessionId: sessionId.toString(),
            token: token!,
            initialMessage: firstMessage,
          ),
        ),
      );

      _recordTopicUse(title);
      _recordRecentChat(
        sessionId: sessionId.toString(),
        title: title,
        topic: topic,
      );
    } catch (e) {
      _setRedirecting(false);
    }
  }

  Future<void> openRecentChat(Map<String, dynamic> chat) async {
    final sessionId = chat['sessionId']?.toString();
    final title = chat['title']?.toString() ?? 'Recent chat';
    final topic = chat['topic']?.toString() ?? 'general';

    if (token == null || token!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login again to open chat history.')),
      );
      return;
    }

    if (sessionId == null || sessionId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This chat could not be opened.')),
      );
      return;
    }

    try {
      _setRedirecting(true);

      await ChatService.getMessages(sessionId, token!);
      _recordTopicUse(title);
      _recordRecentChat(sessionId: sessionId, title: title, topic: topic);

      if (!mounted) return;

      _setRedirecting(false);

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChatSessionScreen(
            sessionId: sessionId,
            token: token!,
          ),
        ),
      );
    } catch (_) {
      if (!mounted) return;

          _setRedirecting(false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            "You seem to be offline. Reconnect to open that chat history.",
          ),
        ),
      );

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChatSessionScreen(
            sessionId: sessionId,
            token: token!,
            initialMessage:
                "You're offline right now. Reconnect to view this chat history.",
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      body: Stack(
        children: [
          loading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
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

            const Text("⭐ Favorites",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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

            const Text("🕒 Recent",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            if (recentChats.isEmpty)
              const Text(
                'Your recent chat sessions will appear here.',
                style: TextStyle(color: Colors.grey),
              )
            else
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: recentChats
                    .map((chat) => GestureDetector(
                          onTap: () => openRecentChat(chat),
                          child: _chip(chat['title']?.toString() ?? 'Recent chat', Colors.blueGrey),
                        ))
                    .toList(),
              ),

            const SizedBox(height: 25),

            const Text("CBT Topics",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),

            const SizedBox(height: 15),

            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: topics.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.1,
              ),
              itemBuilder: (context, index) {
                final topic = topics[index];
                return GestureDetector(
                  onTap: () => openChat(topic["title"].toString()),
                  child: _topicCard(
                    topic["title"],
                    topic["icon"],
                    topic["color"],
                  ),
                );
              },
            ),
                  ],
                ),
              ),
          if (redirecting)
            Positioned.fill(
              child: Container(
                color: Colors.black.withOpacity(0.18),
                child: Center(
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
    );
  }

  Widget _chip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label,
          style: TextStyle(color: color, fontWeight: FontWeight.w500)),
    );
  }

  Widget _topicCard(String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(color: Colors.black12, blurRadius: 10)
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
          Text(title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
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