import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'services/auth_service.dart';
import 'theme/app_theme.dart';

class ShiritoriApp extends StatefulWidget {
  const ShiritoriApp({super.key});

  @override
  State<ShiritoriApp> createState() => _ShiritoriAppState();
}

class _ShiritoriAppState extends State<ShiritoriApp> {
  String? _uid;
  String? _error;

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    try {
      final uid = await ensureSignedIn();
      if (mounted) setState(() => _uid = uid);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shiritori',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: _error != null
          ? _ErrorScreen(message: _error!, onRetry: _boot)
          : _uid == null
              ? const _LoadingScreen()
              : HomeScreen(uid: _uid!),
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Connecting to Firebase…'),
          ],
        ),
      ),
    );
  }
}

class _ErrorScreen extends StatelessWidget {
  const _ErrorScreen({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppTheme.muted),
              const SizedBox(height: 16),
              Text(message, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton(onPressed: onRetry, child: const Text('Retry')),
            ],
          ),
        ),
      ),
    );
  }
}
