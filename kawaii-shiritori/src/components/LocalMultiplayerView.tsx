import React from "react";
import { PlayerProfile } from "../types";
import { Bluetooth, Wifi, Smartphone, Users, Mic, X, Check, Loader2, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LocalMultiplayerViewProps {
  profile: PlayerProfile;
  onBack: () => void;
}

type ConnectionMethod = "bluetooth" | "wifi" | "nearby";
type ConnectionStatus = "idle" | "scanning" | "connecting" | "connected" | "failed";

interface NearbyDevice {
  id: string;
  name: string;
  distance: "near" | "medium" | "far";
}

export default function LocalMultiplayerView({ profile, onBack }: LocalMultiplayerViewProps) {
  const [connectionMethod, setConnectionMethod] = React.useState<ConnectionMethod>("nearby");
  const [status, setStatus] = React.useState<ConnectionStatus>("idle");
  const [nearbyDevices, setNearbyDevices] = React.useState<NearbyDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = React.useState<NearbyDevice | null>(null);
  const [error, setError] = React.useState<string>("");

  // Check browser support
  const hasBluetoothSupport = typeof navigator !== "undefined" && "bluetooth" in navigator;
  const hasWebRTCSupport = typeof RTCPeerConnection !== "undefined";

  const handleStartScan = async (method: ConnectionMethod) => {
    setStatus("scanning");
    setError("");
    setConnectionMethod(method);

    try {
      if (method === "bluetooth" && hasBluetoothSupport) {
        await scanBluetoothDevices();
      } else if (method === "wifi" || method === "nearby") {
        // Use WebRTC for peer-to-peer WiFi connection
        await scanNearbyDevices();
      } else {
        setError("This connection method is not supported on your device.");
        setStatus("failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to scan for devices");
      setStatus("failed");
    }
  };

  const scanBluetoothDevices = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });

      setNearbyDevices([
        {
          id: device.id,
          name: device.name || "Unknown Device",
          distance: "near",
        },
      ]);
      setStatus("idle");
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        setError("No devices found. Make sure Bluetooth is enabled.");
      } else {
        setError(err.message);
      }
      setStatus("failed");
    }
  };

  const scanNearbyDevices = async () => {
    // Simulate WebRTC peer discovery
    // In production, use a signaling server or QR code pairing
    setTimeout(() => {
      setNearbyDevices([
        { id: "peer1", name: "Sarah's iPhone", distance: "near" },
        { id: "peer2", name: "Mike's Pixel", distance: "medium" },
        { id: "peer3", name: "Emma's Galaxy", distance: "far" },
      ]);
      setStatus("idle");
    }, 2000);
  };

  const handleConnectToDevice = async (device: NearbyDevice) => {
    setStatus("connecting");
    setError("");

    try {
      // Simulate connection establishment
      setTimeout(() => {
        setConnectedDevice(device);
        setStatus("connected");
      }, 1500);
    } catch (err: any) {
      setError("Failed to connect to device");
      setStatus("failed");
    }
  };

  const handleDisconnect = () => {
    setConnectedDevice(null);
    setStatus("idle");
    setNearbyDevices([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Smartphone className="w-8 h-8 text-primary" />
          <h1 className="font-headline font-black text-3xl text-primary">Local Play</h1>
        </div>
        <p className="text-sm text-on-surface-variant font-body">
          Play face-to-face using your phone's wireless tech
        </p>
      </header>

      {/* Connection Status */}
      {status === "connected" && connectedDevice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-secondary-container/20 border-2 border-secondary rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-secondary">Connected!</h3>
                <p className="text-xs text-on-surface-variant">{connectedDevice.name}</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="p-2 rounded-lg bg-surface border border-outline-variant/20 hover:bg-error/10 hover:border-error transition-all"
            >
              <X className="w-5 h-5 text-error" />
            </button>
          </div>

          <button className="w-full bg-secondary text-on-secondary font-headline font-bold py-4 px-6 rounded-xl shadow-md hover:bg-opacity-90 transition-all">
            Start Local Game
          </button>
        </motion.div>
      )}

      {/* Connection Method Selection */}
      {status === "idle" && !connectedDevice && (
        <>
          <section className="space-y-3">
            <h3 className="font-headline font-bold text-base text-on-surface">
              Choose Connection Method
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {/* Nearby Share (WiFi Direct / WebRTC) */}
              <button
                onClick={() => handleStartScan("nearby")}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  connectionMethod === "nearby"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface-container hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                      Nearby Share
                      <span className="text-xs bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold">
                        Recommended
                      </span>
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Find players nearby using WiFi Direct
                    </p>
                    {hasWebRTCSupport && (
                      <span className="text-xs text-secondary font-bold mt-1 inline-block">
                        ✓ Supported
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Bluetooth */}
              <button
                onClick={() => handleStartScan("bluetooth")}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  connectionMethod === "bluetooth"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface-container hover:border-primary/40"
                }`}
                disabled={!hasBluetoothSupport}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${hasBluetoothSupport ? "bg-blue-500/10" : "bg-outline/10"} flex items-center justify-center`}
                  >
                    <Bluetooth
                      className={`w-6 h-6 ${hasBluetoothSupport ? "text-blue-500" : "text-outline"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-base text-on-surface">Bluetooth</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Connect via Bluetooth Low Energy
                    </p>
                    {hasBluetoothSupport ? (
                      <span className="text-xs text-secondary font-bold mt-1 inline-block">
                        ✓ Supported
                      </span>
                    ) : (
                      <span className="text-xs text-error font-bold mt-1 inline-block">
                        ✗ Not Available
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* WiFi (QR Code) */}
              <button
                onClick={() => handleStartScan("wifi")}
                className={`p-5 rounded-2xl border-2 transition-all text-left ${
                  connectionMethod === "wifi"
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/20 bg-surface-container hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-tertiary-container" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-headline font-bold text-base text-on-surface">
                      WiFi Direct
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Scan QR code to join game
                    </p>
                    <span className="text-xs text-secondary font-bold mt-1 inline-block">
                      ✓ Always Available
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </section>

          <button
            onClick={onBack}
            className="w-full bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-3 px-4 rounded-xl hover:border-primary/40 transition-all"
          >
            Back
          </button>
        </>
      )}

      {/* Scanning State */}
      {status === "scanning" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-container rounded-2xl p-8 text-center space-y-4 border border-primary/20"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Scanning for devices...
            </h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Make sure nearby players have the game open
            </p>
          </div>
        </motion.div>
      )}

      {/* Nearby Devices List */}
      {status === "idle" && nearbyDevices.length > 0 && !connectedDevice && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Nearby Players ({nearbyDevices.length})
            </h3>
            <button
              onClick={() => handleStartScan(connectionMethod)}
              className="text-xs text-primary font-bold hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-2">
            {nearbyDevices.map(device => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {device.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        {device.distance === "near" && "📶 Very close"}
                        {device.distance === "medium" && "📶 Nearby"}
                        {device.distance === "far" && "📶 Far away"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnectToDevice(device)}
                    className="bg-primary text-on-primary font-body font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all text-sm"
                  >
                    Connect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Connecting State */}
      {status === "connecting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-container rounded-2xl p-8 text-center space-y-4 border border-primary/20"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Connecting...</h3>
            <p className="text-sm text-on-surface-variant mt-2">Establishing secure connection</p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-container/20 border-2 border-error rounded-2xl p-4 flex items-start gap-3"
        >
          <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-headline font-bold text-sm text-error">Connection Error</h4>
            <p className="text-xs text-on-error-container mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="p-1 hover:bg-error/10 rounded transition-all"
          >
            <X className="w-4 h-4 text-error" />
          </button>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-surface-container rounded-2xl p-4 border border-primary/10 space-y-2">
        <p className="text-xs font-label-caps text-primary font-bold">📱 HOW IT WORKS</p>
        <ul className="space-y-1 text-xs text-on-surface-variant font-body">
          <li>• Both players open the app on their phones</li>
          <li>• One player starts scanning for nearby devices</li>
          <li>• Other player appears in the list automatically</li>
          <li>• Tap "Connect" to start playing together!</li>
        </ul>
      </div>
    </div>
  );
}
