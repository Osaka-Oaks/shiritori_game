import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

class GameScreen extends ConsumerStatefulWidget {
  const GameScreen({super.key});

  @override
  ConsumerState<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends ConsumerState<GameScreen> {
  final TextEditingController _wordController = TextEditingController();
  final List<String> _wordChain = [];
  int _score = 0;
  String? _errorMessage;

  @override
  void dispose() {
    _wordController.dispose();
    super.dispose();
  }

  void _submitWord() {
    final word = _wordController.text.trim();
    
    if (word.isEmpty) {
      setState(() => _errorMessage = 'Please enter a word');
      return;
    }

    // Basic shiritori validation
    if (_wordChain.isNotEmpty) {
      final lastWord = _wordChain.last;
      final lastChar = lastWord[lastWord.length - 1];
      final firstChar = word[0];
      
      if (lastChar != firstChar) {
        setState(() {
          _errorMessage = 'Word must start with: $lastChar';
        });
        return;
      }
    }

    // Check for ん ending (losing condition)
    if (word.endsWith('ん')) {
      setState(() {
        _errorMessage = 'Word ends with ん - Game Over!';
      });
      _showGameOver();
      return;
    }

    // Add word to chain
    setState(() {
      _wordChain.add(word);
      _score += word.length * 10;
      _errorMessage = null;
    });

    _wordController.clear();
  }

  void _showGameOver() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Game Over'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Final Score: $_score'),
            const SizedBox(height: 8),
            Text('Words played: ${_wordChain.length}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _resetGame();
            },
            child: const Text('Play Again'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Home'),
          ),
        ],
      ),
    );
  }

  void _resetGame() {
    setState(() {
      _wordChain.clear();
      _score = 0;
      _errorMessage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Shiritori Game',
          style: GoogleFonts.notoSansJp(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _resetGame,
            tooltip: 'Reset Game',
          ),
        ],
      ),
      body: Column(
        children: [
          // Score Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            color: colorScheme.primaryContainer,
            child: Column(
              children: [
                Text(
                  'Score',
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: colorScheme.onPrimaryContainer,
                  ),
                ),
                Text(
                  '$_score',
                  style: theme.textTheme.displayMedium?.copyWith(
                    color: colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '${_wordChain.length} words',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onPrimaryContainer.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),

          // Word Chain
          Expanded(
            child: _wordChain.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.edit_note,
                          size: 80,
                          color: colorScheme.outline,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Start the word chain!',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: colorScheme.outline,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Enter any Japanese word to begin',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.outline,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _wordChain.length,
                    itemBuilder: (context, index) {
                      final word = _wordChain[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: colorScheme.secondaryContainer,
                            child: Text(
                              '${index + 1}',
                              style: TextStyle(
                                color: colorScheme.onSecondaryContainer,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          title: Text(
                            word,
                            style: GoogleFonts.notoSansJp(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Text(
                            '+${word.length * 10} points',
                            style: TextStyle(
                              color: colorScheme.primary,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),

          // Input Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_errorMessage != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.error_outline,
                            color: colorScheme.onErrorContainer,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: TextStyle(
                                color: colorScheme.onErrorContainer,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _wordController,
                          style: GoogleFonts.notoSansJp(fontSize: 18),
                          decoration: InputDecoration(
                            hintText: _wordChain.isEmpty
                                ? 'Enter a word...'
                                : 'Start with: ${_wordChain.last[_wordChain.last.length - 1]}',
                            hintStyle: GoogleFonts.notoSansJp(),
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.text_fields),
                          ),
                          onSubmitted: (_) => _submitWord(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      FilledButton.icon(
                        onPressed: _submitWord,
                        icon: const Icon(Icons.send),
                        label: const Text('Submit'),
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
