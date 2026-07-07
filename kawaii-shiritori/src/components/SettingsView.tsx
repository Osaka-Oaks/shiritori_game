/**
 * Settings View - Sound effects, performance, and game settings
 */

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Gauge, Zap, Bell, Music } from "lucide-react";
import { soundManager, SoundConfig } from "../lib/soundEffects";
import { performanceOptimizer, usePerformanceMonitor } from "../lib/performanceOptimizer";
import { motion } from "motion/react";

interface SettingsViewProps {
  onBack: () => void;
}

export default function SettingsView({ onBack }: SettingsViewProps) {
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(soundManager.getConfig());
  const metrics = usePerformanceMonitor();
  const [showPerformance, setShowPerformance] = useState(false);

  const updateSoundConfig = () => {
    setSoundConfig(soundManager.getConfig());
  };

  const handleToggleSound = () => {
    soundManager.setEnabled(!soundConfig.enabled);
    updateSoundConfig();
  };

  const handleToggleSoundEffects = () => {
    soundManager.setSoundEffects(!soundConfig.soundEffects);
    updateSoundConfig();
  };

  const handleToggleMusic = () => {
    soundManager.setMusic(!soundConfig.music);
    updateSoundConfig();
  };

  const handleToggleNotifications = () => {
    soundManager.setNotifications(!soundConfig.notifications);
    updateSoundConfig();
  };

  const handleVolumeChange = (value: number) => {
    soundManager.setVolume(value);
    updateSoundConfig();
  };

  const testSound = () => {
    soundManager.play("ding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sound Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                {soundConfig.enabled ? (
                  <Volume2 className="w-6 h-6 text-purple-300" />
                ) : (
                  <VolumeX className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Audio Settings</h2>
                <p className="text-sm text-gray-300">Manage sound effects and volume</p>
              </div>
            </div>

            {/* Master Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div>
                  <div className="font-semibold text-white">Master Audio</div>
                  <div className="text-sm text-gray-300">Enable all sounds</div>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    soundConfig.enabled ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      soundConfig.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="p-4 bg-black/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-white">Volume</div>
                  <div className="text-sm text-gray-300">
                    {Math.round(soundConfig.volume * 100)}%
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soundConfig.volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  disabled={!soundConfig.enabled}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <button
                  onClick={testSound}
                  disabled={!soundConfig.enabled}
                  className="mt-2 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors"
                >
                  Test Sound
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-semibold text-white">Sound Effects</div>
                    <div className="text-sm text-gray-300">Game feedback sounds</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleSoundEffects}
                  disabled={!soundConfig.enabled}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    soundConfig.soundEffects && soundConfig.enabled ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      soundConfig.soundEffects && soundConfig.enabled
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Music */}
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-pink-400" />
                  <div>
                    <div className="font-semibold text-white">Background Music</div>
                    <div className="text-sm text-gray-300">Game background music</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleMusic}
                  disabled={!soundConfig.enabled}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    soundConfig.music && soundConfig.enabled ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      soundConfig.music && soundConfig.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-semibold text-white">Notifications</div>
                    <div className="text-sm text-gray-300">Alert sounds</div>
                  </div>
                </div>
                <button
                  onClick={handleToggleNotifications}
                  disabled={!soundConfig.enabled}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    soundConfig.notifications && soundConfig.enabled
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      soundConfig.notifications && soundConfig.enabled
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Performance Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Gauge className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Performance</h2>
                <p className="text-sm text-gray-300">Real-time metrics</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {/* FPS */}
              <div className="p-4 bg-black/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-300">Frame Rate (FPS)</div>
                  <div
                    className={`text-2xl font-bold ${
                      metrics.fps >= 55
                        ? "text-green-400"
                        : metrics.fps >= 30
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {metrics.fps}
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.fps >= 55
                        ? "bg-green-500"
                        : metrics.fps >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min((metrics.fps / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 bg-black/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-300">Response Time</div>
                  <div
                    className={`text-2xl font-bold ${
                      metrics.responseTime < 50
                        ? "text-green-400"
                        : metrics.responseTime < 100
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {metrics.responseTime.toFixed(0)}ms
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.responseTime < 50
                        ? "bg-green-500"
                        : metrics.responseTime < 100
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max(100 - metrics.responseTime, 0)}%` }}
                  />
                </div>
              </div>

              {/* Render Time */}
              <div className="p-4 bg-black/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-300">Render Time</div>
                  <div
                    className={`text-2xl font-bold ${
                      metrics.renderTime < 16
                        ? "text-green-400"
                        : metrics.renderTime < 33
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {metrics.renderTime.toFixed(1)}ms
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.renderTime < 16
                        ? "bg-green-500"
                        : metrics.renderTime < 33
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max(100 - metrics.renderTime * 3, 0)}%` }}
                  />
                </div>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage !== undefined && (
                <div className="p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-300">Memory Usage</div>
                    <div
                      className={`text-2xl font-bold ${
                        metrics.memoryUsage < 0.7
                          ? "text-green-400"
                          : metrics.memoryUsage < 0.9
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {(metrics.memoryUsage * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.memoryUsage < 0.7
                          ? "bg-green-500"
                          : metrics.memoryUsage < 0.9
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${metrics.memoryUsage * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lag Indicator */}
              <div
                className={`p-4 rounded-xl ${
                  metrics.lag
                    ? "bg-red-500/20 border border-red-500/50"
                    : "bg-green-500/20 border border-green-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold">Status</div>
                  <div className={`font-bold ${metrics.lag ? "text-red-400" : "text-green-400"}`}>
                    {metrics.lag ? "⚠️ Lag Detected" : "✅ Smooth"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-bold text-white mb-4">Performance Tips</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✨ Keep FPS above 30 for smooth gameplay</li>
            <li>⚡ Response time under 100ms ensures no lag</li>
            <li>🎮 Close other tabs to improve performance</li>
            <li>🔊 Disable sounds if experiencing performance issues</li>
            <li>💾 Clear cache periodically to free up memory</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
