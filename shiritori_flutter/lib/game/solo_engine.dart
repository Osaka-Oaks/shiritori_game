import 'dart:math';

import 'shiritori_rules.dart';
import 'word_bank.dart';

class SoloTurn {
  const SoloTurn({
    required this.word,
    required this.by,
    this.romaji = '',
    this.meaning,
    this.feedback,
  });

  final String word;
  final String romaji;
  final String? meaning;
  final String by; // 'you' | 'cpu'
  final String? feedback;
}

enum SoloStatus { playing, won, lost }

class SoloState {
  const SoloState({
    required this.chain,
    required this.currentKana,
    required this.turn,
    required this.status,
    required this.usedWords,
  });

  final List<SoloTurn> chain;
  final String? currentKana;
  final String turn;
  final SoloStatus status;
  final List<String> usedWords;
}

SoloState createSoloGame() => const SoloState(
      chain: [],
      currentKana: null,
      turn: 'you',
      status: SoloStatus.playing,
      usedWords: [],
    );

SoloState applyPlayerWord(SoloState state, String rawWord) {
  final check = validateMove(
    rawWord,
    state.currentKana,
    state.usedWords,
  );
  if (check is MoveErr) {
    throw StateError(check.reason);
  }
  final ok = check as MoveOk;
  final word = rawWord.trim();
  final chain = [
    ...state.chain,
    SoloTurn(word: word, by: 'you'),
  ];
  final used = [...state.usedWords, word];

  if (ok.losesByN) {
    return SoloState(
      chain: chain,
      currentKana: ok.chainKana,
      turn: 'cpu',
      status: SoloStatus.lost,
      usedWords: used,
    );
  }

  return SoloState(
    chain: chain,
    currentKana: ok.chainKana,
    turn: 'cpu',
    status: SoloStatus.playing,
    usedWords: used,
  );
}

SoloState cpuMove(SoloState state) {
  if (state.status != SoloStatus.playing || state.turn != 'cpu') return state;

  final need = state.currentKana;
  final candidates = wordBank.where((w) {
    if (need != null && w.kana[0] != need) return false;
    if (state.usedWords.contains(w.kana)) return false;
    return w.kana.length >= 2;
  }).toList();

  if (candidates.isEmpty) {
    return SoloState(
      chain: [
        ...state.chain,
        const SoloTurn(
          word: '…',
          romaji: '',
          by: 'cpu',
          feedback: 'CPU has no word — you win!',
        ),
      ],
      currentKana: state.currentKana,
      turn: 'you',
      status: SoloStatus.won,
      usedWords: state.usedWords,
    );
  }

  final pick = candidates[Random().nextInt(candidates.length)];
  final check = validateMove(
    pick.kana,
    state.currentKana,
    state.usedWords,
  );
  if (check is! MoveOk) return state;
  final ok = check;

  final chain = [
    ...state.chain,
    SoloTurn(
      word: pick.kana,
      romaji: pick.romaji,
      meaning: pick.meaning,
      by: 'cpu',
      feedback: '${pick.kana} (${pick.meaning})',
    ),
  ];
  final used = [...state.usedWords, pick.kana];

  if (ok.losesByN) {
    return SoloState(
      chain: chain,
      currentKana: ok.chainKana,
      turn: 'you',
      status: SoloStatus.won,
      usedWords: used,
    );
  }

  return SoloState(
    chain: chain,
    currentKana: ok.chainKana,
    turn: 'you',
    status: SoloStatus.playing,
    usedWords: used,
  );
}
