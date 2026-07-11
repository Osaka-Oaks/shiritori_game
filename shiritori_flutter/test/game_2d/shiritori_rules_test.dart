import 'package:flutter_test/flutter_test.dart';

/// Unit tests for Shiritori game rules
void main() {
  group('Shiritori Rules', () {
    test('Valid shiritori word chain', () {
      expect(isValidShiritori('いぬ', 'ぬま'), isTrue);
      expect(isValidShiritori('ねこ', 'こい'), isTrue);
      expect(isValidShiritori('さかな', 'なし'), isTrue);
    });

    test('Invalid shiritori word chain', () {
      expect(isValidShiritori('いぬ', 'ねこ'), isFalse);
      expect(isValidShiritori('ねこ', 'いぬ'), isFalse);
    });

    test('Words ending in ん are invalid', () {
      expect(endsInN('らいおん'), isTrue);
      expect(endsInN('りんご'), isFalse);
    });

    test('Get last character', () {
      expect(getLastChar('いぬ'), equals('ぬ'));
      expect(getLastChar('ねこ'), equals('こ'));
      expect(getLastChar('さかな'), equals('な'));
    });

    test('Get first character', () {
      expect(getFirstChar('いぬ'), equals('い'));
      expect(getFirstChar('ねこ'), equals('ね'));
      expect(getFirstChar('さかな'), equals('さ'));
    });
  });
}

/// Check if the second word is a valid shiritori continuation of the first
bool isValidShiritori(String first, String second) {
  if (first.isEmpty || second.isEmpty) return false;
  return getLastChar(first) == getFirstChar(second);
}

/// Check if word ends in ん (n)
bool endsInN(String word) {
  if (word.isEmpty) return false;
  final lastChar = word[word.length - 1];
  return lastChar == 'ん' || lastChar == 'ン';
}

/// Get last character of word
String getLastChar(String word) {
  if (word.isEmpty) return '';
  return word[word.length - 1];
}

/// Get first character of word
String getFirstChar(String word) {
  if (word.isEmpty) return '';
  return word[0];
}
