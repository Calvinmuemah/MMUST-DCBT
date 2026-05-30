import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/api_constants.dart';
import 'api_error_utils.dart';

class ReflectionService {
  static Future<Map<String, String>> _authHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final headers = <String, String>{'Content-Type': 'application/json'};

    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  static Future<Map<String, dynamic>> getReflections({
    int? limit,
    int? offset,
    String? tag,
    String? sessionId,
  }) async {
    try {
      final headers = await _authHeaders();
      final q = <String>[];
      if (limit != null) q.add('limit=$limit');
      if (offset != null) q.add('offset=$offset');
      if (tag != null && tag.trim().isNotEmpty) {
        q.add('tag=${Uri.encodeQueryComponent(tag.trim())}');
      }
      if (sessionId != null && sessionId.trim().isNotEmpty) {
        q.add('sessionId=${Uri.encodeQueryComponent(sessionId.trim())}');
      }
      final uri = Uri.parse('${ApiConstants.baseUrl}/journal/reflections${q.isNotEmpty ? '?${q.join('&')}' : ''}');

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
          fallback: 'Unable to load reflections right now. Check your connection and try again.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> saveReflection({
    required String text,
    int? moodRating,
    List<String>? tags,
    String? sessionId,
  }) async {
    try {
      final headers = await _authHeaders();
      final body = {
        'text': text,
        if (moodRating != null) 'moodRating': moodRating,
        if (tags != null) 'tags': tags,
        if (sessionId != null) 'sessionId': sessionId,
      };

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/journal/reflections'),
        headers: headers,
        body: jsonEncode(body),
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
          fallback: 'Unable to save your reflection right now. Try again later.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> updateReflection({
    required String reflectionId,
    required String text,
    int? moodRating,
    List<String>? tags,
  }) async {
    try {
      final headers = await _authHeaders();
      final body = {
        'text': text,
        if (moodRating != null) 'moodRating': moodRating,
        if (tags != null) 'tags': tags,
      };

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}/journal/reflections/$reflectionId'),
        headers: headers,
        body: jsonEncode(body),
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
          fallback: 'Unable to update your reflection right now. Try again later.',
        ),
      };
    }
  }

  static Future<Map<String, dynamic>> deleteReflection({required String reflectionId}) async {
    try {
      final headers = await _authHeaders();

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}/journal/reflections/$reflectionId'),
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
          fallback: 'Unable to delete your reflection right now. Try again later.',
        ),
      };
    }
  }
}
