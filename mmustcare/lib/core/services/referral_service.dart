import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/api_constants.dart';
import 'api_error_utils.dart';

class ReferralService {
  Future<Map<String, dynamic>> getMyReferral() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };

      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      final res = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/referrals/me'),
        headers: headers,
      );

      final decoded = jsonDecode(res.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': res.statusCode,
          'success': res.statusCode >= 200 && res.statusCode < 300,
        };
      }

      return {
        'statusCode': res.statusCode,
        'success': res.statusCode >= 200 && res.statusCode < 300,
        'message': res.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load your referral details right now. Check your connection and try again.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> validateCode(String code) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };

      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      final res = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/referrals/validate'),
        headers: headers,
        body: jsonEncode({'code': code}),
      );

      final decoded = jsonDecode(res.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': res.statusCode,
          'success': res.statusCode >= 200 && res.statusCode < 300,
        };
      }

      return {
        'statusCode': res.statusCode,
        'success': res.statusCode >= 200 && res.statusCode < 300,
        'message': res.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to validate the referral code right now. Try again later.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> applyCode(String code) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };

      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }

      final res = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/referrals/apply'),
        headers: headers,
        body: jsonEncode({'code': code}),
      );

      final decoded = jsonDecode(res.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          'statusCode': res.statusCode,
          'success': res.statusCode >= 200 && res.statusCode < 300,
        };
      }

      return {
        'statusCode': res.statusCode,
        'success': res.statusCode >= 200 && res.statusCode < 300,
        'message': res.body,
      };
    } catch (e) {
      return {
        'success': false,
        'statusCode': 0,
        'message': friendlyApiErrorMessage(
          e,
          fallback: 'Unable to apply the referral code right now. Check your connection and try again.',
        ),
      };
    }
  }
}
