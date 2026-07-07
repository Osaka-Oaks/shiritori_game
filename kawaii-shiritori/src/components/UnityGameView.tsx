import React from "react";
import { AlertCircle, Download, Loader2, Maximize2 } from "lucide-react";
import { motion } from "motion/react";

interface UnityGameViewProps {
  unityBuildPath?: string;
  onGameEvent?: (eventData: any) => void;
  onBack?: () => void;
}

interface UnityInstance {
  SendMessage: (objectName: string, methodName: string, value: string | number) => void;
  Quit: () => Promise<void>;
}

export default function UnityGameView({
  unityBuildPath = "/unity/Build",
  onGameEvent,
  onBack,
}: UnityGameViewProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [unityInstance, setUnityInstance] = React.useState<UnityInstance | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    loadUnityGame();

    return () => {
      if (unityInstance) {
        unityInstance.Quit().catch(console.error);
      }
    };
  }, []);

  const loadUnityGame = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const script = document.createElement("script");
      script.src = `${unityBuildPath}/shiritori.loader.js`;
      script.async = true;

      script.onload = () => {
        initializeUnity();
      };

      script.onerror = () => {
        setError(
          "Failed to load Unity WebGL build. Make sure the build files exist in public/unity/Build/"
        );
        setIsLoading(false);
      };

      document.body.appendChild(script);
    } catch (err: any) {
      setError(err.message || "Unknown error loading Unity");
      setIsLoading(false);
    }
  };

  const initializeUnity = () => {
    if (!window.createUnityInstance || !canvasRef.current) {
      setError("Unity loader not available");
      setIsLoading(false);
      return;
    }

    const config = {
      dataUrl: `${unityBuildPath}/shiritori.data`,
      frameworkUrl: `${unityBuildPath}/shiritori.framework.js`,
      codeUrl: `${unityBuildPath}/shiritori.wasm`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "KawaiiShiritori",
      productName: "Shiritori Game",
      productVersion: "1.0.0",
    };

    window
      .createUnityInstance(canvasRef.current, config, (progress: number) => {
        setLoadingProgress(Math.round(progress * 100));
      })
      .then((instance: UnityInstance) => {
        setUnityInstance(instance);
        setIsLoading(false);
        console.log("Unity instance loaded successfully");
      })
      .catch((err: Error) => {
        setError(`Unity initialization failed: ${err.message}`);
        setIsLoading(false);
      });
  };

  const sendMessageToUnity = (objectName: string, method: string, value: any) => {
    if (unityInstance) {
      unityInstance.SendMessage(objectName, method, value);
    }
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12 pb-28">
        <div className="bg-error-container/20 border-2 border-error rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-error mx-auto" />
          <div className="space-y-2">
            <h2 className="font-headline font-black text-2xl text-error">Unity Load Error</h2>
            <p className="text-sm text-on-error-container font-body">{error}</p>
          </div>

          <div className="bg-surface rounded-2xl p-4 text-left space-y-2 mt-4">
            <p className="text-xs font-label-caps text-primary font-bold">SETUP INSTRUCTIONS:</p>
            <ol className="text-xs text-on-surface-variant font-body space-y-1 list-decimal list-inside">
              <li>Build your Unity project for WebGL</li>
              <li>
                Copy build files to:{" "}
                <code className="bg-surface-container px-1 py-0.5 rounded text-primary">
                  public/unity/Build/
                </code>
              </li>
              <li>
                Rename files to match: shiritori.loader.js, shiritori.data, shiritori.framework.js,
                shiritori.wasm
              </li>
              <li>Refresh the page</li>
            </ol>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-3 px-6 rounded-xl hover:border-primary/40 transition-all"
            >
              Back to Game
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 pb-28 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-black text-2xl text-primary">Unity Enhanced View</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            3D game board with animations
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFullscreen}
            className="p-3 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface hover:border-primary/40 transition-all"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 bg-surface border-2 border-outline-variant/20 text-on-surface font-body font-bold py-2 rounded-lg hover:border-primary/40 transition-all text-sm"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative bg-surface-container rounded-3xl overflow-hidden border-4 border-primary shadow-2xl"
        style={{ aspectRatio: "16/9" }}
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container z-10"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-sm font-headline font-bold text-on-surface mb-2">
              Loading Unity WebGL...
            </p>
            <div className="w-64 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-on-surface-variant font-body mt-2">
              {loadingProgress}% complete
            </p>
          </motion.div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            width: "100%",
            height: "100%",
            display: isLoading ? "none" : "block",
          }}
        />
      </div>

      <div className="bg-surface-container rounded-2xl p-4 border border-primary/10 space-y-2">
        <p className="text-xs font-label-caps text-primary font-bold">🎮 UNITY FEATURES</p>
        <ul className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant font-body">
          <li>• 3D game board visualization</li>
          <li>• Animated character mascots</li>
          <li>• Particle effects on valid words</li>
          <li>• Interactive word chain display</li>
        </ul>
      </div>

      <div className="bg-surface-container-highest rounded-2xl p-4 border border-outline-variant/10">
        <p className="text-xs text-on-surface-variant font-body text-center">
          💡 <strong>Dev Note:</strong> React handles game logic, Firebase handles multiplayer
          state, Unity handles visual effects and animations. This keeps the architecture clean and
          maintainable.
        </p>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any,
      onProgress: (progress: number) => void
    ) => Promise<UnityInstance>;
  }
}
