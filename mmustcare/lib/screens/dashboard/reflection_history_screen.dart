import 'package:flutter/material.dart';
import '../../core/services/reflection_service.dart';

class ReflectionHistoryScreen extends StatefulWidget {
  const ReflectionHistoryScreen({Key? key}) : super(key: key);

  @override
  _ReflectionHistoryScreenState createState() => _ReflectionHistoryScreenState();
}

class _ReflectionHistoryScreenState extends State<ReflectionHistoryScreen> {
  List<dynamic> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final res = await ReflectionService.getReflections();
    if (res['success'] == true && res['data'] is List) {
      setState(() {
        _items = res['data'];
        _loading = false;
      });
    } else {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Failed to load reflections')));
    }
  }

  Future<void> _addReflection() async {
    final controller = TextEditingController();
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New reflection'),
        content: TextField(
          controller: controller,
          minLines: 3,
          maxLines: 6,
          decoration: const InputDecoration(hintText: 'Write your thoughts...'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Save')),
        ],
      ),
    );

    if (result == true) {
      final text = controller.text.trim();
      if (text.isEmpty) return;
      final save = await ReflectionService.saveReflection(text: text);
      if (save['success'] == true) {
        await _load();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(save['message'] ?? 'Failed to save')));
      }
    }
  }

  Future<void> _editReflection(Map<String, dynamic> item) async {
    final controller = TextEditingController(text: item['text'] ?? '');
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit reflection'),
        content: TextField(
          controller: controller,
          minLines: 3,
          maxLines: 6,
          decoration: const InputDecoration(hintText: 'Edit your thoughts...'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Save')),
        ],
      ),
    );

    if (result == true) {
      final text = controller.text.trim();
      if (text.isEmpty) return;
      final res = await ReflectionService.updateReflection(reflectionId: item['id'], text: text);
      if (res['success'] == true) {
        await _load();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Failed to update')));
      }
    }
  }

  Future<void> _deleteReflection(Map<String, dynamic> item) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete reflection'),
        content: const Text('Are you sure you want to delete this reflection?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancel')),
          ElevatedButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Delete')),
        ],
      ),
    );

    if (ok == true) {
      final res = await ReflectionService.deleteReflection(reflectionId: item['id']);
      if (res['success'] == true) {
        await _load();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Failed to delete')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reflections')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _items.isEmpty
              ? const Center(child: Text('No reflections yet'))
                : ListView.builder(
                  itemCount: _items.length,
                  itemBuilder: (context, idx) {
                    final item = _items[idx];
                    return Dismissible(
                      key: Key(item['id'] ?? idx.toString()),
                      background: Container(color: Colors.red, alignment: Alignment.centerLeft, padding: const EdgeInsets.only(left: 20), child: const Icon(Icons.delete, color: Colors.white)),
                      secondaryBackground: Container(color: Colors.blue, alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), child: const Icon(Icons.edit, color: Colors.white)),
                      confirmDismiss: (direction) async {
                        if (direction == DismissDirection.startToEnd) {
                          await _deleteReflection(item);
                          return true;
                        } else {
                          await _editReflection(item);
                          return false;
                        }
                      },
                      child: ListTile(
                        title: Text(item['text'] ?? ''),
                        subtitle: Text(item['createdAt'] ?? ''),
                        onTap: () => _editReflection(item),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addReflection,
        child: const Icon(Icons.add),
      ),
    );
  }
}
