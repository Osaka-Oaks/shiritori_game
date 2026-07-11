import 'package:flame/components.dart';
import 'package:flutter/material.dart';

/// Displays the current score
class ScoreDisplay extends PositionComponent {
  ScoreDisplay({
    required Vector2 position,
    required this.score,
  }) : super(position: position);

  int score;
  late TextComponent textComponent;

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    textComponent = TextComponent(
      text: 'Score: $score',
      textRenderer: TextPaint(
        style: const TextStyle(
          color: Colors.white,
          fontSize: 32,
          fontWeight: FontWeight.bold,
          shadows: [
            Shadow(
              color: Colors.black,
              offset: Offset(2, 2),
              blurRadius: 4,
            ),
          ],
        ),
      ),
    );
    await add(textComponent);
  }

  void updateScore(int newScore) {
    score = newScore;
    textComponent.text = 'Score: $score';
  }
}
