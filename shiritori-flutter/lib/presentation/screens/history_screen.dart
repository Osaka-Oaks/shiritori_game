import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Mock data - replace with Firebase data later
    final historyData = [
      {
        'date': DateTime.now().subtract(const Duration(hours: 2)),
        'score': 450,
        'words': 8,
        'won': true,
      },
      {
        'date': DateTime.now().subtract(const Duration(days: 1)),
        'score': 320,
        'words': 6,
        'won': false,
      },
      {
        'date': DateTime.now().subtract(const Duration(days: 2)),
        'score': 580,
        'words': 11,
        'won': true,
      },
      {
        'date': DateTime.now().subtract(const Duration(days: 3)),
        'score': 290,
        'words': 5,
        'won': false,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Game History',
          style: GoogleFonts.notoSansJp(),
        ),
      ),
      body: historyData.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.history,
                    size: 80,
                    color: colorScheme.outline,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No games played yet',
                    style: theme.textTheme.titleLarge?.copyWith(
                      color: colorScheme.outline,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start playing to see your history!',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.outline,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: historyData.length,
              itemBuilder: (context, index) {
                final game = historyData[index];
                final date = game['date'] as DateTime;
                final score = game['score'] as int;
                final words = game['words'] as int;
                final won = game['won'] as bool;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: InkWell(
                    onTap: () {
                      // Show game details
                      _showGameDetails(context, game);
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: won
                                          ? Colors.green.withOpacity(0.1)
                                          : Colors.red.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      children: [
                                        Icon(
                                          won ? Icons.check_circle : Icons.cancel,
                                          size: 16,
                                          color: won ? Colors.green : Colors.red,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          won ? 'Won' : 'Lost',
                                          style: TextStyle(
                                            color: won ? Colors.green : Colors.red,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                _formatDate(date),
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: colorScheme.outline,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              _StatChip(
                                icon: Icons.stars,
                                label: 'Score',
                                value: '$score',
                                color: colorScheme.primary,
                              ),
                              const SizedBox(width: 12),
                              _StatChip(
                                icon: Icons.text_fields,
                                label: 'Words',
                                value: '$words',
                                color: colorScheme.secondary,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${date.month}/${date.day}/${date.year}';
    }
  }

  void _showGameDetails(BuildContext context, Map<String, dynamic> game) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Game Details'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Score: ${game['score']}'),
            Text('Words: ${game['words']}'),
            Text('Result: ${game['won'] ? 'Won' : 'Lost'}'),
            const SizedBox(height: 8),
            const Text(
              'Full game replay coming soon!',
              style: TextStyle(fontStyle: FontStyle.italic),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatChip({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: color,
                  ),
                ),
                Text(
                  value,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: color,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
