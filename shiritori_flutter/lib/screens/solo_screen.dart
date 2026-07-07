import 'package:flutter/material.dart';

import '../game/solo_engine.dart';
import '../theme/app_theme.dart';

class SoloScreen extends StatefulWidget {
  const SoloScreen({super.key});

  @override
  State<SoloScreen> createState() => _SoloScreenState();
}

class _SoloScreenState extends State<SoloScreen> {
  late SoloState _state;
  final _wordCtrl = TextEditingController();
  var _error = '';

  @override
  void initState() {
    super.initState();
    _state = createSoloGame();
  }

  @override
  void dispose() {
    _wordCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    try {
      final next = applyPlayerWord(_state, _wordCtrl.text);
      _wordCtrl.clear();
      setState(() {
        _state = next;
        _error = '';
      });
      if (next.status == SoloStatus.playing && next.turn == 'cpu') {
        Future.delayed(const Duration(milliseconds: 600), () {
          if (!mounted) return;
          setState(() => _state = cpuMove(_state));
        });
      }
    } on StateError catch (e) {
      setState(() => _error = e.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final done = _state.status != SoloStatus.playing;
    final status = switch (_state.status) {
      SoloStatus.playing => _state.turn == 'you' ? 'Your turn' : 'CPU thinking…',
      SoloStatus.won => 'You win! 🎉',
      SoloStatus.lost => 'You lose (ん!)',
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Practice vs CPU'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            color: const Color(0xFFFFE4EA),
            child: Column(
              children: [
                Text(status, style: const TextStyle(fontWeight: FontWeight.bold)),
                if (_state.currentKana != null)
                  Text('Start with「${_state.currentKana}」'),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(12),
              itemCount: _state.chain.length,
              itemBuilder: (context, i) {
                final t = _state.chain[_state.chain.length - 1 - i];
                final mine = t.by == 'you';
                return Align(
                  alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: mine ? const Color(0xFFFFE4EA) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE8D8CC)),
                    ),
                    child: Column(
                      crossAxisAlignment:
                          mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(t.word, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        if (t.feedback != null)
                          Text(t.feedback!, style: const TextStyle(color: AppTheme.muted)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          if (!done)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _wordCtrl,
                      enabled: _state.turn == 'you',
                      decoration: const InputDecoration(hintText: '日本語で…'),
                      onSubmitted: (_) => _submit(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: _state.turn == 'you' ? _submit : null,
                    child: const Text('Go'),
                  ),
                ],
              ),
            ),
          if (_error.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
            ),
          if (done)
            Padding(
              padding: const EdgeInsets.all(16),
              child: FilledButton(
                onPressed: () => setState(() {
                  _state = createSoloGame();
                  _error = '';
                }),
                child: const Text('Play again'),
              ),
            ),
        ],
      ),
    );
  }
}
