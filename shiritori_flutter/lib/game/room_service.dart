import 'dart:async';
import 'dart:math';

import 'package:firebase_database/firebase_database.dart';

import '../models/game_models.dart';
import 'shiritori_rules.dart';

const _codeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const _timeoutGraceMs = 2000;

final _db = FirebaseDatabase.instance.ref();

DatabaseReference _gameRef(String code) => _db.child('games/$code');

String _randomCode([int len = 4]) {
  final rng = Random();
  return List.generate(len, (_) => _codeChars[rng.nextInt(_codeChars.length)]).join();
}

GameState _normalize(String code, Map<dynamic, dynamic> raw) {
  final wordsRaw = raw['words'];
  final words = <PlayedWord>[];
  if (wordsRaw is List) {
    for (final w in wordsRaw) {
      if (w is Map) words.add(PlayedWord.fromJson(w));
    }
  }

  final seats = <String, String>{};
  final seatsRaw = raw['seats'];
  if (seatsRaw is Map) {
    seatsRaw.forEach((k, v) => seats['$k'] = '$v');
  }

  final names = <String, String>{};
  final namesRaw = raw['names'];
  if (namesRaw is Map) {
    namesRaw.forEach((k, v) => names['$k'] = '$v');
  }

  final rematch = <String, bool>{};
  final rematchRaw = raw['rematch'];
  if (rematchRaw is Map) {
    rematchRaw.forEach((k, v) => rematch['$k'] = v == true);
  }

  final statusStr = raw['status'] as String? ?? 'waiting';
  final status = GameStatus.values.firstWhere(
    (s) => s.name == statusStr,
    orElse: () => GameStatus.waiting,
  );

  return GameState(
    code: code,
    status: status,
    createdAt: raw['createdAt'] is int ? raw['createdAt'] as int : 0,
    hostUid: raw['hostUid'] as String? ?? '',
    seats: seats,
    names: names,
    turn: raw['turn'] as int? ?? 0,
    startSeat: raw['startSeat'] as int? ?? 0,
    currentKana: raw['currentKana'] as String?,
    timeLimit: raw['timeLimit'] as int? ?? 30,
    turnStartedAt: raw['turnStartedAt'] as int? ?? 0,
    settings: RuleSettings.fromJson(raw['settings'] as Map<dynamic, dynamic>?),
    words: words,
    winnerSeat: raw['winnerSeat'] as int?,
    loserSeat: raw['loserSeat'] as int?,
    loseReasonCode: raw['loseReasonCode'] as String?,
    loseWord: raw['loseWord'] as String?,
    rematch: rematch,
  );
}

List<String> _usedWords(GameState state) =>
    state.words.map((w) => w.word).toList();

class JoinResult {
  const JoinResult.ok(this.seat) : ok = true, reason = null;
  const JoinResult.err(this.reason) : ok = false, seat = -1;
  final bool ok;
  final int seat;
  final String? reason;
}

Future<String> createRoom(
  String uid,
  String name,
  int timeLimit,
  RuleSettings settings,
) async {
  for (var attempt = 0; attempt < 6; attempt++) {
    final code = _randomCode();
    final snap = await _gameRef(code).get();
    if (snap.exists) continue;

    await _gameRef(code).set({
      'code': code,
      'status': 'waiting',
      'createdAt': ServerValue.timestamp,
      'hostUid': uid,
      'seats': {'0': uid},
      'names': {'0': name.isEmpty ? 'Player 1' : name},
      'turn': 0,
      'startSeat': 0,
      'currentKana': null,
      'timeLimit': timeLimit,
      'turnStartedAt': 0,
      'settings': settings.toJson(),
      'words': <dynamic>[],
      'winnerSeat': null,
      'loserSeat': null,
      'loseReasonCode': null,
      'loseWord': null,
      'rematch': <String, dynamic>{},
    });
    return code;
  }
  throw StateError('Could not allocate a room code. Please try again.');
}

Future<JoinResult> joinRoom(String uid, String name, String rawCode) async {
  final code = rawCode.trim().toUpperCase();
  if (code.isEmpty) return const JoinResult.err('Enter a room code.');

  final snap = await _gameRef(code).get();
  if (!snap.exists) return JoinResult.err('No room "$code" found.');

  JoinResult result = const JoinResult.err('Room is full.');

  await _gameRef(code).runTransaction((mutable) {
    if (mutable == null) return Transaction.abort();
    final raw = Map<dynamic, dynamic>.from(mutable as Map);

    if (raw['seats']?['0'] == uid) {
      result = JoinResult.ok(0);
      return Transaction.success(raw);
    }
    if (raw['seats']?['1'] == uid) {
      result = JoinResult.ok(1);
      return Transaction.success(raw);
    }
    if (raw['seats']?['1'] != null) {
      return Transaction.abort();
    }

    raw['seats'] = {...Map<String, dynamic>.from(raw['seats'] as Map? ?? {}), '1': uid};
    raw['names'] = {
      ...Map<String, dynamic>.from(raw['names'] as Map? ?? {}),
      '1': name.isEmpty ? 'Player 2' : name,
    };
    raw['status'] = 'playing';
    raw['turn'] = raw['startSeat'] ?? 0;
    raw['turnStartedAt'] = DateTime.now().millisecondsSinceEpoch;
    result = const JoinResult.ok(1);
    return Transaction.success(raw);
  });

  return result;
}

