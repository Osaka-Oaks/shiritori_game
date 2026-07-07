import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colorScheme.primary.withOpacity(0.1),
              colorScheme.secondary.withOpacity(0.1),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Title
                  const Text(
                    '🎮',
                    style: TextStyle(fontSize: 80),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Shiritori',
                    style: GoogleFonts.notoSansJp(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'しりとり',
                    style: GoogleFonts.notoSansJp(
                      fontSize: 32,
                      color: colorScheme.secondary,
                    ),
                  ),
                  const SizedBox(height: 48),
                  
                  // Play Button
                  _MenuButton(
                    icon: Icons.play_arrow,
                    label: 'Play Game',
                    subtitle: 'Start a new game',
                    onTap: () {
                      Navigator.pushNamed(context, '/game');
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Leaderboard Button
                  _MenuButton(
                    icon: Icons.leaderboard,
                    label: 'Leaderboard',
                    subtitle: 'View top players',
                    onTap: () {
                      Navigator.pushNamed(context, '/leaderboard');
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // History Button
                  _MenuButton(
                    icon: Icons.history,
                    label: 'Game History',
                    subtitle: 'View past games',
                    onTap: () {
                      Navigator.pushNamed(context, '/history');
                    },
                  ),
                  const SizedBox(height: 48),
                  
                  // Info
                  Text(
                    'Flutter Edition',
                    style: TextStyle(
                      color: colorScheme.onSurface.withOpacity(0.5),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final VoidCallback onTap;

  const _MenuButton({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(20),
          constraints: const BoxConstraints(maxWidth: 400),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  size: 32,
                  color: colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: colorScheme.onSurface.withOpacity(0.3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
