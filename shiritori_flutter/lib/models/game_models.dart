// Shared game types — mirrors shiritori-online/src/types.ts.
library;

enum GameStatus { waiting, playing, finished }

class RuleSettings {
  const RuleSettings({
    this.smallKanaLenient = true,
    this.dakutenLenient = false,
  });

  final bool smallKanaLenient;
  final bool dakutenLenient;

  static const defaults = RuleSettings();

  Map<String, dynamic> toJson() => {
        'smallKanaLenient': smallKanaLenient,
        'dakutenLenient': dakutenLenient,
      };

  factory RuleSettings.fromJson(Map<dynamic, dynamic>? json) {
    if (json == null) return RuleSettings.defaults;
    return RuleSettings(
      smallKanaLenient: json['smallKanaLenient'] as bool? ?? true,
      dakutenLenient: json['dakutenLenient'] as bool? ?? false,
    );
  }
}

class PlayedWord {
  const PlayedWord({
    required this.word,
    required this.romaji,
    required this.kana,
    required this.seat,
    required this.by,
    required this.ts,
    this.meaning,
  });

  final String word;
  final String romaji;
  final String kana;
  final int seat;
  final String by;
  final int ts;
  final String? meaning;

  Map<String, dynamic> toJson() => {
        'word': word,
        'romaji': romaji,
        'kana': kana,
        'seat': seat,
        'by': by,
        'ts': ts,
        if (meaning != null) 'meaning': meaning,
      };

  factory PlayedWord.fromJson(Map<dynamic, dynamic> json) => PlayedWord(
        word: json['word'] as String? ?? '',
        romaji: json['romaji'] as String? ?? '',
        kana: json['kana'] as String? ?? '',
        seat: json['seat'] as int? ?? 0,
        by: json['by'] as String? ?? '',
        ts: json['ts'] as int? ?? 0,
        meaning: json['meaning'] as String?,
      );
}

class GameState {
  const GameState({
    required this.code,
    required this.status,
    required this.createdAt,
    required this.hostUid,
    required this.seats,
    required this.names,
    required this.turn,
    required this.startSeat,
    required this.currentKana,
    required this.timeLimit,
    required this.turnStartedAt,
    required this.settings,
    required this.words,
    required this.winnerSeat,
    required this.loserSeat,
    required this.loseReasonCode,
    required this.loseWord,
    required this.rematch,
  });

  final String code;
  final GameStatus status;
  final int createdAt;
  final String hostUid;
  final Map<String, String> seats;
  final Map<String, String> names;
  final int turn;
  final int startSeat;
  final String? currentKana;
  final int timeLimit;
  final int turnStartedAt;
  final RuleSettings settings;
  final List<PlayedWord> words;
  final int? winnerSeat;
  final int? loserSeat;
  final String? loseReasonCode;
  final String? loseWord;
  final Map<String, bool> rematch;

  int seatOf(String uid) {
    if (seats['0'] == uid) return 0;
    if (seats['1'] == uid) return 1;
    return -1;
  }

  String nameOf(int seat) => names['$seat'] ?? 'Player ${seat + 1}';
}
