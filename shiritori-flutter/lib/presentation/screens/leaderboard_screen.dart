import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

class LeaderboardScreen extends ConsumerWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Mock data - replace with Firebase data later
    final leaderboardData = [
      {'rank': 1, 'name': 'Player 1', 'score': 1500, 'wins': 25},
      {'rank': 2, 'name': 'Player 2', 'score': 1200, 'wins': 20},
      {'rank': 3, 'name': 'Player 3', 'score': 1000, 'wins': 18},
      {'rank': 4, 'name': 'Player 4', 'score': 800, 'wins': 15},
      {'rank': 5, 'name': 'Player 5', 'score': 600, 'wins': 12},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Leaderboard',
          style: GoogleFonts.notoSansJp(),
        ),
      ),
      body: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  colorScheme.primary,
                  colorScheme.secondary,
                ],
              ),
            ),
            child: Column(
              children: [
                Icon(
                  Icons.emoji_events,
                  size: 60,
                  color: colorScheme.onPrimary,
                ),
                const SizedBox(height: 8),
                Text(
                  'Top Players',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    color: colorScheme.onPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Compete for the top spot!',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onPrimary.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),

          // Leaderboard List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: leaderboardData.length,
              itemBuilder: (context, index) {
                final player = leaderboardData[index];
                final rank = player['rank'] as int;
                
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    leading: _RankBadge(rank: rank),
                    title: Text(
                      player['name'] as String,
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Text(
                      '${player['wins']} wins',
                      style: theme.textTheme.bodyMedium,
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '${player['score']}',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'points',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: colorScheme.outline,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _RankBadge extends StatelessWidget {
  final int rank;

  const _RankBadge({required this.rank});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    Color getColor() {
      switch (rank) {
        case 1:
          return const Color(0xFFFFD700); // Gold
        case 2:
          return const Color(0xFFC0C0C0); // Silver
        case 3:
          return const Color(0xFFCD7F32); // Bronze
        default:
          return colorScheme.secondaryContainer;
      }
    }

    IconData getIcon() {
      switch (rank) {
        case 1:
          return Icons.emoji_events;
        case 2:
          return Icons.emoji_events_outlined;
        case 3:
          return Icons.military_tech;
        default:
          return Icons.person;
      }
    }

    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: getColor(),
        shape: BoxShape.circle,
        boxShadow: rank <= 3
            ? [
                BoxShadow(
                  color: getColor().withOpacity(0.4),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
      child: Center(
        child: rank <= 3
            ? Icon(
                getIcon(),
                color: Colors.white,
                size: 24,
              )
            : Text(
                '$rank',
                style: TextStyle(
                  color: colorScheme.onSecondaryContainer,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
      ),
    );
  }
}
