import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/game_2d/game_2d_screen.dart';
import '../../features/game_3d/game_3d_screen.dart';
import '../../screens/home_screen.dart';
import '../../screens/game_room_screen.dart';
import '../../screens/solo_screen.dart';

/// App routing configuration using Go Router
class AppRouter {
  static GoRouter router(String? uid) {
    return GoRouter(
      initialLocation: '/',
      debugLogDiagnostics: true,
      routes: [
        GoRoute(
          path: '/',
          name: 'home',
          builder: (context, state) => HomeScreen(uid: uid ?? ''),
          routes: [
            GoRoute(
              path: 'game-2d',
              name: 'game2d',
              pageBuilder: (context, state) => CustomTransitionPage(
                key: state.pageKey,
                child: const Game2DScreen(),
                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: animation,
                    child: child,
                  );
                },
              ),
            ),
            GoRoute(
              path: 'game-3d',
              name: 'game3d',
              pageBuilder: (context, state) => CustomTransitionPage(
                key: state.pageKey,
                child: const Game3DScreen(),
                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                  return SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(1, 0),
                      end: Offset.zero,
                    ).animate(animation),
                    child: child,
                  );
                },
              ),
            ),
            GoRoute(
              path: 'solo',
              name: 'solo',
              builder: (context, state) => SoloScreen(uid: uid ?? ''),
            ),
            GoRoute(
              path: 'room/:roomId',
              name: 'gameRoom',
              builder: (context, state) {
                final roomId = state.pathParameters['roomId']!;
                return GameRoomScreen(
                  roomId: roomId,
                  uid: uid ?? '',
                );
              },
            ),
          ],
        ),
      ],
      errorBuilder: (context, state) => Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48),
              const SizedBox(height: 16),
              Text('Page not found: ${state.uri}'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
