import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flame/effects.dart';
import 'package:flutter/material.dart';

/// A falling word bubble that players need to catch
class WordBubble extends PositionComponent with CollisionCallbacks {
  WordBubble({
    required this.word,
    required Vector2 position,
    required this.isValid,
    required this.onCaught,
    required this.onMissed,
  }) : super(position: position, size: Vector2(80, 80));

  final String word;
  final bool isValid;
  final Function(WordBubble) onCaught;
  final Function(WordBubble) onMissed;

  late TextComponent textComponent;
  late CircleComponent circleComponent;

  static const double fallSpeed = 100; // pixels per second
  bool isCaught = false;
  bool isMissed = false;

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Create bubble circle
    circleComponent = CircleComponent(
      radius: 40,
      paint: Paint()
        ..color = isValid ? Colors.blue.withOpacity(0.7) : Colors.red.withOpacity(0.7)
        ..style = PaintingStyle.fill,
      anchor: Anchor.center,
      position: size / 2,
    );

    // Add border
    circleComponent.add(
      CircleComponent(
        radius: 40,
        paint: Paint()
          ..color = Colors.white
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3,
        anchor: Anchor.center,
      ),
    );

    await add(circleComponent);

    // Create text
    textComponent = TextComponent(
      text: word,
      textRenderer: TextPaint(
        style: const TextStyle(
          color: Colors.white,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      anchor: Anchor.center,
      position: size / 2,
    );
    await add(textComponent);

    // Add collision detection
    add(CircleHitbox(
      radius: 40,
      anchor: Anchor.center,
      position: size / 2,
    ));

    // Add floating animation
    add(
      MoveEffect.by(
        Vector2(0, 10),
        EffectController(
          duration: 1,
          alternate: true,
          infinite: true,
        ),
      ),
    );
  }

  @override
  void update(double dt) {
    super.update(dt);

    if (isCaught || isMissed) return;

    // Fall down
    position.y += fallSpeed * dt;

    // Check if missed (fell off screen)
    if (position.y > (parent as Component).size.y + 50) {
      isMissed = true;
      onMissed(this);
      removeFromParent();
    }
  }

  void catch_() {
    if (isCaught || isMissed) return;

    isCaught = true;
    onCaught(this);

    // Animate catch
    add(
      ScaleEffect.to(
        Vector2.all(0),
        EffectController(duration: 0.3),
        onComplete: () => removeFromParent(),
      ),
    );
  }

  @override
  void onCollisionStart(
    Set<Vector2> intersectionPoints,
    PositionComponent other,
  ) {
    super.onCollisionStart(intersectionPoints, other);

    // Check collision with player paddle
    if (other is PlayerPaddleCollisionBox) {
      catch_();
    }
  }
}

/// Marker class for player paddle collision detection
class PlayerPaddleCollisionBox {}
