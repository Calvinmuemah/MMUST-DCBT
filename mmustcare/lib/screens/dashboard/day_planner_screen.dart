import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/services/local_notification_service.dart';
import '../../core/theme/app_colors.dart';

class DayPlannerScreen extends StatefulWidget {
  const DayPlannerScreen({super.key});

  @override
  State<DayPlannerScreen> createState() => _DayPlannerScreenState();
}

class _DayPlannerScreenState extends State<DayPlannerScreen> {
  static const String _storageKey = 'day_planner_tasks_v1';

  final List<Map<String, dynamic>> tasks = [];

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_storageKey);

    if (raw != null && raw.isNotEmpty) {
      try {
        final decoded = jsonDecode(raw) as List<dynamic>;
        tasks
          ..clear()
          ..addAll(
            decoded.map((e) {
              final item = Map<String, dynamic>.from(e as Map);
              return {
                'id': item['id'] is int
                    ? item['id']
                    : DateTime.now().millisecondsSinceEpoch.remainder(1 << 31),
                'name': (item['name'] ?? item['title'] ?? '').toString(),
                'time': (item['time'] ?? 'Today').toString(),
                'done': item['done'] == true,
              };
            }).toList(),
          );
      } catch (_) {}
    }

    await _syncTaskReminders();

    if (!mounted) return;
    setState(() {});
  }

  Future<void> _saveTasks() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, jsonEncode(tasks));
  }

  int _newTaskId() {
    final seed = DateTime.now().millisecondsSinceEpoch.remainder(1 << 31);
    var candidate = seed;
    final existing = tasks.map((t) => t['id']).toSet();

    while (existing.contains(candidate)) {
      candidate = (candidate + 1).remainder(1 << 31);
    }

    return candidate;
  }

  Future<void> _syncTaskReminders() async {
    for (final task in tasks) {
      final id = task['id'];
      if (id is! int) continue;

      if (task['done'] == true) {
        await LocalNotificationService.cancelTaskReminder(id);
        continue;
      }

      await LocalNotificationService.scheduleDayPlannerReminder(
        taskId: id,
        taskName: (task['name'] ?? task['title'] ?? 'Task').toString(),
        taskTimeLabel: (task['time'] ?? '').toString(),
      );
    }
  }

  // =====================================
  // GREETING
  // =====================================

  String getGreeting() {
    final hour = DateTime.now().hour;

    if (hour < 12) {
      return "Morning";
    } else if (hour < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  }

  // =====================================
  // =====================================
  // ADD TASK (modal)
  // =====================================

  Future<void> _createTask() async {
    final titleController = TextEditingController();
    TimeOfDay? selectedTime;

    final created = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: StatefulBuilder(builder: (context, modalSetState) {
              return SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
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
                    const SizedBox(height: 25),
                    const Text(
                      'Schedule New Task',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'What would you like to achieve today?',
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                    const SizedBox(height: 25),
                    TextField(
                      controller: titleController,
                      autofocus: true,
                      decoration: InputDecoration(
                        hintText: 'e.g. Study Session, Exercise',
                        labelText: 'Task Name',
                        filled: true,
                        fillColor: Colors.grey.shade50,
                        prefixIcon: const Icon(Icons.edit_note_rounded),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(color: Colors.grey.shade200),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Set Time',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(height: 12),
                    InkWell(
                      onTap: () async {
                        final picked = await showTimePicker(
                          context: context,
                          initialTime: TimeOfDay.now(),
                          builder: (context, child) {
                            return Theme(
                              data: Theme.of(context).copyWith(
                                colorScheme: const ColorScheme.light(
                                  primary: AppColors.primary,
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );
                        if (picked != null) {
                          modalSetState(() => selectedTime = picked);
                        }
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: selectedTime != null ? AppColors.primary : Colors.grey.shade200,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.access_time_rounded,
                              color: selectedTime != null ? AppColors.primary : Colors.grey,
                            ),
                            const SizedBox(width: 14),
                            Text(
                              selectedTime != null ? selectedTime!.format(context) : 'Select reminder time',
                              style: TextStyle(
                                fontSize: 16,
                                color: selectedTime != null ? Colors.black : Colors.grey,
                                fontWeight: selectedTime != null ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                            const Spacer(),
                            if (selectedTime != null)
                              const Icon(Icons.check_circle, color: AppColors.primary, size: 20),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: () {
                          final title = titleController.text.trim();
                          if (title.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Enter a task name')));
                            return;
                          }
                          if (selectedTime == null) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a time')));
                            return;
                          }

                          Navigator.pop(context, {
                            'id': DateTime.now().millisecondsSinceEpoch.remainder(1 << 31),
                            'name': title,
                            'time': selectedTime!.format(context),
                            'done': false,
                          });
                        },
                        child: const Text('Add to Schedule', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        );
      },
    );

    titleController.dispose();

    if (created == null || !mounted) return;

    created['id'] = _newTaskId();

    setState(() {
      tasks.insert(0, created);
    });

    await _saveTasks();

    final scheduled = await LocalNotificationService.scheduleDayPlannerReminder(
      taskId: created['id'] as int,
      taskName: created['name'].toString(),
      taskTimeLabel: created['time'].toString(),
    );

    if (!mounted) return;

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    if (!scheduled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Task saved without reminder.'),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Reminder set for 10 minutes before ${created['time']}.'),
          backgroundColor: AppColors.primary,
        ),
      );
    }
  }

  // =====================================
  // TOGGLE TASK
  // =====================================

  Future<void> toggleTask(int index) async {
    final taskId = tasks[index]['id'];

    setState(() {
      tasks[index]["done"] = !(tasks[index]["done"] == true);
    });

    await _saveTasks();

    if (taskId is int) {
      if (tasks[index]['done'] == true) {
        await LocalNotificationService.cancelTaskReminder(taskId);
      } else {
        await LocalNotificationService.scheduleDayPlannerReminder(
          taskId: taskId,
          taskName: (tasks[index]['name'] ?? tasks[index]['title'] ?? 'Task').toString(),
          taskTimeLabel: (tasks[index]['time'] ?? '').toString(),
        );
      }
    }
  }

  // =====================================
  // DELETE TASK
  // =====================================

  Future<void> deleteTask(int index) async {
    final taskId = tasks[index]['id'];

    setState(() {
      tasks.removeAt(index);
    });

    await _saveTasks();

    if (taskId is int) {
      await LocalNotificationService.cancelTaskReminder(taskId);
    }
  }

  // =====================================
  // STATS
  // =====================================

  int get completedTasks =>
      tasks.where((task) => task["done"] == true).length;

  int get pendingTasks =>
      tasks.where((task) => task["done"] != true).length;

  // =====================================
  // UI
  // =====================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,

      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,

        iconTheme: const IconThemeData(
          color: Colors.black,
        ),

        title: const Text(
          "Day Planner",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SafeArea(
        child: Column(
          children: [

            // =========================
            // TOP SECTION
            // =========================

            Container(
              width: double.infinity,
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(22),

              decoration: BoxDecoration(
                gradient: const LinearGradient(
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

                  Text(
                    "Good ${getGreeting()} 👋",
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    "Plan your day calmly",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    "Small organized steps can reduce stress and help you feel more in control.",
                    style: TextStyle(
                      color: Colors.white70,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 22),

                  Row(
                    children: [

                      Expanded(
                        child: _statCard(
                          "$completedTasks",
                          "Completed",
                        ),
                      ),

                      const SizedBox(width: 12),

                      Expanded(
                        child: _statCard(
                          "$pendingTasks",
                          "Pending",
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // =========================
            // ADD TASK
            // =========================

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  const Expanded(child: SizedBox()),
                  GestureDetector(
                    onTap: _createTask,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.add, color: Colors.black),
                          SizedBox(width: 8),
                          Text('Add Task', style: TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // =========================
            // TASK LIST
            // =========================

            Expanded(
              child: tasks.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding:
                          const EdgeInsets.symmetric(
                        horizontal: 20,
                      ),

                      itemCount: tasks.length,

                      itemBuilder: (context, index) {

                        final task = tasks[index];

                        final isDone = task["done"] == true;
                        final name = (task['name'] ?? task['title'] ?? 'Untitled').toString();

                        return Container(
                          key: ValueKey(task['id']),
                          margin:
                              const EdgeInsets.only(
                            bottom: 14,
                          ),

                          padding:
                              const EdgeInsets.all(18),

                          decoration: BoxDecoration(
                            color: Colors.white,

                            borderRadius:
                                BorderRadius.circular(
                              20,
                            ),

                            boxShadow: [
                              BoxShadow(
                                color: Colors.black
                                    .withOpacity(.04),

                                blurRadius: 10,

                                offset:
                                    const Offset(0, 5),
                              )
                            ],
                          ),

                          child: Row(
                            children: [

                              GestureDetector(
                                onTap: () =>
                                    toggleTask(index),

                                child: AnimatedContainer(
                                  duration:
                                      const Duration(
                                    milliseconds: 250,
                                  ),

                                  height: 24,
                                  width: 24,

                                  decoration: BoxDecoration(
                                    color: isDone
                                        ? AppColors.primary
                                        : Colors.white,

                                    borderRadius:
                                        BorderRadius
                                            .circular(8),

                                    border: Border.all(
                                      color: isDone
                                          ? AppColors
                                              .primary
                                          : Colors.grey
                                              .shade400,
                                    ),
                                  ),

                                  child: isDone
                                      ? const Icon(
                                          Icons.check,
                                          size: 16,
                                          color:
                                              Colors.white,
                                        )
                                      : null,
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
                                      name,

                                      style: TextStyle(
                                        fontSize: 15,

                                        fontWeight:
                                            FontWeight.w600,

                                        decoration: isDone
                                            ? TextDecoration
                                                .lineThrough
                                            : null,

                                        color: isDone
                                            ? Colors.grey
                                            : Colors.black,
                                      ),
                                    ),

                                    const SizedBox(
                                      height: 6,
                                    ),

                                    Row(
                                      children: [

                                        Icon(
                                          Icons.access_time,
                                          size: 14,
                                          color: Colors
                                              .grey.shade500,
                                        ),

                                        const SizedBox(
                                          width: 5,
                                        ),

                                        Text(
                                          (task['time'] ?? 'Today').toString(),

                                          style: TextStyle(
                                            color: Colors
                                                .grey.shade600,

                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              IconButton(
                                onPressed: () =>
                                    deleteTask(index),

                                icon: const Icon(
                                  Icons.delete_outline,
                                  color: Colors.redAccent,
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
    );
  }

  // =====================================
  // EMPTY STATE
  // =====================================

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(30),

        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.center,

          children: [

            Container(
              padding: const EdgeInsets.all(22),

              decoration: BoxDecoration(
                color:
                    AppColors.primary.withOpacity(.08),

                shape: BoxShape.circle,
              ),

              child: Icon(
                Icons.calendar_month,
                size: 42,
                color: AppColors.primary,
              ),
            ),

            const SizedBox(height: 18),

            const Text(
              "No tasks yet",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 8),

            const Text(
              "Start by adding a small task for today.",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =====================================
  // STAT CARD
  // =====================================

  Widget _statCard(
    String value,
    String label,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: 16,
      ),

      decoration: BoxDecoration(
        color: Colors.white.withOpacity(.15),

        borderRadius:
            BorderRadius.circular(18),
      ),

      child: Column(
        children: [

          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 4),

          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}