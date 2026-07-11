import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

/// Enhanced home screen with 2D/3D game mode selection
class EnhancedHomeScreen extends StatelessWidget {
  const EnhancedHomeScreen({super.key, required this.uid});

  final String uid;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).colorScheme.primaryContainer,
              Theme.of(context).colorScheme.secondaryContainer,
              Theme.of(context).colorScheme.tertiaryContainer,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 40),
              
              // Title
              Text(
                'しりとり',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onPrimaryContainer,
                  fontWeight: FontWeight.bold,
                ),
              )
                  .animate()
                  .fadeIn(duration: 600.ms)
                  .scale(delay: 200.ms, duration: 400.ms),
              
              const SizedBox(height: 8),
              
              Text(
                'Shiritori Word Chain Game',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onPrimaryContainer.withOpacity(0.8),
                ),
              )
                  .animate()
                  .fadeIn(delay: 300.ms, duration: 600.ms),
              
              const SizedBox(height: 60),
              
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: GridView.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    children: [
                      _GameModeCard(
                        title: '2D Game',
                        subtitle: 'Catch falling words',
                        icon: Icons.videogame_asset,
                        gradient: [Colors.blue, Colors.purple],
                        onTap: () => context.go('/game-2d'),
                      )
                          .animate()
                          .fadeIn(delay: 400.ms)
                          .slideX(begin: -0.2, end: 0),
                      
                      _GameModeCard(
                        title: '3D Visualization',
                        subtitle: 'Word chain in 3D',
                        icon: Icons.view_in_ar,
                        gradient: [Colors.purple, Colors.pink],
                        onTap: () => context.go('/game-3d'),
                      )
                          .animate()
                          .fadeIn(delay: 500.ms)
                          .slideX(begin: 0.2, end: 0),
                      
                      _GameModeCard(
                        title: 'Classic',
                        subtitle: 'Traditional game',
                        icon: Icons.text_fields,
                        gradient: [Colors.green, Colors.teal],
                        onTap: () => context.go('/solo'),
                      )
                          .animate()
                          .fadeIn(delay: 600.ms)
                          .slideX(begin: -0.2, end: 0),
                      
                      _GameModeCard(
                        title: 'Multiplayer',
                        subtitle: 'Play with friends',
                        icon: Icons.people,
                        gradient: [Colors.orange, Colors.red],
                        onTap: () {
                          // Show multiplayer options
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Multiplayer'),
                              content: const Text('Feature coming soon!'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('OK'),
                                ),
                              ],
                            ),
                          );
                        },
                      )
                          .animate()
                          .fadeIn(delay: 700.ms)
                          .slideX(begin: 0.2, end: 0),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GameModeCard extends StatelessWidget {
  const _GameModeCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.gradient,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final List<Color> gradient;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: gradient,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  size: 48,
                  color: Colors.white,
                ),
                const SizedBox(height: 16),
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
