import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'shiritori_2d_game.dart';

/// Screen that displays the 2D Flame game
class Game2DScreen extends StatefulWidget {
  const Game2DScreen({super.key});

  @override
  State<Game2DScreen> createState() => _Game2DScreenState();
}

class _Game2DScreenState extends State<Game2DScreen> {
  late Shiritori2DGame game;
  int currentScore = 0;
  bool isGameOver = false;
  int finalScore = 0;

  @override
  void initState() {
    super.initState();
    game = Shiritori2DGame(
      onScoreUpdate: (score) {
        setState(() {
          currentScore = score;
        });
      },
      onGameOver: (score) {
        setState(() {
          isGameOver = true;
          finalScore = score;
        });
        _showGameOverDialog();
      },
    );
  }

  void _showGameOverDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Game Over!'),
        content: Text(
          'Final Score: $finalScore\n\nGreat job playing Shiritori!',
          style: const TextStyle(fontSize: 18),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() {
                isGameOver = false;
                currentScore = 0;
                finalScore = 0;
              });
              game.reset();
            },
            child: const Text('Play Again'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.pop();
            },
            child: const Text('Exit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('2D Shiritori Game'),
        actions: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Center(
              child: Text(
                'Score: $currentScore',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          GameWidget(game: game),
          if (!isGameOver)
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Card(
                color: Colors.black.withOpacity(0.7),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        '🎮 How to Play',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Tap or drag to move the paddle\nCatch BLUE bubbles (valid shiritori words)\nAvoid RED bubbles (invalid words)',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          game.reset();
          setState(() {
            currentScore = 0;
            isGameOver = false;
            finalScore = 0;
          });
        },
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
