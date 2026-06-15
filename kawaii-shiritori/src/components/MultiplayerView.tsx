import React from "react";
import { PlayerProfile, PlayedWord } from "../types";
import { Users, Plus, Copy, Check, Globe, Sparkles, Crown, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GameRoom {
  id: string;
  hostName: string;
  hostAvatar: string;
  players: number;
  maxPlayers: number;
  status: "waiting" | "playing" | "finished";
  difficulty: "casual" | "competitive";
}

interface MultiplayerViewProps {
  profile: PlayerProfile;
  onBack: () => void;
}

export default function MultiplayerView({ profile, onBack }: MultiplayerViewProps) {
  const [view, setView] = React.useState<"lobby" | "create" | "room">("lobby");
  const [rooms, setRooms] = React.useState<GameRoom[]>([]);
  const [roomCode, setRoomCode] = React.useState("");
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState<"casual" | "competitive">("casual");
  const [maxPlayers, setMaxPlayers] = React.useState(2);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    
    const newRoom: GameRoom = {
      id: code,
      hostName: profile.name,
      hostAvatar: profile.avatarUrl,
      players: 1,
      maxPlayers,
      status: "waiting",
      difficulty
    };
    
    setRooms(prev => [...prev, newRoom]);
    setView("room");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinRoom = (room: GameRoom) => {
    setRoomCode(room.id);
    setView("room");
  };

  if (view === "create") {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-8 h-8 text-primary" />
            <h1 className="font-headline font-black text-3xl text-primary">Create Room</h1>
          </div>
          <p className="text-sm text-on-surface-variant font-body">
            Set up your multiplayer Shiritori room
          </p>
        </header>

        <div className="space-y-4 bg-surface-container rounded-3xl p-6 border-2 border-primary/20 shadow-lg">
          <div className="space-y-3">
            <label className="block text-sm font-headline font-bold text-on-surface">
              Room Difficulty
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDifficulty("casual")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  difficulty === "casual"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface hover:border-primary/40"
                }`}
              >
                <Sparkles className="w-6 h-6 text-secondary mb-2 mx-auto" />
                <h3 className="font-headline font-bold text-sm">Casual</h3>
                <p className="text-xs text-on-surface-variant mt-1">Relaxed, fun gameplay</p>
              </button>

              <button
                onClick={() => setDifficulty("competitive")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  difficulty === "competitive"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface hover:border-primary/40"
                }`}
              >
                <Crown className="w-6 h-6 text-tertiary-container mb-2 mx-auto" />
                <h3 className="font-headline font-bold text-sm">Competitive</h3>
                <p className="text-xs text-on-surface-variant mt-1">Fast-paced, timed</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-headline font-bold text-on-surface">
              Max Players
            </label>
            <div className="flex gap-2">
              {[2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`flex-1 py-3 rounded-xl border-2 font-headline font-bold transition-all ${
                    maxPlayers === num
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant/20 bg-surface text-on-surface hover:border-primary/40"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setView("lobby")}
              className="flex-1 bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-3 px-4 rounded-xl hover:border-primary/40 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleCreateRoom}
              className="flex-1 bg-primary text-on-primary font-headline font-bold py-3 px-4 rounded-xl shadow-md hover:bg-opacity-90 transition-all"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "room") {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="font-headline font-black text-3xl text-primary">Room: {roomCode}</h1>
          <p className="text-sm text-on-surface-variant font-body">
            Waiting for players to join...
          </p>
        </header>

        <div className="bg-surface-container rounded-3xl p-6 border-2 border-primary/20 shadow-lg text-center space-y-4">
          <div className="bg-primary/10 rounded-2xl p-6 border-2 border-primary">
            <p className="text-xs font-label-caps text-primary font-bold mb-2">ROOM CODE</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-headline font-black text-primary tracking-wider">
                {roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-primary text-on-primary hover:bg-opacity-90 transition-all"
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Share this code with friends to join!
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Players in Room (1/{maxPlayers})
            </h3>
            
            <div className="bg-surface rounded-2xl p-4 border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 text-left">
                  <p className="font-headline font-bold text-sm text-on-surface flex items-center gap-1">
                    {profile.name}
                    <Crown className="w-4 h-4 text-tertiary-container" />
                  </p>
                  <p className="text-xs text-on-surface-variant">Host</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setView("lobby")}
              className="w-full bg-error text-on-error font-body font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all"
            >
              Leave Room
            </button>
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-4 border border-primary/10">
          <p className="text-xs text-on-surface-variant text-center">
            💡 <strong>Tip:</strong> The game will start automatically when all players are ready!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="font-headline font-black text-3xl text-primary">Multiplayer Lobby</h1>
        </div>
        <p className="text-sm text-on-surface-variant font-body">
          Play Shiritori with friends online!
        </p>
      </header>

      <div className="flex gap-3">
        <button
          onClick={() => setView("create")}
          className="flex-1 bg-primary text-on-primary font-headline font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
        <button
          onClick={onBack}
          className="px-6 bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-4 rounded-xl hover:border-primary/40 transition-all"
        >
          Back
        </button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Available Rooms
          </h2>
          <span className="text-xs text-on-surface-variant font-body">{rooms.length} active</span>
        </div>

        <div className="space-y-3">
          {rooms.length === 0 ? (
            <div className="bg-surface-container rounded-2xl p-8 text-center border border-outline-variant/10">
              <Users className="w-12 h-12 text-outline mx-auto mb-3 opacity-50" />
              <p className="text-sm text-on-surface-variant font-body">
                No rooms available. Create one to get started!
              </p>
            </div>
          ) : (
            rooms.map(room => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container rounded-2xl p-4 border-2 border-outline-variant/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={room.hostAvatar}
                      alt={room.hostName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="text-left">
                      <p className="font-headline font-bold text-sm text-on-surface">
                        {room.hostName}'s Room
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {room.difficulty}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {room.players}/{room.maxPlayers} players
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.players >= room.maxPlayers}
                    className="bg-secondary text-on-secondary font-body font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    {room.players >= room.maxPlayers ? "Full" : "Join"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <div className="bg-surface-container rounded-2xl p-4 border border-primary/10 space-y-2">
        <p className="text-xs font-label-caps text-primary font-bold">🌐 MULTIPLAYER FEATURES</p>
        <ul className="space-y-1 text-xs text-on-surface-variant font-body">
          <li>• Real-time gameplay with friends</li>
          <li>• 2-4 player support</li>
          <li>• Casual or competitive modes</li>
          <li>• Turn-based word chains</li>
        </ul>
      </div>
    </div>
  );
}
