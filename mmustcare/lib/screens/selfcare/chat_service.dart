import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../core/services/api_error_utils.dart';

class ChatService {
  static const baseUrl = "https://mmust-dcbt-api.vercel.app/api/v1";

  // START SESSION
  static Future<Map<String, dynamic>> startSession(
      String topic,
      String token,
  ) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/chat/session/start"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({"topic": topic}),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw Exception(data["message"] ?? "Failed to start session");
      }

      return data;
    } catch (e) {
      throw Exception(
        friendlyApiErrorMessage(
          e,
          fallback: "Unable to start the chat right now. Check your connection and try again.",
        ),
      );
    }
  }

  // SEND MESSAGE
  static Future<Map<String, dynamic>> sendMessage(
      String sessionId,
      String message,
      String token,
  ) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/chat"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "sessionId": sessionId,
          "message": message,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw Exception(data["message"] ?? "Failed to send message");
      }

      return data;
    } catch (e) {
      throw Exception(
        friendlyApiErrorMessage(
          e,
          fallback: "Unable to send your message right now. Check your connection and try again.",
        ),
      );
    }
  }

  // GET HISTORY
  static Future<List<dynamic>> getMessages(
      String sessionId,
      String token,
  ) async {
    try {
      final res = await http.get(
        Uri.parse("$baseUrl/chat/$sessionId"),
        headers: {
          "Authorization": "Bearer $token",
        },
      );

      final data = jsonDecode(res.body);

      if (res.statusCode != 200) {
        throw Exception(data["message"] ?? "Failed to load messages");
      }

      return data;
    } catch (e) {
      throw Exception(
        friendlyApiErrorMessage(
          e,
          fallback: "Unable to load your conversation right now. Check your connection and try again.",
        ),
      );
    }
  }
}