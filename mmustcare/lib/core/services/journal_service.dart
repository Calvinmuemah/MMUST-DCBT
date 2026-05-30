import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/api_constants.dart';
import 'api_error_utils.dart';

class JournalService {
  static Future<Map<String, String>> _authHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final headers = <String, String>{
      'Content-Type': 'application/json',
    };

    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  static Future<Map<String, dynamic>> getDashboard({
    String filter = 'weekly',
  }) async {
    try {
      final headers = await _authHeaders();
      final uri = Uri.parse('${ApiConstants.baseUrl}/journal/dashboard?filter=$filter');
      final response = await http.get(uri, headers: headers);
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': response.statusCode,
          'success': response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        'statusCode': response.statusCode,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'message': response.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load journal data right now. Check your connection and try again.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> getHistory({
    String filter = 'weekly',
  }) async {
    try {
      final headers = await _authHeaders();
      final uri = Uri.parse('${ApiConstants.baseUrl}/journal/history?filter=$filter');
      final response = await http.get(uri, headers: headers);
      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': response.statusCode,
          'success': response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        'statusCode': response.statusCode,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'message': response.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load journal history right now. Try again later.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> saveEntry({
    required String content,
    required String mood,
    String? title,
  }) async {
    try {
      final headers = await _authHeaders();
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/journal'),
        headers: headers,
        body: jsonEncode({
          'content': content,
          'mood': mood,
          if (title != null && title.trim().isNotEmpty) 'title': title.trim(),
        }),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': response.statusCode,
          'success': response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        'statusCode': response.statusCode,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'message': response.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to save your journal entry right now. Check your connection and try again.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> deleteEntry({
    required String entryId,
  }) async {
    try {
      final headers = await _authHeaders();
      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}/journal/$entryId'),
        headers: headers,
      );

      final decoded = response.body.isNotEmpty ? jsonDecode(response.body) : {};

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': response.statusCode,
          'success': response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        'statusCode': response.statusCode,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'message': response.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to delete this journal entry right now. Try again later.',
        ),
      };
    }
  }
}
