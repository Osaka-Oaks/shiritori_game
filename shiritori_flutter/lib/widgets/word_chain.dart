import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../theme/app_theme.dart';

class WordChain extends StatelessWidget {
  const WordChain({super.key, required this.words, this.mySeat = -1});

  final List<PlayedWord> words;
  final int mySeat;

  @override
  Widget build(BuildContext context) {
    if (words.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Text(
          'No words yet — start the chain! / ことばをはじめよう',
          textAlign: TextAlign.center,
          style: TextStyle(color: AppTheme.muted),
        ),
      );
    }

    return ListView.builder(
      reverse: true,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      itemCount: words.length,
      itemBuilder: (context, i) {
        final w = words[words.length - 1 - i];
        final mine = w.seat == mySeat;
        return Align(
          alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            margin: const EdgeInsets.symmetric(vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            constraints: const BoxConstraints(maxWidth: 280),
            decoration: BoxDecoration(
              color: mine ? const Color(0xFFFFE4EA) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE8D8CC)),
            ),
            child: Column(
              crossAxisAlignment:
                  mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                Text(
                  w.word,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.ink,
                  ),
                ),
                if (w.meaning != null && w.meaning!.isNotEmpty)
                  Text(w.meaning!, style: const TextStyle(color: AppTheme.muted)),
                Text(
                  '→ ${w.kana}',
                  style: const TextStyle(fontSize: 12, color: AppTheme.muted),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
