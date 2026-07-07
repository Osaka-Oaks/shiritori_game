import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';
import 'firebase_options.dart';

// Screens
import 'presentation/screens/home_screen.dart';
import 'presentation/screens/game_screen.dart';
import 'presentation/screens/leaderboard_screen.dart';
import 'presentation/screens/history_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
    const ProviderScope(
      child: ShiritoriApp(),
    ),
  );
}

class ShiritoriApp extends StatelessWidget {
  const ShiritoriApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shiritori Game',
      debugShowCheckedModeBanner: false,
      
      // Theme
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6750A4),
          brightness: Brightness.light,
        ),
        textTheme: GoogleFonts.robotoTextTheme(),
      ),
      
      // Dark Theme
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6750A4),
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.robotoTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      
      // Theme Mode
      themeMode: ThemeMode.system,
      
      // Initial Route
      home: const HomeScreen(),
      
      // Routes
      routes: {
        '/home': (context) => const HomeScreen(),
        '/game': (context) => const GameScreen(),
        '/leaderboard': (context) => const LeaderboardScreen(),
        '/history': (context) => const HistoryScreen(),
      },
    );
  }
}
