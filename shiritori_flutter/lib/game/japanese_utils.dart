final _japaneseInput = RegExp(r'^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFFー]+$');

bool isJapaneseInput(String str) => _japaneseInput.hasMatch(str.trim());

bool needsReadingLookup(String word) =>
    RegExp(r'[\u4E00-\u9FFF]').hasMatch(word.trim());

String toHiragana(String str) {
  final buffer = StringBuffer();
  for (final rune in str.runes) {
    if (rune >= 0x30A1 && rune <= 0x30F6) {
      buffer.writeCharCode(rune - 0x60);
    } else {
      buffer.writeCharCode(rune);
    }
  }
  return buffer.toString();
}

String normalizeJapanese(String str) => toHiragana(str.trim());
