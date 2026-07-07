import 'package:flutter_test/flutter_test.dart';
import 'package:shiritori_flutter/game/shiritori_rules.dart';

void main() {
  test('validateMove accepts valid chain word', () {
    final r = validateMove('ねこ', null, []);
    expect(r, isA<MoveOk>());
    expect((r as MoveOk).chainKana, 'こ');
  });

  test('validateMove rejects wrong start kana', () {
    final r = validateMove('いぬ', 'か', []);
    expect(r, isA<MoveErr>());
  });

  test('validateMove flags ん loss', () {
    final r = validateMove('きん', 'き', []);
    expect(r, isA<MoveOk>());
    expect((r as MoveOk).losesByN, isTrue);
  });
}
