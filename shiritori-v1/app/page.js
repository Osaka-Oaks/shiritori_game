"use client";
// app/page.js — create a room or join with a code.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

// Room codes skip lookalike characters (0/O, 1/I/L).
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateCode() {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function createRoom() {
    if (!name.trim()) return setError("Enter your name first.");
    setBusy(true);
    setError("");
    try {
      const code = generateCode();
      await setDoc(doc(db, "rooms", code), {
        players: [name.trim()],
        currentTurn: name.trim(),
        lastKana: null,
        status: "waiting", // waiting → active → ended
        loser: null,
        createdAt: serverTimestamp(),
      });
      router.push(`/room/${code}?name=${encodeURIComponent(name.trim())}`);
    } catch (e) {
      setError("Could not create room. Check your Firebase config.");
      setBusy(false);
    }
  }

  async function joinRoom() {
    if (!name.trim()) return setError("Enter your name first.");
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 4) return setError("Room codes are 4 characters.");
    setBusy(true);
    setError("");
    try {
      const ref = doc(db, "rooms", code);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError(`Room ${code} not found.`);
        setBusy(false);
        return;
      }
      const room = snap.data();
      const alreadyIn = room.players.includes(name.trim());
      if (!alreadyIn && room.players.length >= 2) {
        setError("That room is already full.");
        setBusy(false);
        return;
      }
      if (!alreadyIn) {
        await updateDoc(ref, {
          players: arrayUnion(name.trim()),
          status: "active",
        });
      }
      router.push(`/room/${code}?name=${encodeURIComponent(name.trim())}`);
    } catch (e) {
      setError("Could not join room. Check your Firebase config.");
      setBusy(false);
    }
  }

  return (
    <main className="home">
      <h1 className="title">
        しりとり<span className="title-sub">for two</span>
      </h1>

      <label className="field">
        <span>Your name</span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Jarrel"
          maxLength={20}
        />
      </label>

      <button className="btn primary" onClick={createRoom} disabled={busy}>
        Create room
      </button>

      <div className="divider">or</div>

      <label className="field">
        <span>Room code</span>
        <input
          value={joinCode}
          onChange={e => setJoinCode(e.target.value.toUpperCase())}
          placeholder="ABCD"
          maxLength={4}
          className="code-input"
        />
      </label>

      <button className="btn" onClick={joinRoom} disabled={busy}>
        Join room
      </button>

      {error && <p className="error">{error}</p>}
    </main>
  );
}
