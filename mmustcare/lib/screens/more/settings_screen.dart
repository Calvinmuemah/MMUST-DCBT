import 'dart:async';

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/services/auth_service.dart';
import '../auth/login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() =>
      _SettingsScreenState();
}

class _SettingsScreenState
    extends State<SettingsScreen> {
  bool notifications = true;
  bool darkMode = false;
  bool emailUpdates = true;
  final AuthService _auth = AuthService();

  String _name = '';
  String _email = '';
  OverlayEntry? _toastEntry;
  Timer? _toastTimer;

  String _extractResponseMessage(
    Map<String, dynamic> res, {
    required String fallback,
  }) {
    final direct = res['message']?.toString();
    if (direct != null && direct.trim().isNotEmpty) {
      return direct;
    }

    final error = res['error']?.toString();
    if (error != null && error.trim().isNotEmpty) {
      return error;
    }

    final errors = res['errors'];
    if (errors is List && errors.isNotEmpty) {
      final first = errors.first;
      if (first is String && first.trim().isNotEmpty) {
        return first;
      }
      if (first is Map<String, dynamic>) {
        final mapped = first['message']?.toString() ?? first['error']?.toString();
        if (mapped != null && mapped.trim().isNotEmpty) {
          return mapped;
        }
      }
    }

    return fallback;
  }

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _toastTimer?.cancel();
    _toastEntry?.remove();
    super.dispose();
  }

  void _hideToast() {
    _toastTimer?.cancel();
    _toastTimer = null;
    _toastEntry?.remove();
    _toastEntry = null;
  }

  void _showToast(
    String message, {
    bool isError = false,
    bool isLoading = false,
    bool autoDismiss = true,
    Duration duration = const Duration(seconds: 3),
  }) {
    if (!mounted) return;

    _hideToast();

    final overlay = Overlay.of(context, rootOverlay: true);

    _toastEntry = OverlayEntry(
      builder: (overlayContext) {
        final topInset = MediaQuery.of(overlayContext).padding.top;
        return Positioned(
          top: topInset + 12,
          left: 16,
          right: 16,
          child: IgnorePointer(
            child: Material(
              color: Colors.transparent,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: isError ? const Color(0xFFB3261E) : const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 12,
                      offset: Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    if (isLoading)
                      const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    else
                      Icon(
                        isError ? Icons.error_outline : Icons.check_circle_outline,
                        color: Colors.white,
                        size: 18,
                      ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        message,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );

    overlay.insert(_toastEntry!);

    if (autoDismiss) {
      _toastTimer = Timer(duration, _hideToast);
    }
  }

  Future<void> _loadProfile() async {
    final res = await _auth.getProfile();
    if (!mounted) return;

    if (res['success'] == true && res['user'] != null) {
      final user = res['user'] as Map<String, dynamic>;
      setState(() {
        _name = user['name']?.toString() ?? '';
        _email = user['email']?.toString() ?? '';
        notifications = user['notificationsEnabled'] == true;
        emailUpdates = user['emailUpdates'] == true;
      });
    } else if (res['success'] == true) {
      // some endpoints may return the user object directly
      final user = res;
      setState(() {
        _name = user['name']?.toString() ?? _name;
        _email = user['email']?.toString() ?? _email;
        notifications = user['notificationsEnabled'] == true;
        emailUpdates = user['emailUpdates'] == true;
      });
    }
  }

  Future<void> _savePreferences({
    required bool notificationsValue,
    required bool emailUpdatesValue,
  }) async {
    setState(() {
      notifications = notificationsValue;
      emailUpdates = emailUpdatesValue;
    });

    final res = await _auth.updatePreferences(
      payload: {
        'notificationsEnabled': notificationsValue,
        'emailUpdates': emailUpdatesValue,
      },
    );

    if (!mounted) return;

    if (res['success'] != true) {
      setState(() {
        notifications = !notificationsValue;
        emailUpdates = !emailUpdatesValue;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            res['message']?.toString() ?? 'Failed to update preferences',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),

      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,

        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios,
            color: Colors.black,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),

        centerTitle: true,

        title: const Text(
          "Settings",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),

        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [

            /// PROFILE CARD
            Container(
              padding:
                  const EdgeInsets.all(18),

              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(
                        24),

                boxShadow: [
                  BoxShadow(
                    color: Colors.black
                        .withOpacity(.03),
                    blurRadius: 12,
                  )
                ],
              ),

              child: Row(
                children: [

                  CircleAvatar(
                    radius: 30,
                    backgroundColor:
                        AppColors.primary
                            .withOpacity(.15),
                    child: Text(
                      _name.isNotEmpty ? _name.substring(0, 1).toUpperCase() : 'S',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ),

                  const SizedBox(
                      width: 15),

                  Expanded(
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment
                              .start,
                      children: [

                        Text(
                          _name.isNotEmpty ? _name : 'Student',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 17,
                          ),
                        ),

                        SizedBox(height: 4),

                        Text(
                          _email.isNotEmpty ? _email : 'Manage your account preferences',
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),

                  GestureDetector(
                    onTap: _showEditProfile,
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.edit,
                        color: AppColors.primary,
                      ),
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 30),

            const Text(
              "Preferences",
              style: TextStyle(
                fontSize: 18,
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            _settingTile(
              icon:
                  Icons.notifications_outlined,
              title: "Notifications",
              subtitle:
                  "Receive app notifications",
              value: notifications,
              onChanged: (value) {
                _savePreferences(
                  notificationsValue: value,
                  emailUpdatesValue: emailUpdates,
                );
              },
            ),

            _settingTile(
              icon: Icons.dark_mode,
              title: "Dark Mode",
              subtitle:
                  "Enable dark appearance",
              value: darkMode,
              onChanged: (value) {
                setState(() {
                  darkMode = value;
                });
              },
            ),

            _settingTile(
              icon: Icons.email_outlined,
              title: "Email Updates",
              subtitle:
                  "Receive email updates",
              value: emailUpdates,
              onChanged: (value) {
                _savePreferences(
                  notificationsValue: notifications,
                  emailUpdatesValue: value,
                );
              },
            ),

            const SizedBox(height: 30),

            const Text(
              "Account",
              style: TextStyle(
                fontSize: 18,
                fontWeight:
                    FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            _menuTile(
              Icons.lock_outline,
              "Change Password",
              onTap: _showChangePassword,
            ),

            _menuTile(
              Icons.person_outline,
              "Edit Profile",
              onTap: _showEditProfile,
            ),

            _menuTile(
              Icons.logout,
              "Logout",
              isLogout: true,
              onTap: _logout,
            ),
          ],
        ),
      ),
    );
  }

  Widget _settingTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required Function(bool)
        onChanged,
  }) {
    return Container(
      margin:
          const EdgeInsets.only(
              bottom: 15),

      padding:
          const EdgeInsets.symmetric(
        horizontal: 18,
        vertical: 10,
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(
                18),

        boxShadow: [
          BoxShadow(
            color:
                Colors.black.withOpacity(
                    .03),
            blurRadius: 10,
          )
        ],
      ),

      child: Row(
        children: [

          Container(
            padding:
                const EdgeInsets.all(
                    10),

            decoration:
                BoxDecoration(
              color: AppColors.primary
                  .withOpacity(.1),
              borderRadius:
                  BorderRadius
                      .circular(
                          12),
            ),

            child: Icon(
              icon,
              color:
                  AppColors.primary,
            ),
          ),

          const SizedBox(width: 15),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,
              children: [

                Text(
                  title,
                  style:
                      const TextStyle(
                    fontWeight:
                        FontWeight
                            .bold,
                  ),
                ),

                Text(
                  subtitle,
                  style:
                      const TextStyle(
                    color:
                        Colors.grey,
                    fontSize: 12,
                  ),
                )
              ],
            ),
          ),

          Switch(
            value: value,
            activeColor:
                AppColors.primary,
            onChanged: onChanged,
          )
        ],
      ),
    );
  }

  Widget _menuTile(
    IconData icon,
    String title, {
    bool isLogout = false,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        margin:
            const EdgeInsets.only(
                bottom: 15),

        padding:
            const EdgeInsets.all(
                18),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius:
              BorderRadius.circular(
                  18),
        ),

        child: Row(
          children: [

            Icon(
              icon,
              color: isLogout
                  ? Colors.red
                  : AppColors.primary,
            ),

            const SizedBox(width: 15),

            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontWeight:
                      FontWeight.w600,
                  color: isLogout
                      ? Colors.red
                      : Colors.black,
                ),
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: Colors.grey,
            )
          ],
        ),
      ),
    );
  }

  Future<void> _showChangePassword() async {
    final currentPasswordCtrl = TextEditingController();
    final newPasswordCtrl = TextEditingController();
    final confirmPasswordCtrl = TextEditingController();

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _SettingsActionSheet(
        title: 'Change Password',
        subtitle: 'Update your password to keep your account secure.',
        icon: Icons.lock_outline,
        actionLabel: 'Save password',
        onCancel: () => Navigator.of(ctx).pop(),
        onSubmit: () async {
          if (!mounted) return;

          _showToast(
            'Saving password...',
            isLoading: true,
            autoDismiss: false,
          );

          try {
            final payload = {
              'currentPassword': currentPasswordCtrl.text.trim(),
              'newPassword': newPasswordCtrl.text.trim(),
              'confirmPassword': confirmPasswordCtrl.text.trim(),
            };

            final res = await _auth.changePassword(payload: payload);

            if (!mounted) return;

            if (res['success'] == true) {
              _showToast('Password changed successfully');
            } else {
              _showToast(
                _extractResponseMessage(
                  res,
                  fallback: 'Failed to change password',
                ),
                isError: true,
              );
            }

            if (res['success'] == true && ctx.mounted) {
              Navigator.of(ctx).pop();
            }
          } catch (_) {
            _showToast(
              'Unable to change password right now. Try again.',
              isError: true,
            );
          }
        },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _SheetTextField(
              controller: currentPasswordCtrl,
              label: 'Current password',
              obscureText: true,
            ),
            const SizedBox(height: 12),
            _SheetTextField(
              controller: newPasswordCtrl,
              label: 'New password',
              obscureText: true,
            ),
            const SizedBox(height: 12),
            _SheetTextField(
              controller: confirmPasswordCtrl,
              label: 'Confirm new password',
              obscureText: true,
            ),
          ],
        ),
      ),
    );

    currentPasswordCtrl.dispose();
    newPasswordCtrl.dispose();
    confirmPasswordCtrl.dispose();
  }

  Future<void> _showEditProfile() async {
    final nameCtrl = TextEditingController(text: _name);
    final emailCtrl = TextEditingController(text: _email);

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _SettingsActionSheet(
        title: 'Edit Profile',
        subtitle: 'Update your name and email address.',
        icon: Icons.person_outline,
        actionLabel: 'Save changes',
        onCancel: () => Navigator.of(ctx).pop(),
        onSubmit: () async {
          if (!mounted) return;

          _showToast(
            'Saving profile...',
            isLoading: true,
            autoDismiss: false,
          );

          try {
            final payload = {
              'name': nameCtrl.text.trim(),
              'email': emailCtrl.text.trim(),
            };

            final res = await _auth.updateProfile(payload: payload);

            if (!mounted) return;

            if (res['success'] == true) {
              await _loadProfile();
              _showToast('Profile updated');
            } else {
              _showToast(
                _extractResponseMessage(
                  res,
                  fallback: 'Failed to update profile',
                ),
                isError: true,
              );
            }

            if (res['success'] == true && ctx.mounted) {
              Navigator.of(ctx).pop();
            }
          } catch (_) {
            _showToast(
              'Unable to update profile right now. Try again.',
              isError: true,
            );
          }
        },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _SheetTextField(
              controller: nameCtrl,
              label: 'Name',
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 12),
            _SheetTextField(
              controller: emailCtrl,
              label: 'Email',
              keyboardType: TextInputType.emailAddress,
            ),
          ],
        ),
      ),
    );

    nameCtrl.dispose();
    emailCtrl.dispose();
  }

  Future<void> _logout() async {
    final res = await _auth.logout();

    if (!mounted) return;

    if (res['success'] != true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            res['message']?.toString() ?? 'Failed to logout',
          ),
        ),
      );
      return;
    }

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }
}

class _SettingsActionSheet extends StatefulWidget {
  const _SettingsActionSheet({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.actionLabel,
    required this.onSubmit,
    required this.onCancel,
    required this.child,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final String actionLabel;
  final Future<void> Function() onSubmit;
  final VoidCallback onCancel;
  final Widget child;

  @override
  State<_SettingsActionSheet> createState() => _SettingsActionSheetState();
}

class _SettingsActionSheetState extends State<_SettingsActionSheet> {
  bool _saving = false;

  Future<void> _submit() async {
    if (_saving) return;
    setState(() => _saving = true);
    try {
      await widget.onSubmit();
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.62,
      minChildSize: 0.45,
      maxChildSize: 0.9,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
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
              const SizedBox(height: 18),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      widget.icon,
                      color: AppColors.primary,
                      size: 30,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.subtitle,
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: widget.onCancel,
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              widget.child,
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saving ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: _saving
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text(
                        widget.actionLabel,
                        style: const TextStyle(color: Colors.white),
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _SheetTextField extends StatelessWidget {
  const _SheetTextField({
    required this.controller,
    required this.label,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
  });

  final TextEditingController controller;
  final String label;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: const Color(0xFFF7F8FA),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}