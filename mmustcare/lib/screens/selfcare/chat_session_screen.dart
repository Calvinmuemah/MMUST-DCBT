import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import '../../core/services/api_error_utils.dart';
import 'chat_service.dart';

class ChatSessionScreen extends StatefulWidget {
  final String sessionId;
  final String token;
  final String? initialMessage;

  const ChatSessionScreen({
    super.key,
    required this.sessionId,
    required this.token,
    this.initialMessage,
  });

  @override
  State<ChatSessionScreen> createState() => _ChatSessionScreenState();
}

class _ChatSessionScreenState extends State<ChatSessionScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController controller = TextEditingController();
  final ScrollController scrollController = ScrollController();

  late stt.SpeechToText speech;
  final FlutterTts tts = FlutterTts();

  List<Map<String, dynamic>> messages = [];

  bool sending = false;
  bool listening = false;
  bool aiTyping = false;
  bool hasTypedText = false;
  bool voiceChatActive = false;
  bool aiSpeaking = false;
  Timer? _voiceSilenceTimer;
  late final AnimationController _voicePulseController;

  /// MODE CONTROL
  /// mic = speech->text only
  /// audio = speech->text + voice response
  String voiceMode = "mic";

  @override
  void initState() {
    super.initState();
    speech = stt.SpeechToText();
    controller.addListener(_handleComposerChanged);
    _voicePulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
    initTts();
    loadHistory();
  }

  @override
  void dispose() {
    _voiceSilenceTimer?.cancel();
    _voicePulseController.dispose();
    controller.removeListener(_handleComposerChanged);
    controller.dispose();
    scrollController.dispose();
    speech.stop();
    tts.stop();
    super.dispose();
  }

  void _handleComposerChanged() {
    final nextHasText = controller.text.trim().isNotEmpty;

    if (nextHasText == hasTypedText) {
      return;
    }

    setState(() {
      hasTypedText = nextHasText;
    });
  }

  // =========================
  // TTS INIT
  // =========================
  Future<void> initTts() async {
    await tts.awaitSpeakCompletion(true);
    await tts.setSpeechRate(0.45);
    await tts.setPitch(1.0);
    await tts.setVolume(1.0);
  }

  Future<void> speak(String text, String language) async {
    try {
      final lang = language.toLowerCase();

      if (lang.contains("sw")) {
        await tts.setLanguage("sw-KE");
      } else {
        await tts.setLanguage("en-US");
      }

      await tts.speak(text);
    } catch (e) {
      debugPrint("TTS ERROR: $e");
    }
  }

  // =========================
  // SPEECH TO TEXT
  // =========================
  Future<void> startListening() async {
    if (aiSpeaking) return;

    final available = await speech.initialize();
    if (!available) return;

    _voiceSilenceTimer?.cancel();

    setState(() => listening = true);

    speech.listen(
      onResult: (result) {
        setState(() {
          controller.text = result.recognizedWords;
        });

        _voiceSilenceTimer?.cancel();
        if (voiceChatActive && !aiSpeaking && result.recognizedWords.trim().isNotEmpty) {
          _voiceSilenceTimer = Timer(const Duration(seconds: 2), () async {
            if (!mounted || !listening) return;

            final text = controller.text.trim();
            if (text.isEmpty) return;

            if (voiceMode == 'audio') {
              stopListening();
            }
            await sendMessage();
          });
        }
      },
    );
  }

  void stopListening() {
    _voiceSilenceTimer?.cancel();
    speech.stop();
    setState(() => listening = false);
  }

  void _resetOneShotVoiceInput() {
    _voiceSilenceTimer?.cancel();

    if (listening) {
      speech.stop();
    }

    if (!mounted) {
      return;
    }

    setState(() {
      voiceChatActive = false;
      aiSpeaking = false;
      listening = false;
      voiceMode = 'mic';
      hasTypedText = controller.text.trim().isNotEmpty;
    });
  }

  Future<void> _startVoiceChat() async {
    setState(() {
      voiceChatActive = true;
      voiceMode = 'audio';
    });

    await startListening();
  }

  void _cancelVoiceInput() {
    _voiceSilenceTimer?.cancel();
    controller.clear();
    setState(() {
      voiceChatActive = false;
      aiSpeaking = false;
      listening = false;
      hasTypedText = false;
      voiceMode = 'mic';
    });
    stopListening();
  }

  void _startVoiceNote() {
    setState(() {
      voiceChatActive = true;
      voiceMode = 'mic';
    });

    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }

  // =========================
  // SCROLL FIX
  // =========================
  void scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (scrollController.hasClients) {
        scrollController.animateTo(
          scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  // =========================
  // HISTORY
  // =========================
  Future<void> loadHistory() async {
    try {
      final data = await ChatService.getMessages(
        widget.sessionId,
        widget.token,
      );

      setState(() {
        messages = List<Map<String, dynamic>>.from(data);
      });

      scrollToBottom();
    } catch (e) {
      if (!mounted) return;

      setState(() {
        messages = widget.initialMessage == null
            ? []
            : [
                {
                  "sender": "ai",
                  "message": widget.initialMessage,
                  "language": "english",
                }
              ];
      });

      scrollToBottom();
    }
  }

  // =========================
  // SEND MESSAGE
  // =========================
  Future<void> sendMessage() async {
    final text = controller.text.trim();
    if (text.isEmpty || sending) return;

    controller.clear();

    setState(() {
      sending = true;
      aiTyping = true;

      messages.add({
        "sender": "user",
        "message": text,
      });
    });

    scrollToBottom();

    try {
      final res = await ChatService.sendMessage(
        widget.sessionId,
        text,
        widget.token,
      );

      final reply = res["response"] ?? "I'm here with you.";
      final language = res["language"] ?? "english";

      setState(() {
        aiTyping = false;
        sending = false;

        messages.add({
          "sender": "ai",
          "message": reply,
          "language": language,
        });
      });

      scrollToBottom();

      /// ONLY SPEAK IN AUDIO MODE
      if (voiceMode == "audio") {
        if (listening) {
          stopListening();
        }

        if (mounted) {
          setState(() {
            aiSpeaking = true;
          });
        }

        await speak(reply, language);

        if (mounted) {
          setState(() {
            aiSpeaking = false;
          });
        }
      }

      if (voiceChatActive && mounted && voiceMode == 'audio') {
        await Future.delayed(Duration(milliseconds: voiceMode == 'audio' ? 300 : 150));
        if (mounted && voiceChatActive) {
          await startListening();
        }
      }
    } catch (e) {
      setState(() {
        aiTyping = false;
        sending = false;

        messages.add({
          "sender": "ai",
          "message": friendlyApiErrorMessage(
            e,
            fallback: "Unable to send your message right now. Check your connection and try again.",
          ),
          "language": "english",
        });
      });

      if (voiceChatActive && voiceMode == 'mic') {
        _resetOneShotVoiceInput();
      }
    }
  }

  // =========================
  // TYPING INDICATOR
  // =========================
  Widget typingIndicator() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 14,
            backgroundColor: Color(0xff7B61FF),
            child: Icon(Icons.psychology, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text("Typing..."),
          ),
        ],
      ),
    );
  }

  // =========================
  // CHAT BUBBLE
  // =========================
  Widget bubble(Map<String, dynamic> msg) {
    final isUser = msg["sender"] == "user";

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(14),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: isUser ? Colors.indigo : Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              msg["message"] ?? "",
              style: TextStyle(
                color: isUser ? Colors.white : Colors.black87,
                height: 1.4,
              ),
            ),
            if (!isUser)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(
                  msg["language"] ?? "",
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.grey,
                  ),
                ),
              )
          ],
        ),
      ),
    );
  }

  // =========================
  // MODE SWITCH BUTTONS
  // =========================
  Widget modeButtons() {
    return const SizedBox.shrink();
  }

  Widget _voiceListeningBanner() {
    if (!voiceChatActive) {
      return const SizedBox.shrink();
    }

    if (aiSpeaking) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
        child: Container(
          width: double.infinity,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.08),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.blue.withOpacity(0.15)),
          ),
          child: Center(
            child: AnimatedBuilder(
              animation: _voicePulseController,
              builder: (context, child) {
                return Transform.scale(
                  scale: 0.95 + (_voicePulseController.value * 0.3),
                  child: child,
                );
              },
              child: Container(
                width: 18,
                height: 18,
                decoration: const BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.blue.withOpacity(0.08),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.blue.withOpacity(0.15)),
        ),
        child: Row(
          children: [
            if (listening)
              AnimatedBuilder(
                animation: _voicePulseController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 0.9 + (_voicePulseController.value * 0.25),
                    child: child,
                  );
                },
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: const BoxDecoration(
                    color: Colors.blue,
                    shape: BoxShape.circle,
                  ),
                ),
              )
            else
              Container(
                width: 12,
                height: 12,
                decoration: const BoxDecoration(
                  color: Colors.blueGrey,
                  shape: BoxShape.circle,
                ),
              ),
            const SizedBox(width: 10),
            const Expanded(
              child: Text(
                'Listening...',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffF5F7FB),

      appBar: AppBar(
        title: const Text("MMUSTCare CBT"),
        centerTitle: true,
      ),

      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) =>
                  bubble(messages[index]),
            ),
          ),

          if (aiTyping) typingIndicator(),

          _voiceListeningBanner(),

          Container(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
            color: Colors.white,
            child: TextField(
              controller: controller,
              minLines: 1,
              maxLines: 5,
              textInputAction: TextInputAction.send,
              onSubmitted: !listening && hasTypedText && !sending ? (_) => sendMessage() : null,
              decoration: InputDecoration(
                hintText: "Talk to MMUSTCare...",
                filled: true,
                fillColor: Colors.grey.shade200,
                contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide.none,
                ),
                suffixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
                suffixIcon: Padding(
                  padding: const EdgeInsets.only(right: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (voiceChatActive) ...[
                        _ComposerActionButton(
                          tooltip: 'Stop voice input',
                          icon: Icons.close,
                          backgroundColor: Colors.white,
                          iconColor: Colors.black87,
                          onTap: _cancelVoiceInput,
                        ),
                      ] else if (!hasTypedText && !sending) ...[
                        _ComposerActionButton(
                          tooltip: 'Voice input, text reply',
                          icon: listening ? Icons.mic_off : Icons.mic,
                          backgroundColor: listening ? Colors.red.withOpacity(0.14) : Colors.white,
                          iconColor: listening ? Colors.red : Colors.black87,
                          onTap: _startVoiceNote,
                        ),
                        const SizedBox(width: 8),
                        _ComposerActionButton(
                          tooltip: 'Voice chat',
                          icon: Icons.graphic_eq,
                          backgroundColor: voiceChatActive ? Colors.blue.withOpacity(0.14) : Colors.white,
                          iconColor: Colors.black87,
                          onTap: _startVoiceChat,
                        ),
                      ] else ...[
                        _ComposerActionButton(
                          tooltip: 'Send message',
                          icon: Icons.arrow_upward,
                          backgroundColor: Colors.black87,
                          iconColor: Colors.white,
                          onTap: sending ? null : sendMessage,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  }

class _ComposerActionButton extends StatelessWidget {
  const _ComposerActionButton({
    required this.icon,
    required this.backgroundColor,
    required this.iconColor,
    required this.onTap,
    this.tooltip,
  });

  final IconData icon;
  final Color backgroundColor;
  final Color iconColor;
  final VoidCallback? onTap;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final button = Material(
      color: backgroundColor,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(11),
          child: Icon(icon, size: 20, color: iconColor),
        ),
      ),
    );

    if (tooltip == null) {
      return button;
    }

    return Tooltip(message: tooltip!, child: button);
  }
}