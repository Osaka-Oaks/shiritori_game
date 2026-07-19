import 'package:flutter/material.dart';

import '../game/room_service.dart';
import '../models/game_models.dart';
import '../theme/app_theme.dart';
import 'game_room_screen.dart';
import 'solo_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.uid});

  final String uid;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _nameCtrl = TextEditingController(text: 'Player');
  final _codeCtrl = TextEditingController();
  var _timeLimit = 30;
  var _busy = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _codeCtrl.dispose();
    super.dispose();
  }

  Future<void> _createRoom() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final code = await createRoom(
        widget.uid,
        _nameCtrl.text.trim(),
        _timeLimit,
        RuleSettings.defaults,
      );
      if (!mounted) return;
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => GameRoomScreen(
            uid: widget.uid,
            code: code,
            playerName: _nameCtrl.text.trim(),
          ),
        ),
      );
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _joinRoom() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final result = await joinRoom(
        widget.uid,
        _nameCtrl.text.trim(),
        _codeCtrl.text,
      );
      if (!mounted) return;
      if (!result.ok) {
        setState(() => _error = result.reason);
        return;
      }
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => GameRoomScreen(
            uid: widget.uid,
            code: _codeCtrl.text.trim().toUpperCase(),
            playerName: _nameCtrl.text.trim(),
          ),
        ),
      );
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('しりとり Shiritori')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Bilingual word chain game',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: AppTheme.muted),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(labelText: 'Your name / なまえ'),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<int>(
                  initialValue: _timeLimit,
                  decoration: const InputDecoration(labelText: 'Turn time (seconds)'),
                  items: const [
                    DropdownMenuItem(value: 15, child: Text('15 sec')),
                    DropdownMenuItem(value: 30, child: Text('30 sec')),
                    DropdownMenuItem(value: 60, child: Text('60 sec')),
                  ],
                  onChanged: _busy ? null : (v) => setState(() => _timeLimit = v ?? 30),
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: _busy ? null : _createRoom,
                  icon: const Icon(Icons.add),
                  label: const Text('Create room / ルームをつくる'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _codeCtrl,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'Room code / ルームコード',
                    hintText: 'ABCD',
                  ),
                ),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: _busy ? null : _joinRoom,
                  icon: const Icon(Icons.login),
                  label: const Text('Join room / さんかする'),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: _busy
                      ? null
                      : () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const SoloScreen()),
                          ),
                  icon: const Icon(Icons.smart_toy_outlined),
                  label: const Text('Practice vs CPU / ひとりで'),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                ],
                if (_busy) ...[
                  const SizedBox(height: 24),
                  const Center(child: CircularProgressIndicator()),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
