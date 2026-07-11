import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_cube/flutter_cube.dart';
import 'package:go_router/go_router.dart';

/// 3D Visualization of Shiritori word chain
class Game3DScreen extends StatefulWidget {
  const Game3DScreen({super.key});

  @override
  State<Game3DScreen> createState() => _Game3DScreenState();
}

class _Game3DScreenState extends State<Game3DScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<String> wordChain = ['いぬ', 'ぬま', 'まち', 'ちず', 'ずし'];
  int selectedIndex = -1;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('3D Word Chain'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // 3D Visualization
          Expanded(
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Theme.of(context).colorScheme.primaryContainer,
                    Theme.of(context).colorScheme.secondaryContainer,
                  ],
                ),
              ),
              child: AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  return CustomPaint(
                    painter: _Word3DChainPainter(
                      progress: _controller.value,
                      words: wordChain,
                      selectedIndex: selectedIndex,
                    ),
                    size: Size.infinite,
                  );
                },
              ),
            ),
          ),

          // Word List
          Expanded(
            flex: 2,
            child: Container(
              color: Theme.of(context).colorScheme.surface,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'Shiritori Word Chain',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemCount: wordChain.length,
                      itemBuilder: (context, index) {
                        final isSelected = selectedIndex == index;
                        return ListTile(
                          leading: CircleAvatar(
                            backgroundColor: isSelected
                                ? Theme.of(context).colorScheme.primary
                                : Theme.of(context).colorScheme.primaryContainer,
                            child: Text(
                              '${index + 1}',
                              style: TextStyle(
                                color: isSelected
                                    ? Theme.of(context).colorScheme.onPrimary
                                    : Theme.of(context).colorScheme.onPrimaryContainer,
                              ),
                            ),
                          ),
                          title: Text(
                            wordChain[index],
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          subtitle: Text(
                            _getRomaji(wordChain[index]),
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          selected: isSelected,
                          selectedTileColor:
                              Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
                          onTap: () {
                            setState(() {
                              selectedIndex = index;
                            });
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            heroTag: 'add',
            onPressed: _showAddWordDialog,
            child: const Icon(Icons.add),
          ),
          const SizedBox(height: 16),
          FloatingActionButton(
            heroTag: 'reset',
            onPressed: _resetChain,
            child: const Icon(Icons.refresh),
          ),
        ],
      ),
    );
  }

  String _getRomaji(String word) {
    // Simple romaji conversion (would be more complex in real implementation)
    const Map<String, String> romajiMap = {
      'いぬ': 'inu',
      'ぬま': 'numa',
      'まち': 'machi',
      'ちず': 'chizu',
      'ずし': 'zushi',
    };
    return romajiMap[word] ?? word;
  }

  void _showAddWordDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Word'),
        content: const Text('3D word chain feature - add new word to continue the chain'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              // Add word logic
              Navigator.pop(context);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _resetChain() {
    setState(() {
      selectedIndex = -1;
    });
  }
}

/// Custom painter for 3D word chain visualization
class _Word3DChainPainter extends CustomPainter {
  _Word3DChainPainter({
    required this.progress,
    required this.words,
    required this.selectedIndex,
  });

  final double progress;
  final List<String> words;
  final int selectedIndex;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) * 0.3;

    // Draw 3D chain effect
    for (int i = 0; i < words.length; i++) {
      final angle = (2 * math.pi * i / words.length) + (progress * 2 * math.pi);
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle) * 0.5; // Flatten for 3D effect
      final z = math.sin(angle) * 0.5 + 0.5; // Depth

      final isSelected = i == selectedIndex;
      final size = 60.0 * (0.5 + z * 0.5) * (isSelected ? 1.3 : 1.0);

      // Draw connection line
      if (i > 0) {
        final prevAngle = (2 * math.pi * (i - 1) / words.length) + (progress * 2 * math.pi);
        final prevX = center.dx + radius * math.cos(prevAngle);
        final prevY = center.dy + radius * math.sin(prevAngle) * 0.5;

        final linePaint = Paint()
          ..color = Colors.white.withOpacity(0.3)
          ..strokeWidth = 3
          ..style = PaintingStyle.stroke;

        canvas.drawLine(Offset(prevX, prevY), Offset(x, y), linePaint);
      }

      // Draw circle (word node)
      final paint = Paint()
        ..color = isSelected
            ? Colors.amber.withOpacity(0.8)
            : Colors.blue.withOpacity(0.5 + z * 0.3)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), size / 2, paint);

      // Draw border
      final borderPaint = Paint()
        ..color = Colors.white
        ..strokeWidth = 3
        ..style = PaintingStyle.stroke;

      canvas.drawCircle(Offset(x, y), size / 2, borderPaint);

      // Draw text
      final textPainter = TextPainter(
        text: TextSpan(
          text: words[i],
          style: TextStyle(
            color: Colors.white,
            fontSize: 20 * (0.5 + z * 0.5),
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      );

      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(
          x - textPainter.width / 2,
          y - textPainter.height / 2,
        ),
      );
    }
  }

  @override
  bool shouldRepaint(_Word3DChainPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.selectedIndex != selectedIndex;
  }
}
