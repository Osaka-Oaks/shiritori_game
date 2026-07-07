import 'package:flutter/material.dart';

class AppTheme {
  static const seed = Color(0xFFE85D75);
  static const bg = Color(0xFFFFF8F3);
  static const card = Colors.white;
  static const ink = Color(0xFF2D1F14);
  static const muted = Color(0xFF8A7568);

  static ThemeData light() {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: seed,
        brightness: Brightness.light,
        surface: bg,
      ),
      scaffoldBackgroundColor: bg,
      fontFamily: 'sans-serif',
    );
    return base.copyWith(
      appBarTheme: const AppBarTheme(
        backgroundColor: bg,
        foregroundColor: ink,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
    );
  }
}
