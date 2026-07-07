import 'shiritori_rules.dart';
import 'japanese_utils.dart';

class BankWord {
  const BankWord({
    required this.kana,
    required this.romaji,
    required this.meaning,
  });

  final String kana;
  final String romaji;
  final String meaning;
}

const wordBank = <BankWord>[
  BankWord(kana: 'ねこ', romaji: 'neko', meaning: 'cat'),
  BankWord(kana: 'いぬ', romaji: 'inu', meaning: 'dog'),
  BankWord(kana: 'さくら', romaji: 'sakura', meaning: 'cherry blossom'),
  BankWord(kana: 'すし', romaji: 'sushi', meaning: 'sushi'),
  BankWord(kana: 'とり', romaji: 'tori', meaning: 'bird'),
  BankWord(kana: 'りす', romaji: 'risu', meaning: 'squirrel'),
  BankWord(kana: 'うみ', romaji: 'umi', meaning: 'sea'),
  BankWord(kana: 'やま', romaji: 'yama', meaning: 'mountain'),
  BankWord(kana: 'みず', romaji: 'mizu', meaning: 'water'),
  BankWord(kana: 'かさ', romaji: 'kasa', meaning: 'umbrella'),
  BankWord(kana: 'しか', romaji: 'shika', meaning: 'deer'),
  BankWord(kana: 'さかな', romaji: 'sakana', meaning: 'fish'),
  BankWord(kana: 'くるま', romaji: 'kuruma', meaning: 'car'),
  BankWord(kana: 'はな', romaji: 'hana', meaning: 'flower'),
  BankWord(kana: 'つき', romaji: 'tsuki', meaning: 'moon'),
  BankWord(kana: 'ほし', romaji: 'hoshi', meaning: 'star'),
  BankWord(kana: 'うさぎ', romaji: 'usagi', meaning: 'rabbit'),
  BankWord(kana: 'きつね', romaji: 'kitsune', meaning: 'fox'),
  BankWord(kana: 'ぞう', romaji: 'zou', meaning: 'elephant'),
  BankWord(kana: 'らくだ', romaji: 'rakuda', meaning: 'camel'),
];

BankWord? findHint(String? requiredKana, List<String> used) {
  final usedSet = used.map((w) => toHiragana(w.trim())).toSet();
  final need = requiredKana != null ? toHiragana(requiredKana) : null;

  for (final w in wordBank) {
    if (usedSet.contains(toHiragana(w.kana))) continue;
    if (need != null && getFirstKana(w.kana) != need) continue;
    if (getChainKana(w.kana) == 'ん') continue;
    return w;
  }
  return null;
}