StreamSubscription<DatabaseEvent> subscribeRoom(
  String code,
  void Function(GameState? state) onData,
) {
  return _gameRef(code).onValue.listen((event) {
    if (!event.snapshot.exists) {
      onData(null);
      return;
    }
    final val = event.snapshot.value;
    if (val is Map) {
      onData(_normalize(code, val));
    } else {
      onData(null);
    }
  });
}

class PlayResult {
  const PlayResult.ok() : ok = true, reason = null;
  const PlayResult.err(this.reason) : ok = false;
  final bool ok;
  final String? reason;
}

Future<PlayResult> playWord(
  GameState state,
  String uid,
  String rawWord, {
  String? meaning,
}) async {
  final seat = state.seatOf(uid);
  if (seat == -1) return const PlayResult.err("You're not in this game.");
  if (state.status != GameStatus.playing) {
    return const PlayResult.err("Game isn't active.");
  }
  if (state.turn != seat) return const PlayResult.err('Not your turn yet.');

  final check = validateMove(
    rawWord,
    state.currentKana,
    _usedWords(state),
    state.settings,
  );
  if (check is MoveErr) return PlayResult.err(check.reason);

  final ok = check as MoveOk;
  final word = rawWord.trim();
  final now = DateTime.now().millisecondsSinceEpoch;

  await _gameRef(state.code).runTransaction((mutable) {
    if (mutable == null) return Transaction.abort();
    final raw = Map<dynamic, dynamic>.from(mutable as Map);
    if (raw['status'] != 'playing' || raw['turn'] != seat) {
      return Transaction.abort();
    }

    final words = <dynamic>[...(raw['words'] as List<dynamic>? ?? [])];
    words.add({
      'word': word,
      'romaji': '',
      'kana': ok.chainKana,
      'seat': seat,
      'by': uid,
      'ts': now,
      ...? (meaning != null ? {'meaning': meaning} : null),
    });
    raw['words'] = words;

    if (ok.losesByN) {
      raw['status'] = 'finished';
      raw['loserSeat'] = seat;
      raw['winnerSeat'] = seat == 0 ? 1 : 0;
      raw['loseReasonCode'] = 'n';
      raw['loseWord'] = word;
    } else {
      raw['currentKana'] = ok.chainKana;
      raw['turn'] = seat == 0 ? 1 : 0;
      raw['turnStartedAt'] = now;
    }
    return Transaction.success(raw);
  });

  return const PlayResult.ok();
}

Future<void> finalizeTimeout(GameState state) async {
  await _gameRef(state.code).runTransaction((mutable) {
    if (mutable == null) return Transaction.abort();
    final raw = Map<dynamic, dynamic>.from(mutable as Map);
    if (raw['status'] != 'playing') return Transaction.abort();

    final elapsed = DateTime.now().millisecondsSinceEpoch -
        (raw['turnStartedAt'] as int? ?? 0);
    final limit = (raw['timeLimit'] as int? ?? 30) * 1000 + _timeoutGraceMs;
    if (elapsed < limit) return Transaction.abort();

    final loser = raw['turn'] as int? ?? 0;
    raw['status'] = 'finished';
    raw['loserSeat'] = loser;
    raw['winnerSeat'] = loser == 0 ? 1 : 0;
    raw['loseReasonCode'] = 'timeout';
    raw['loseWord'] = null;
    return Transaction.success(raw);
  });
}

Future<void> voteRematch(GameState state, String uid) async {
  final seat = state.seatOf(uid);
  if (seat == -1) return;

  await _gameRef(state.code).runTransaction((mutable) {
    if (mutable == null) return Transaction.abort();
    final raw = Map<dynamic, dynamic>.from(mutable as Map);
    if (raw['status'] != 'finished') return Transaction.abort();

    final rematch = Map<String, dynamic>.from(raw['rematch'] as Map? ?? {});
    rematch['$seat'] = true;
    raw['rematch'] = rematch;

    final bothSeated = raw['seats']?['0'] != null && raw['seats']?['1'] != null;
    if (bothSeated && rematch['0'] == true && rematch['1'] == true) {
      final newStart = (raw['startSeat'] as int? ?? 0) == 0 ? 1 : 0;
      raw['startSeat'] = newStart;
      raw['turn'] = newStart;
      raw['currentKana'] = null;
      raw['words'] = <dynamic>[];
      raw['turnStartedAt'] = DateTime.now().millisecondsSinceEpoch;
      raw['status'] = 'playing';
      raw['winnerSeat'] = null;
      raw['loserSeat'] = null;
      raw['loseReasonCode'] = null;
      raw['loseWord'] = null;
      raw['rematch'] = <String, dynamic>{};
    }
    return Transaction.success(raw);
  });
}
