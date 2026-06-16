import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/api_constants.dart';
import 'api_error_utils.dart';

class AuthService {

  Future<void> _saveAuthData(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();

    final token = data['token'];
    if (token != null) {
      await prefs.setString('token', token.toString());
    }

    final user = data['user'];
    if (user != null) {
      await prefs.setString('user', jsonEncode(user));

      if (user is Map<String, dynamic>) {
        final name = user['name'];
        final email = user['email'];
        final id = user['_id'] ?? user['id'];

        if (name != null) {
          await prefs.setString('name', name.toString());
        }

        if (email != null) {
          await prefs.setString('email', email.toString());
        }

        if (id != null) {
          await prefs.setString('userId', id.toString());
        }
      }
    }
  }

  Future<Map<String,dynamic>> loginAnonymously({String? name}) async {

    try {

      final response =
          await http.post(

        Uri.parse(
          "${ApiConstants.baseUrl}/auth/anonymous",
        ),

        headers: {
          "Content-Type":"application/json"
        },

        body: jsonEncode({
          if (name != null) "name": name,
        }),

      );

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (data['token'] != null || data['user'] != null) {
        await _saveAuthData(data);
      }

      return data;

    } catch(e){

      return {
        "success":false,
        "message":friendlyApiErrorMessage(
          e,
          fallback: 'Unable to start guest session. Check your connection.',
        )
      };

    }

  }

  Future<Map<String,dynamic>> register({

    required String name,
    required String email,
    required String password,
    String? referralCode,

  }) async {

    try {

      final response =
          await http.post(

        Uri.parse(
          "${ApiConstants.baseUrl}/auth/register",
        ),

        headers: {
          "Content-Type":"application/json"
        },

        body: jsonEncode({

          "name":name,
          "email":email,
          "password":password,
          "referralCode": referralCode,

        }),
      );

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (data['token'] != null || data['user'] != null) {
        await _saveAuthData(data);
      }

      return data;

    } catch(e){

      return {
        "success":false,
        "message":friendlyApiErrorMessage(
          e,
          fallback: 'Unable to register right now. Check your connection and try again.',
        )
      };

    }

  }

  Future<Map<String,dynamic>> login({

    required String email,
    required String password,

  }) async {

    try{

      final response =
      await http.post(

        Uri.parse(
          "${ApiConstants.baseUrl}/auth/login",
        ),

        headers: {
          "Content-Type":"application/json"
        },

        body: jsonEncode({

          "email":email,
          "password":password

        }),
      );

      final data=jsonDecode(
        response.body
      ) as Map<String, dynamic>;

      if (data['token'] != null || data['user'] != null) {
        await _saveAuthData(data);
      }

      return data;

    }

    catch(e){

      return {

        "success":false,
        "message":friendlyApiErrorMessage(
          e,
          fallback: 'Unable to log in right now. Check your connection and try again.',
        )

      };

    }

  }

  Future<Map<String, dynamic>> submitOnboarding({
    required Map<String, dynamic> payload,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/onboarding"),
        headers: headers,
        body: jsonEncode(payload),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to save onboarding right now. Try again when you are back online.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.get(
        Uri.parse("${ApiConstants.baseUrl}/auth/profile"),
        headers: headers,
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load your profile right now. Check your connection and try again.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> updateProfile({
    required Map<String, dynamic> payload,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.put(
        Uri.parse("${ApiConstants.baseUrl}/auth/profile"),
        headers: headers,
        body: jsonEncode(payload),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to update your profile right now. Try again later.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> updatePreferences({
    required Map<String, dynamic> payload,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.put(
        Uri.parse("${ApiConstants.baseUrl}/auth/preferences"),
        headers: headers,
        body: jsonEncode(payload),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to update preferences right now. Check your connection and try again.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> changePassword({
    required Map<String, dynamic> payload,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.put(
        Uri.parse("${ApiConstants.baseUrl}/auth/password"),
        headers: headers,
        body: jsonEncode(payload),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to change your password right now. Try again later.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      // Always clear local data
      await prefs.remove('token');
      await prefs.remove('user');
      await prefs.remove('name');
      await prefs.remove('email');
      await prefs.remove('userId');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/logout"),
        headers: headers,
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": true, // We return true because local logout is done
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": true,
        "message": "Logged out locally",
      };
    } catch (e) {
      return {
        "success": true, // Still return true as local cleanup is likely done or should be forced
        "message": "Logged out locally",
      };
    }
  }

  Future<Map<String, dynamic>> getDailyAssessmentStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.get(
        Uri.parse("${ApiConstants.baseUrl}/auth/daily-assessment/status"),
        headers: headers,
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to load daily assessment status right now. Try again later.',
        ),
      };
    }
  }

  Future<Map<String, dynamic>> submitDailyAssessment({
    required Map<String, dynamic> payload,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      final headers = <String, String>{
        "Content-Type": "application/json",
      };

      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }

      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/daily-assessment"),
        headers: headers,
        body: jsonEncode(payload),
      );

      final decoded = jsonDecode(response.body);

      if (decoded is Map<String, dynamic>) {
        return {
          ...decoded,
          "statusCode": response.statusCode,
          "success": response.statusCode >= 200 && response.statusCode < 300,
        };
      }

      return {
        "statusCode": response.statusCode,
        "success": response.statusCode >= 200 && response.statusCode < 300,
        "message": response.body,
      };
    } catch (e) {
      return {
        "success": false,
        "statusCode": 0,
        "message": friendlyApiErrorMessage(
          e,
          fallback: 'Unable to submit daily assessment right now. Check your connection and try again.',
        ),
      };
    }
  }

  // =======================
  // PASSWORD RESET / OTP
  // =======================

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/forgot-password"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email}),
      );

      final decoded = jsonDecode(response.body);
      return {
        ...decoded,
        "success": response.statusCode >= 200 && response.statusCode < 300,
      };
    } catch (e) {
      return {
        "success": false,
        "message": friendlyApiErrorMessage(e),
      };
    }
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/verify-otp"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "otp": otp}),
      );

      final decoded = jsonDecode(response.body);
      return {
        ...decoded,
        "success": response.statusCode >= 200 && response.statusCode < 300,
      };
    } catch (e) {
      return {
        "success": false,
        "message": friendlyApiErrorMessage(e),
      };
    }
  }

  Future<Map<String, dynamic>> resetPassword({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/auth/reset-password"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "otp": otp,
          "newPassword": newPassword,
        }),
      );

      final decoded = jsonDecode(response.body);
      return {
        ...decoded,
        "success": response.statusCode >= 200 && response.statusCode < 300,
      };
    } catch (e) {
      return {
        "success": false,
        "message": friendlyApiErrorMessage(e),
      };
    }
  }

}