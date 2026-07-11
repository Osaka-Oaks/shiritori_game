import 'package:flame/components.dart';
import 'package:flutter/material.dart';

/// Animated background for the game
class ParallaxBackground extends PositionComponent {
  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Create gradient background
    final gameSize = (parent as Component).size;
    size = gameSize;

    // Add gradient rectangles
    await add(
      RectangleComponent(
        size: size,
        paint: Paint()
          ..shader = const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF1a237e), // Deep blue
              Color(0xFF283593), // Indigo
              Color(0xFF3f51b5), // Blue
            ],
          ).createShader(Rect.fromLTWH(0, 0, gameSize.x, gameSize.y)),
      ),
    );

    // Add decorative elements (stars/sparkles)
    for (int i = 0; i < 30; i++) {
      await add(_Star(
        position: Vector2(
          ((i * 47) % gameSize.x).toDouble(),
          ((i * 73) % gameSize.y).toDouble(),
        ),
      ));
    }
  }
}

class _Star extends CircleComponent {
  _Star({required Vector2 position})
      : super(
          radius: 2,
          position: position,
          paint: Paint()..color = Colors.white.withOpacity(0.6),
        );
}
