import 'package:flame/collisions.dart';
import 'package:flame/components.dart';
import 'package:flutter/material.dart';

import 'word_bubble.dart';

/// Player-controlled paddle to catch word bubbles
class PlayerPaddle extends PositionComponent {
  PlayerPaddle({
    required Vector2 position,
    required Vector2 size,
  }) : super(position: position, size: size, anchor: Anchor.center);

  late RectangleComponent paddleRect;
  double targetX = 0;
  static const double moveSpeed = 800; // pixels per second

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    targetX = position.x;

    // Create paddle rectangle
    paddleRect = RectangleComponent(
      size: size,
      paint: Paint()
        ..color = Colors.purple
        ..style = PaintingStyle.fill,
      anchor: Anchor.center,
      position: size / 2,
    );

    // Add border
    paddleRect.add(
      RectangleComponent(
        size: size,
        paint: Paint()
          ..color = Colors.white
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3,
        anchor: Anchor.center,
      ),
    );

    await add(paddleRect);

    // Add collision hitbox
    add(
      RectangleHitbox(
        size: size,
        anchor: Anchor.center,
        position: size / 2,
      )..collisionType = CollisionType.active,
    );

    // Add marker component for collision detection
    add(_PlayerPaddleMarker());
  }

  @override
  void update(double dt) {
    super.update(dt);

    // Smooth movement towards target
    final diff = targetX - position.x;
    if (diff.abs() > 1) {
      final move = diff.sign * moveSpeed * dt;
      if (move.abs() > diff.abs()) {
        position.x = targetX;
      } else {
        position.x += move;
      }

      // Keep within bounds
      final gameWidth = (parent as Component).size.x;
      position.x = position.x.clamp(size.x / 2, gameWidth - size.x / 2);
    }
  }

  void moveTo(double x) {
    targetX = x;
  }
}

/// Marker component to identify player paddle in collisions
class _PlayerPaddleMarker extends Component with PlayerPaddleCollisionBox {}
