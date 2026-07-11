import 'dart:math';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flame/game.dart';
import 'package:flame/input.dart';
import 'package:flame/palette.dart';
import 'package:flutter/material.dart';

import 'components/word_bubble.dart';
import 'components/player_paddle.dart';
import 'components/score_display.dart';
import 'components/background.dart';

/// 2D Shiritori Game using Flame engine
/// Players catch falling word bubbles that match shiritori rules
class Shiritori2DGame extends FlameGame
    with HasCollisionDetection, TapDetector, PanDetector {
  Shiritori2DGame({
    required this.onScoreUpdate,
    required this.onGameOver,
  });

  final Function(int score) onScoreUpdate;
  final Function(int finalScore) onGameOver;

  late PlayerPaddle player;
  late ScoreDisplay scoreDisplay;
  late ParallaxBackground background;

  int score = 0;
  String? lastWord;
  bool isGameOver = false;

  final Random _random = Random();
  double _spawnTimer = 0;
  static const double _spawnInterval = 2.0; // Spawn every 2 seconds

  // Word bank for the game
  final List<String> wordBank = [
    'いぬ', // inu (dog)
    'ねこ', // neko (cat)
    'こい', // koi (fish)
    'いか', // ika (squid)
    'かに', // kani (crab)
    'にわとり', // niwatori (chicken)
    'りす', // risu (squirrel)
    'すずめ', // suzume (sparrow)
    'めだか', // medaka (killifish)
    'かえる', // kaeru (frog)
    'るり', // ruri (lapis lazuli)
  ];

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    // Add background
    background = ParallaxBackground();
    await add(background);

    // Add player paddle
    player = PlayerPaddle(
      position: Vector2(size.x / 2, size.y - 100),
      size: Vector2(120, 40),
    );
    await add(player);

    // Add score display
    scoreDisplay = ScoreDisplay(
      position: Vector2(20, 20),
      score: score,
    );
    await add(scoreDisplay);

    // Start spawning words
    _spawnInitialWord();
  }

  @override
  void update(double dt) {
    super.update(dt);

    if (isGameOver) return;

    // Spawn words periodically
    _spawnTimer += dt;
    if (_spawnTimer >= _spawnInterval) {
      _spawnTimer = 0;
      _spawnWord();
    }
  }

  void _spawnInitialWord() {
    final word = wordBank[_random.nextInt(wordBank.length)];
    _createWordBubble(word, isFirst: true);
    lastWord = word;
  }

  void _spawnWord() {
    if (lastWord == null) return;

    // Find valid next words
    final lastChar = _getLastChar(lastWord!);
    final validWords = wordBank.where((w) => w.startsWith(lastChar)).toList();

    // Also add some invalid words for challenge
    final invalidWords = wordBank.where((w) => !w.startsWith(lastChar)).toList();

    // 70% valid, 30% invalid
    final useValid = _random.nextDouble() < 0.7;
    final wordList = useValid && validWords.isNotEmpty ? validWords : invalidWords;

    if (wordList.isEmpty) return;

    final word = wordList[_random.nextInt(wordList.length)];
    _createWordBubble(word, isValid: useValid);
  }

  void _createWordBubble(String word, {bool isValid = true, bool isFirst = false}) {
    final x = _random.nextDouble() * (size.x - 80) + 40;
    final bubble = WordBubble(
      word: word,
      position: Vector2(x, -50),
      isValid: isFirst || isValid,
      onCaught: _onBubbleCaught,
      onMissed: _onBubbleMissed,
    );
    add(bubble);
  }

  void _onBubbleCaught(WordBubble bubble) {
    if (bubble.isValid) {
      // Correct catch!
      score += 10;
      lastWord = bubble.word;
      onScoreUpdate(score);
      scoreDisplay.updateScore(score);

      // Add particle effect
      _addSuccessParticles(bubble.position);
    } else {
      // Wrong catch!
      _handleWrongCatch();
    }
  }

  void _onBubbleMissed(WordBubble bubble) {
    if (bubble.isValid) {
      // Missed a valid word - penalty
      _handleMissedWord();
    }
    // Missing invalid words is okay
  }

  void _handleWrongCatch() {
    score = max(0, score - 5);
    onScoreUpdate(score);
    scoreDisplay.updateScore(score);

    // Add negative visual feedback
    camera.shake(intensity: 5);
  }

  void _handleMissedWord() {
    score = max(0, score - 3);
    onScoreUpdate(score);
    scoreDisplay.updateScore(score);

    // Check game over condition
    if (score <= 0) {
      _gameOver();
    }
  }

  void _gameOver() {
    isGameOver = true;
    onGameOver(score);
  }

  void _addSuccessParticles(Vector2 position) {
    // Add particle effect for successful catch
    final particle = ParticleSystemComponent(
      particle: Particle.generate(
        count: 20,
        lifespan: 0.5,
        generator: (i) => AcceleratedParticle(
          acceleration: Vector2(0, 200),
          speed: Vector2(
            (_random.nextDouble() - 0.5) * 400,
            -_random.nextDouble() * 300,
          ),
          position: position.clone(),
          child: CircleParticle(
            radius: 2,
            paint: Paint()..color = Colors.green.withOpacity(0.8),
          ),
        ),
      ),
    );
    add(particle);
  }

  String _getLastChar(String word) {
    if (word.isEmpty) return '';
    return word[word.length - 1];
  }

  @override
  void onTapDown(TapDownInfo info) {
    if (!isGameOver) {
      player.moveTo(info.eventPosition.global.x);
    }
  }

  @override
  void onPanUpdate(DragUpdateInfo info) {
    if (!isGameOver) {
      player.moveTo(info.eventPosition.global.x);
    }
  }

  void reset() {
    score = 0;
    lastWord = null;
    isGameOver = false;
    _spawnTimer = 0;

    // Remove all word bubbles
    children.whereType<WordBubble>().forEach((bubble) => bubble.removeFromParent());

    scoreDisplay.updateScore(0);
    onScoreUpdate(0);

    _spawnInitialWord();
  }
}
