import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  className?: string;
}

type RecognitionStatus = "idle" | "listening" | "processing" | "error";

export default function VoiceInputButton({
  onResult,
  onError,
  language = "ja-JP",
  className = "",
}: VoiceInputButtonProps) {
  const [status, setStatus] = React.useState<RecognitionStatus>("idle");
  const [transcript, setTranscript] = React.useState("");
  const [isSupported, setIsSupported] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setStatus("listening");
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setStatus("processing");
          onResult(finalTranscript);
          setTimeout(() => setStatus("idle"), 500);
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setStatus("error");
        const errorMsg =
          event.error === "no-speech"
            ? "No speech detected. Please try again."
            : event.error === "not-allowed"
              ? "Microphone access denied. Please enable it in settings."
              : "Voice recognition error. Please try again.";

        onError?.(errorMsg);
        setTimeout(() => setStatus("idle"), 2000);
      };

      recognition.onend = () => {
        if (status === "listening") {
          setStatus("idle");
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onResult, onError]);

  const handleToggleListening = () => {
    if (!isSupported) {
      onError?.(
        "Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    if (status === "listening") {
      recognitionRef.current?.stop();
      setStatus("idle");
    } else {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        onError?.("Failed to start voice recognition. Please try again.");
        setStatus("idle");
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className={`p-3 rounded-full bg-outline/10 text-outline cursor-not-allowed ${className}`}
        title="Voice input not supported"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleToggleListening}
        whileTap={{ scale: 0.95 }}
        className={`p-3 rounded-full transition-all ${
          status === "listening"
            ? "bg-error text-white animate-pulse shadow-lg"
            : status === "processing"
              ? "bg-secondary text-on-secondary"
              : status === "error"
                ? "bg-error/20 text-error"
                : "bg-primary/10 text-primary hover:bg-primary/20"
        } ${className}`}
        title={status === "listening" ? "Tap to stop" : "Tap to speak"}
      >
        <AnimatePresence mode="wait">
          {status === "listening" && (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
          )}
          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.div>
          )}
          {(status === "idle" || status === "error") && (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Live Transcript Bubble */}
      <AnimatePresence>
        {status === "listening" && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface-container border-2 border-primary rounded-2xl px-4 py-2 shadow-lg min-w-[150px] max-w-[250px]"
          >
            <p className="text-sm font-body text-on-surface text-center">{transcript}</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-surface-container border-r-2 border-b-2 border-primary rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Animation Rings */}
      {status === "listening" && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-error"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-error"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </div>
  );
}

// Hook for using voice input with custom logic
export function useVoiceInput(options: {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  autoSubmit?: boolean;
}) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const recognition = React.useRef<any>(null);

  React.useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition not supported");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = true;
    recognition.current.lang = options.language || "ja-JP";

    recognition.current.onresult = (event: any) => {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (final) {
        setTranscript(final);
        options.onResult(final);
        if (options.autoSubmit) {
          setIsListening(false);
        }
      } else {
        setTranscript(interim);
      }
    };

    recognition.current.onerror = (event: any) => {
      const errorMsg =
        event.error === "no-speech"
          ? "No speech detected"
          : event.error === "not-allowed"
            ? "Microphone access denied"
            : "Recognition error";

      setError(errorMsg);
      options.onError?.(errorMsg);
      setIsListening(false);
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [options]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      setError(null);
      setTranscript("");
      recognition.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
