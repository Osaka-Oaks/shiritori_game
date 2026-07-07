"use client";
// app/room/[roomId]/page.js — the live game.
// Firestore is the source of truth: this page only renders snapshots
// and writes moves. It never trusts local state for whose turn it is.

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { validateWord, getChainKana } from "../../../lib/shiritori";

export default function Room() {
  const { roomId } = useParams();
  const myName = useSearchParams().get("name") || "";

  const [room, setRoom] = useState(null);
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);

  // Live listener on the room document.
  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, "rooms", roomId), snap => {
      if (!snap.exists()) return setMissing(true);
      setRoom(snap.data());
    });
  }, [roomId]);

  // Live listener on the word history, oldest first.
  useEffect(() => {
    if (!roomId) return;
    const q = query(collection(db, "rooms", roomId, "words"), orderBy("createdAt", "asc"));
    return onSnapshot(q, snap => {
      setWords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [roomId]);

  if (missing)
    return (
      <main className="room">
        <p className="error">Room {roomId} doesn’t exist.</p>
      </main>
    );
  if (!room)
    return (
      <main className="room">
        <p className="muted">Connecting…</p>
      </main>
    );

  const myTurn = room.currentTurn === myName;
  const opponent = room.players.find(p => p !== myName) || null;

  async function submitWord() {
    setError("");
    const usedWords = words.map(w => w.word);
    const result = validateWord(input, room.lastKana, usedWords);
    if (!result.ok) return setError(result.reason);

    const word = input.trim();
    // One atomic batch: add the word AND flip the turn together,
    // so the room state can never disagree with the history.
    const batch = writeBatch(db);
    batch.set(doc(collection(db, "rooms", roomId, "words")), {
      player: myName,
      word,
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, "rooms", roomId), {
      lastKana: getChainKana(word),
      currentTurn: opponent,
    });
    try {
      await batch.commit();
      setInput("");
    } catch (e) {
      setError("Couldn’t send that — check your connection.");
    }
  }

  return (
    <main className="room">
      <header className="room-header">
        <span className="room-code">Room {roomId}</span>
        <span className="players">{room.players.join(" × ")}</span>
      </header>

      {room.status === "waiting" && (
        <div className="waiting">
          <p>Share this code with your partner:</p>
          <p className="big-code">{roomId}</p>
          <p className="muted">The game starts when they join.</p>
        </div>
      )}

      {room.status !== "waiting" && (
        <>
          {/* The chain. Each entry highlights its chain kana — the link
              to the next word. This list IS the game. */}
          <ol className="chain">
            {words.map(w => (
              <li key={w.id} className={w.player === myName ? "mine" : "theirs"}>
                <span className="chain-player">{w.player}</span>
                <span className="chain-word">
                  {w.word.slice(0, -1)}
                  <em className="chain-kana">{w.word.slice(-1)}</em>
                </span>
              </li>
            ))}
            {words.length === 0 && (
              <li className="muted empty">No words yet — any word starts the chain.</li>
            )}
          </ol>

          <section className="play-area">
            {room.lastKana && (
              <p className="next-kana">
                next: <strong>{room.lastKana}</strong>〜
              </p>
            )}
            {myTurn ? (
              <div className="input-row">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitWord()}
                  placeholder={room.lastKana ? `${room.lastKana}…` : "ことば"}
                  lang="ja"
                  autoFocus
                />
                <button className="btn primary" onClick={submitWord}>
                  Play
                </button>
              </div>
            ) : (
              <p className="muted waiting-turn">Waiting for {room.currentTurn}…</p>
            )}
            {error && <p className="error">{error}</p>}
          </section>
        </>
      )}
    </main>
  );
}
