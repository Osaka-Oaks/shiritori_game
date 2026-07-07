import 'dart:async';

import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';

import '../game/room_service.dart';
import '../game/word_bank.dart';
import '../models/game_models.dart';
import '../theme/app_theme.dart';
import '../widgets/word_chain.dart';

class GameRoomScreen extends StatefulWidget {
  const GameRoomScreen({
    super.key,
    required this.uid,
    required this.code,
    required this.playerName,
  });

  final String uid;
  final String code;
  final String playerName;

  @override
  State<GameRoomScreen> createState() => _GameRoomScreenState();
}

class _GameRoomScreenState extends State<GameRoomScreen> {
  GameState? _state;
  StreamSubscription<DatabaseEvent>? _sub;
  final _wordCtrl = TextEditingController();
  var _error = '';
  var _submitting = false;
  Timer? _tick;

  @override
  void initState() {
    super.initState();
    _sub = subscribeRoom(widget.code, (s) {
      if (mounted) setState(() => _state = s);
    });
    _tick = Timer.periodic(const Duration(seconds: 1), (_) {
      final s = _state;
      if (s != null && s.status == GameStatus.playing) {
        finalizeTimeout(s);
      }
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    _tick?.cancel();
    _wordCtrl.dispose();
    super.dispose();
  }

  int get _mySeat => _state?.seatOf(widget.uid) ?? -1;

  bool get _myTurn =>
      _state != null &&
      _state!.status == GameStatus.playing &&
      _state!.turn == _mySeat;

  int get _secondsLeft {
    final s = _state;
    if (s == null || s.status != GameStatus.playing) return 0;
    final elapsed =
        (DateTime.now().millisecondsSinceEpoch - s.turnStartedAt) ~/ 1000;
    return (s.timeLimit - elapsed).clamp(0, s.timeLimit);
  }

  Future<void> _submit() async {
    final s = _state;
    if (s == null || !_myTurn) return;
    setState(() {
      _submitting = true;
      _error = '';
    });
    final result = await playWord(s, widget.uid, _wordCtrl.text);
    if (!mounted) return;
    if (!result.ok) {
      setState(() => _error = result.reason ?? 'Invalid move');
    } else {
      _wordCtrl.clear();
    }
    setState(() => _submitting = false);
  }

  void _showHint() {
    final s = _state;
    if (s == null) return;
    final hint = findHint(s.currentKana, s.words.map((w) => w.word).toList());
    if (hint == null) {
      setState(() => _error = 'No hint available');
      return;
    }
    _wordCtrl.text = hint.kana;
    setState(() => _error = 'Hint: ${hint.meaning}');
  }

  @override
  Widget build(BuildContext context) {
    final s = _state;

    return Scaffold(
      appBar: AppBar(
        title: Text('Room ${widget.code}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: s == null
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                _StatusBar(state: s, mySeat: _mySeat, secondsLeft: _secondsLeft),
                Expanded(child: WordChain(words: s.words, mySeat: _mySeat)),
                if (s.status == GameStatus.finished)
                  _FinishedPanel(state: s, uid: widget.uid),
                if (s.status == GameStatus.playing) ...[
                  if (s.currentKana != null)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Next word starts with「${s.currentKana}」',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _wordCtrl,
                            enabled: _myTurn && !_submitting,
                            decoration: const InputDecoration(hintText: '日本語で…'),
                            onSubmitted: (_) => _submit(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: _myTurn ? _showHint : null,
                          icon: const Icon(Icons.lightbulb_outline),
                          tooltip: 'Hint',
                        ),
                        FilledButton(
                          onPressed: _myTurn && !_submitting ? _submit : null,
                          child: _submitting
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Text('Go'),
                        ),
                      ],
                    ),
                  ),
                  if (_error.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12, left: 16, right: 16),
                      child: Text(
                        _error,
                        style: TextStyle(color: Theme.of(context).colorScheme.error),
                      ),
                    ),
                ],
              ],
            ),
    );
  }
}

class _StatusBar extends StatelessWidget {
  const _StatusBar({
    required this.state,
    required this.mySeat,
    required this.secondsLeft,
  });

  final GameState state;
  final int mySeat;
  final int secondsLeft;

  @override
  Widget build(BuildContext context) {
    final status = switch (state.status) {
      GameStatus.waiting => 'Waiting for player 2…',
      GameStatus.playing =>
        state.turn == mySeat ? 'Your turn! ($secondsLeft s)' : "Opponent's turn",
      GameStatus.finished => 'Game over',
    };

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      color: const Color(0xFFFFE4EA),
      child: Column(
        children: [
          Text(status, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(
            '${state.nameOf(0)} vs ${state.nameOf(1)}',
            style: const TextStyle(color: AppTheme.muted, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _FinishedPanel extends StatelessWidget {
  const _FinishedPanel({required this.state, required this.uid});

  final GameState state;
  final String uid;

  @override
  Widget build(BuildContext context) {
    final seat = state.seatOf(uid);
    final won = state.winnerSeat == seat;
    final reason = state.loseReasonCode == 'n'
        ? '「${state.loseWord}」ends in ん!'
        : state.loseReasonCode == 'timeout'
            ? 'Time ran out!'
            : '';

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(
            won ? 'You win! 🎉' : 'You lose',
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          if (reason.isNotEmpty)
            Text(reason, style: const TextStyle(color: AppTheme.muted)),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () => voteRematch(state, uid),
            child: const Text('Rematch / もういっかい'),
          ),
        ],
      ),
    );
  }
}
