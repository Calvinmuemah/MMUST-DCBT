import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/services/api_error_utils.dart';
import '../../core/services/journal_service.dart';
import '../../core/theme/app_colors.dart';
import '../selfcare/chat_session_screen.dart';

class JournalScreen extends StatefulWidget {
  const JournalScreen({super.key});

  @override
  State<JournalScreen> createState() => _JournalScreenState();
}

class _JournalScreenState extends State<JournalScreen> {
  final TextEditingController journalController = TextEditingController();

  String selectedMood = 'Calm';
  String reportFilter = 'weekly';
  String historyTab = 'feelings';
  bool loading = true;
  bool saving = false;
  String? errorMessage;
  String? token;

  Map<String, dynamic> dashboard = {};

  final List<Map<String, dynamic>> moods = [
    {'title': 'Happy', 'emoji': '😊', 'color': Colors.orange},
    {'title': 'Calm', 'emoji': '😌', 'color': Colors.teal},
    {'title': 'Sad', 'emoji': '😔', 'color': Colors.indigo},
    {'title': 'Anxious', 'emoji': '😟', 'color': Colors.deepPurple},
    {'title': 'Tired', 'emoji': '😴', 'color': Colors.blueGrey},
  ];

  @override
  void initState() {
    super.initState();
    _loadToken();
    _loadDashboard();
  }

  @override
  void dispose() {
    journalController.dispose();
    super.dispose();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    if (!mounted) {
      return;
    }

    setState(() {
      token = prefs.getString('token');
    });
  }

  List<Map<String, dynamic>> get _journalEntries {
    final entries = dashboard['journalEntries'];
    if (entries is List) {
      return entries.cast<Map<String, dynamic>>();
    }
    return const [];
  }

  List<Map<String, dynamic>> get _chatHistory {
    final chats = dashboard['chatHistory'];
    if (chats is List) {
      return chats.cast<Map<String, dynamic>>();
    }
    return const [];
  }

  Map<String, dynamic> get _reports {
    final reports = dashboard['reports'];
    if (reports is Map<String, dynamic>) {
      return reports;
    }
    return const {};
  }

  Map<String, dynamic> get _profile {
    final profile = dashboard['profile'];
    if (profile is Map<String, dynamic>) {
      return profile;
    }
    return const {};
  }

  List<Map<String, dynamic>> get _timeline {
    final timeline = _reports['timeline'];
    if (timeline is List) {
      return timeline.cast<Map<String, dynamic>>();
    }
    return const [];
  }

  List<Map<String, dynamic>> get _moodBreakdown {
    final moodBreakdown = _reports['moodBreakdown'];
    if (moodBreakdown is List) {
      return moodBreakdown.cast<Map<String, dynamic>>();
    }
    return const [];
  }

  Map<String, dynamic> get _attendance {
    final attendance = _reports['attendance'];
    if (attendance is Map<String, dynamic>) {
      return attendance;
    }
    return const {};
  }

  Map<String, dynamic>? get _dailyAssessment {
    final assessment = _profile['dailyAssessment'];
    if (assessment is Map<String, dynamic>) {
      return assessment;
    }
    return null;
  }

  Map<String, dynamic>? get _latestEntry {
    final latest = _reports['latestEntry'];
    if (latest is Map<String, dynamic>) {
      return latest;
    }
    return null;
  }

