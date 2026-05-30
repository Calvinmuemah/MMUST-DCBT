import 'dart:async';
import 'dart:io';

String friendlyApiErrorMessage(
  Object error, {
  String fallback = 'Something went wrong. Check your connection and try again.',
}) {
  final message = error.toString().trim();
  final lowerMessage = message.toLowerCase();

  if (error is SocketException ||
      lowerMessage.contains('socketexception') ||
      lowerMessage.contains('connection refused') ||
      lowerMessage.contains('failed host lookup') ||
      lowerMessage.contains('network is unreachable') ||
      lowerMessage.contains('connection closed')) {
    return 'You appear to be offline. Reconnect and try again.';
  }

  if (error is TimeoutException || lowerMessage.contains('timed out') || lowerMessage.contains('timeout')) {
    return 'The request took too long. Please try again.';
  }

  final cleaned = message.replaceFirst(RegExp(r'^Exception:\s*'), '').trim();
  if (cleaned.isNotEmpty && cleaned != message) {
    return cleaned;
  }

  return fallback;
}