import '../models/game_models.dart';
import 'japanese_utils.dart';

const _smallToLarge = <String, String>{
  'ゃ': 'や',
  'ゅ': 'ゆ',
  'ょ': 'よ',
  'ぁ': 'あ',
  'ぃ': 'い',
  'ぅ': 'う',
  'ぇ': 'え',
  'ぉ': 'お',
  'っ': 'つ',
  'ゎ': 'わ',
};

const _dakutenToBase = <String, String>{
  'が': 'か',
  'ぎ': 'き',
  'ぐ': 'く',
  'げ': 'け',
  'ご': 'こ',
  'ざ': 'さ',
  'じ': 'し',
  'ず': 'す',
  'ぜ': 'せ',
  'ぞ': 'そ',
  'だ': 'た',
  'ぢ': 'ち',
  'づ': 'つ',
  'で': 'て',
  'ど': 'と',
  'ば': 'は',
  'び': 'ひ',
  'ぶ': 'ふ',
  'べ': 'へ',
  'ぼ': 'ほ',
  'ぱ': 'は',
  'ぴ': 'ひ',
  'ぷ': 'ふ',
  'ぺ': 'へ',
  'ぽ': 'ほ',
};

String chainWord(String word, [String? readingKana]) {
  final reading = readingKana?.trim();
  if (reading != null && RegExp(r'^[ぁ-ゖァ-ヺー]+$').hasMatch(reading)) {
    return toHiragana(reading);
  }
  return toHiragana(word.trim());
}

String getChainKana(String word, [RuleSettings rules = RuleSettings.defaults]) {
  final w = toHiragana(word.trim());
  var i = w.length - 1;
  while (i > 0 && w[i] == 'ー') {
    i--;
  }
  var kana = w[i];
  if (rules.smallKanaLenient && _smallToLarge.containsKey(kana)) {
    kana = _smallToLarge[kana]!;
  }
  return kana;
}

String getFirstKana(String word) => toHiragana(word.trim())[0];

bool endsInN(String word) {
  final w = toHiragana(word.trim());
  var i = w.length - 1;
  while (i > 0 && w[i] == 'ー') {
    i--;
  }
  return w[i] == 'ん';
}

bool _kanaMatches(String a, String b, RuleSettings rules) {
  if (a == b) return true;
  if (rules.dakutenLenient) {
    final baseA = _dakutenToBase[a] ?? a;
    final baseB = _dakutenToBase[b] ?? b;
    return baseA == baseB;
  }
  return false;
}

sealed class MoveResult {
  const MoveResult();
}

class MoveOk extends MoveResult {
  const MoveOk({required this.chainKana, required this.losesByN});
  final String chainKana;
  final bool losesByN;
}

class MoveErr extends MoveResult {
  const MoveErr(this.reason);
  final String reason;
}

MoveResult validateMove(
  String rawWord,
  String? requiredKana,
  List<String> usedWords, [
  RuleSettings rules = RuleSettings.defaults,
  String? readingKana,
]) {
  final word = rawWord.trim();
  final kanaForm = chainWord(word, readingKana);

  if (word.isEmpty) {
    return const MoveErr('Type a word first. / ことばを入れてね');
  }
  if (!isJapaneseInput(word)) {
    return const MoveErr(
      'Japanese only (ひらがな・カタカナ・漢字).',
    );
  }
  if (kanaForm.length < 2) {
    return const MoveErr('Words must be at least 2 kana. / 2文字以上で');
  }
  if (requiredKana != null) {
    final need = toHiragana(requiredKana);
    if (!_kanaMatches(getFirstKana(kanaForm), need, rules)) {
      return MoveErr('Must start with「$requiredKana」');
    }
  }
  final normalized = toHiragana(kanaForm);
  for (final u in usedWords) {
    if (toHiragana(chainWord(u)) == normalized) {
      return const MoveErr('Already used — no repeats. / もう使ったよ');
    }
  }
  return MoveOk(
    chainKana: getChainKana(kanaForm, rules),
    losesByN: endsInN(kanaForm),
  );
}