  Future<void> _loadDashboard() async {
    setState(() {
      loading = true;
      errorMessage = null;
    });

    try {
      final result = await JournalService.getDashboard(filter: reportFilter);

      if (!mounted) {
        return;
      }

      if (result['success'] == true) {
        setState(() {
          dashboard = result['data'] is Map<String, dynamic>
              ? result['data'] as Map<String, dynamic>
              : {};
          loading = false;
        });
        return;
      }

      setState(() {
        loading = false;
        errorMessage = result['message']?.toString() ?? 'Failed to load journal data';
      });
    } catch (e) {
      if (!mounted) {
        return;
      }

      setState(() {
        loading = false;
        errorMessage = friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load journal data right now. Check your connection and try again.',
        );
      });
    }
  }

  Future<void> saveEntry() async {
    final text = journalController.text.trim();

    if (text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Write something before saving')),
      );
      return;
    }

    setState(() {
      saving = true;
    });

    try {
      final result = await JournalService.saveEntry(
        content: text,
        mood: selectedMood,
      );

      if (!mounted) {
        return;
      }

      setState(() {
        saving = false;
      });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              result['message']?.toString() ??
                  (result['success'] == true
                      ? 'Journal saved successfully'
                      : 'Could not save journal entry'),
            ),
            backgroundColor: result['success'] == true ? Colors.green : Colors.red,
          ),
        );

      if (result['success'] == true) {
        journalController.clear();
        await _loadDashboard();
      }
    } catch (e) {
      if (!mounted) {
        return;
      }

      setState(() {
        saving = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            friendlyApiErrorMessage(
              e,
              fallback: 'Unable to save your journal entry right now. Try again later.',
            ),
          ),
        ),
      );
    }
  }

  Future<void> _deleteJournalEntry(Map<String, dynamic> entry) async {
    final entryId = entry['id']?.toString();

    if (entryId == null || entryId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Unable to delete this journal entry')),
      );
      return;
    }

    final confirm = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Delete journal entry'),
        content: const Text('This will permanently remove the journal entry. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm != true) {
      return;
    }

    final result = await JournalService.deleteEntry(entryId: entryId);

    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          result['message']?.toString() ??
              (result['success'] == true ? 'Journal deleted' : 'Could not delete journal entry'),
        ),
        backgroundColor: result['success'] == true ? Colors.green : Colors.red,
      ),
    );

    if (result['success'] == true) {
      await _loadDashboard();
    }
  }

  List<FlSpot> _timelineSpots() {
    return _timeline.asMap().entries.map((entry) {
      final value = entry.value['value'];
      return FlSpot(
        (entry.key + 1).toDouble(),
        value is num ? value.toDouble() : 0,
      );
    }).toList();
  }

  double _maxTimelineValue() {
    if (_timeline.isEmpty) {
      return 5;
    }

    final values = _timeline
        .map((item) => item['value'])
        .whereType<num>()
        .map((value) => value.toDouble())
        .toList();

    if (values.isEmpty) {
      return 5;
    }

    return values.reduce((a, b) => a > b ? a : b).clamp(5, 1000).toDouble();
  }

  Map<String, dynamic> _moodInfo(String mood) {
    return moods.firstWhere(
      (item) => item['title'] == mood,
      orElse: () => moods.first,
    );
  }

  String _formatDate(dynamic value) {
    if (value == null) {
      return '-';
    }

    final parsed = DateTime.tryParse(value.toString());
    if (parsed == null) {
      return value.toString();
    }

    return DateFormat('MMM d, yyyy • hh:mm a').format(parsed.toLocal());
  }

  String _labelForFilter(String filter) {
    switch (filter) {
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'Weekly';
    }
  }

  @override
  Widget build(BuildContext context) {
    final attendance = _attendance;
    final latestEntry = _latestEntry;
    final dailyAssessment = _dailyAssessment;
    final progressSpots = _timelineSpots();

    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        title: const Text(
          'Journal',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            onPressed: () => Navigator.pushNamed(context, '/reflections'),
            icon: const Icon(Icons.history_edu),
            tooltip: 'Reflections',
          ),
          IconButton(
            onPressed: _loadDashboard,
            icon: loading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh),
          ),
        ],
      ),
      body: SafeArea(
        child: loading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadDashboard,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(22),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.primary, AppColors.secondary],
                          ),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Daily Reflection',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              'Track thoughts, emotions, attendance, and chat history from one place.',
                              style: TextStyle(color: Colors.white70),
                            ),
                            if (errorMessage != null) ...[
                              const SizedBox(height: 12),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white.withOpacity(0.18)),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Icon(
                                      Icons.wifi_off_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        errorMessage!,
                                        style: const TextStyle(color: Colors.white, height: 1.4),
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: _loadDashboard,
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                      ),
                                      child: const Text('Retry'),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      _buildOnboardingCard(dailyAssessment),
                      const SizedBox(height: 20),
                      _buildReportsSection(progressSpots, attendance, latestEntry),
                      const SizedBox(height: 20),
                      _buildMoodSelector(),
                      const SizedBox(height: 20),
                      _buildJournalInput(),
                      const SizedBox(height: 24),
                      _buildHistorySection(),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildOnboardingCard(Map<String, dynamic>? dailyAssessment) {
    final onboardingCompleted = _profile['onboardingCompleted'] == true;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Onboarding Snapshot',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _statChip(
                label: 'Onboarding',
                value: onboardingCompleted ? 'Completed' : 'Pending',
                color: onboardingCompleted ? Colors.green : Colors.orange,
              ),
              _statChip(
                label: 'Risk level',
                value: (_profile['onboardingRiskLevel'] ?? 'Unknown').toString(),
                color: AppColors.primary,
              ),
              _statChip(
                label: 'Score',
                value: (_profile['onboardingTotalScore'] ?? '-').toString(),
                color: Colors.teal,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Daily onboarding',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                if (dailyAssessment != null) ...[
                  Text('Stress: ${dailyAssessment['stressLevel'] ?? '-'}'),
                  Text('Challenge: ${dailyAssessment['mainChallenge'] ?? '-'}'),
                  Text('Overwhelm: ${dailyAssessment['overwhelmFrequency'] ?? '-'}'),
                  Text('Risk: ${dailyAssessment['riskLevel'] ?? '-'}'),
                  Text('Taken: ${_formatDate(dailyAssessment['createdAt'] ?? dailyAssessment['assessmentDate'])}'),
                ] else
                  const Text('No daily onboarding has been recorded yet.'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportsSection(
    List<FlSpot> spots,
    Map<String, dynamic> attendance,
    Map<String, dynamic>? latestEntry,
  ) {
    final maxY = _maxTimelineValue();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Reports & Attendance',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Row(
          children: ['weekly', 'monthly', 'yearly'].map((type) {
            final selected = reportFilter == type;

            return Expanded(
              child: GestureDetector(
                onTap: () async {
                  setState(() {
                    reportFilter = type;
                  });
                  await _loadDashboard();
                },
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: selected ? AppColors.primary : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Text(
                    type.toUpperCase(),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: selected ? Colors.white : Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),
        Container(
          height: 210,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${_labelForFilter(reportFilter)} activity',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: spots.isEmpty
                    ? const Center(child: Text('No activity yet'))
                    : LineChart(
                        LineChartData(
                          minY: 0,
                          maxY: maxY + 1,
                          gridData: const FlGridData(show: false),
                          titlesData: const FlTitlesData(show: false),
                          borderData: FlBorderData(show: false),
                          lineBarsData: [
                            LineChartBarData(
                              spots: spots,
                              isCurved: true,
                              barWidth: 3,
                              color: AppColors.primary,
                              dotData: const FlDotData(show: false),
                            ),
                          ],
                        ),
                      ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Text(
          _moodBreakdown.isNotEmpty
              ? 'Mood trend: ${_moodBreakdown.map((item) => '${item['mood'] ?? 'Unknown'} (${item['count'] ?? 0})').join(' • ')}'
              : 'Start journaling to generate mood insights.',
          style: const TextStyle(fontSize: 13),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _statChip(
              label: 'Logins',
              value: attendance['loginCount']?.toString() ?? '0',
              color: Colors.indigo,
            ),
            _statChip(
              label: 'Chats',
              value: attendance['chatCount']?.toString() ?? '0',
              color: Colors.blue,
            ),
            _statChip(
              label: 'Journal entries',
              value: attendance['journalCount']?.toString() ?? '0',
              color: Colors.teal,
            ),
            _statChip(
              label: 'Active days',
              value: attendance['activeDays']?.toString() ?? '0',
              color: Colors.orange,
            ),
            _statChip(
              label: 'Total activity',
              value: _reports['attendance'] is Map<String, dynamic>
                  ? ((_reports['attendance']['totalActivity'] ?? 0).toString())
                  : '0',
              color: AppColors.primary,
            ),
          ],
        ),
        if (latestEntry != null) ...[
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Latest reflection', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(latestEntry['title']?.toString() ?? 'Reflection'),
                Text(_formatDate(latestEntry['createdAt'])),
                const SizedBox(height: 6),
                Text(
                  latestEntry['content']?.toString() ?? '',
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildMoodSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'How are you feeling?',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 82,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: moods.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final mood = moods[index];
              final selected = selectedMood == mood['title'];

              return GestureDetector(
                onTap: () {
                  setState(() {
                    selectedMood = mood['title'];
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 78,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: selected ? (mood['color'] as Color).withOpacity(.15) : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: selected ? mood['color'] as Color : Colors.grey.shade200,
                      width: 1.4,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(mood['emoji'], style: const TextStyle(fontSize: 26)),
                      const SizedBox(height: 6),
                      Text(
                        mood['title'],
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: selected ? mood['color'] as Color : Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildJournalInput() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Write your thoughts',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: journalController,
            minLines: 8,
            maxLines: 12,
            decoration: InputDecoration(
              hintText: 'What happened today? What is on your mind?',
              filled: true,
              fillColor: Colors.grey.shade50,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton.icon(
              onPressed: saving ? null : saveEntry,
              icon: saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : const Icon(Icons.bookmark, color: Colors.white),
              label: Text(saving ? 'Saving...' : 'Save Journal'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistorySection() {
    final feelings = _journalEntries;
    final chats = _chatHistory;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'History',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              historyTab == 'feelings'
                  ? '${feelings.length} saved'
                  : '${chats.length} sessions',
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _tabButton('feelings', 'Feelings & Thoughts'),
            const SizedBox(width: 10),
            _tabButton('chats', 'Chat History'),
          ],
        ),
        const SizedBox(height: 16),
        if (historyTab == 'feelings')
          _buildFeelingsHistory(feelings)
        else
          _buildChatHistory(chats),
      ],
    );
  }

  Widget _buildFeelingsHistory(List<Map<String, dynamic>> entries) {
    if (entries.isEmpty) {
      return const Text('No journal entries yet');
    }

    return Column(
      children: entries.map((entry) {
        final mood = _moodInfo(entry['mood']?.toString() ?? 'Calm');
        final rawTitle = entry['title']?.toString().trim() ?? '';
        final fallbackTitle = entry['content']?.toString().split('.').first.split(' ').take(4).join(' ');
        final title = rawTitle.isNotEmpty ? rawTitle : fallbackTitle;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      (title != null && title.isNotEmpty) ? title : 'Reflection',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    Text(_formatDate(entry['createdAt'])),
                    Text('${mood['emoji']} ${mood['title']}'),
                    const SizedBox(height: 6),
                    Text(
                      entry['content']?.toString() ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Delete entry',
                onPressed: () => _deleteJournalEntry(entry),
                icon: const Icon(Icons.delete_outline, color: Colors.red),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildChatHistory(List<Map<String, dynamic>> chats) {
    if (chats.isEmpty) {
      return const Text('No chat history yet');
    }

    return Column(
      children: chats.map((session) {
        final sessionId = session['id']?.toString();
        final messages = session['messages'];
        final messageList = messages is List ? messages.cast<Map<String, dynamic>>() : const [];

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () async {
              final authToken = token;

              if (authToken == null || authToken.isEmpty || sessionId == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Unable to open this chat session')),
                );
                return;
              }

              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChatSessionScreen(
                    sessionId: sessionId,
                    token: authToken,
                  ),
                ),
              );
            },
            child: ExpansionTile(
              title: Text(
                session['topic']?.toString() ?? 'Chat session',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(_formatDate(session['createdAt'])),
              children: [
                const SizedBox(height: 6),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: messageList.map((message) {
                      final sender = message['sender']?.toString() ?? 'user';
                      final isAi = sender == 'ai';

                      return Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isAi ? const Color(0xFFF1F5F9) : const Color(0xFFE0F2FE),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isAi ? 'AI' : 'You',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 6),
                            Text(message['message']?.toString() ?? ''),
                            const SizedBox(height: 6),
                            Text(
                              _formatDate(message['createdAt']),
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _tabButton(String value, String label) {
    final selected = historyTab == value;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            historyTab = value;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? AppColors.primary : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? Colors.white : Colors.black,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }

  Widget _statChip({
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(.1),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: color, fontSize: 12)),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
