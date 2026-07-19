import 'package:flutter_test/flutter_test.dart';
import 'package:shiritori_flutter/game/shiritori_rules.dart';

void main() {
  test('validateMove accepts valid first word', () {
    final r = validateMove('ねこ', null, []);
    expect(r, isA<MoveOk>());
    expect((r as MoveOk).chainKana, 'こ');
  });
}
