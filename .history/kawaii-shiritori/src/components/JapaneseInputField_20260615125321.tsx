import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Loader2, ArrowRight, X, Lightbulb } from "lucide-react";
import {
  convertRomajiToHiragana,
  searchDictionary,
  isKana,
  isRomaji,
  validateShiritoriWord
} from "../lib/japaneseInput";

interface JapaneseInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  requiredSound?: string;
  showVoiceButton?: boolean;
  showPredictions?: boolean;
}

interface Prediction {
  word: string;
  hiragana: string;
  translation: string;
  romaji: string;
}

export default function JapaneseInputField({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type or speak...",
  requiredSound = "",
  showVoiceButton = true,
  showPredictions = true
}: JapaneseInputFieldProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [voiceError, setVoiceError] = React.useState<string>("");
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [showPredictionDropdown, setShowPredictionDropdown] = React.useState(false);
  const [selectedPredictionIndex, setSelectedPredictionIndex] = React.useState(0);
  
  const recognitionRef = React.useRef<any>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Initialize voice recognition
  React.useEffect(() => {
    if (!showVoiceButton) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "ja-JP";
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onChange(finalTranscript);
          setIsListening(false);
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errorMsg = event.error === "no-speech" 
          ? "No speech detected. Please try again."
          : event.error === "not-allowed"
          ? "Microphone access denied."
          : "Voice recognition error.";
        setVoiceError(errorMsg);
        setTimeout(() => setVoiceError(""), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [showVoiceButton, onChange]);

  // Auto-convert romaji to hiragana as user types
  const handleInputChange = (newValue: string) => {
    // If input is empty, just update
    if (!newValue) {
      onChange("");
      return;
    }

    // If user is typing in Japanese directly (kana), keep it
    if (isKana(newValue[newValue.length - 1])) {
      onChange(newValue);
      return;
    }

    // Auto-convert romaji to hiragana
    const converted = convertRomajiToHiragana(newValue, true);
    onChange(converted);
  };

  // Generate predictions based on input
  React.useEffect(() => {
    if (!showPredictions || !value || value.length < 1) {
      setPredictions([]);
      setShowPredictionDropdown(false);
      return;
    }

    // Use enhanced search with caching
    const results = searchDictionary(value, requiredSound, 8);
    
    const matches: Prediction[] = results.map(entry => ({
      word: entry.word,
      hiragana: entry.hiragana,
      translation: entry.translation,
      romaji: entry.romaji || entry.word
    }));
    
    setPredictions(matches);
    setShowPredictionDropdown(matches.length > 0);
    setSelectedPredictionIndex(0);
  }, [value, showPredictions, requiredSound]);

  // Handle keyboard navigation for predictions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPredictionDropdown || predictions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedPredictionIndex((prev) => 
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedPredictionIndex((prev) => 
          prev > 0 ? prev - 1 : 0
        );
        break;
      case "Enter":
        e.preventDefault();
        if (predictions[selectedPredictionIndex]) {
          selectPrediction(predictions[selectedPredictionIndex]);
        } else {
          onSubmit();
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowPredictionDropdown(false);
        break;
      case "Tab":
        e.preventDefault();
        if (predictions[selectedPredictionIndex]) {
          selectPrediction(predictions[selectedPredictionIndex]);
        }
        break;
    }
  };

  const selectPrediction = (prediction: Prediction) => {
    onChange(prediction.romaji);
    setShowPredictionDropdown(false);
    inputRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceError("Voice recognition not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setVoiceError("Failed to start voice recognition.");
      }
    }
  };

  // Convert current input to hiragana for preview
  const hiraganaPreview = React.useMemo(() => {
    return convertRomajiToHiragana(value);
  }, [value]);

  // Clear predictions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowPredictionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Main Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-surface border-2 border-primary rounded-none py-3 px-6 pr-32 text-on-surface font-body font-bold placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-2 focus:ring-primary/20 transition-all shadow-[4px_4px_0px_0px_#f27d26] disabled:opacity-50"
          autoComplete="off"
          lang="ja"
        />

        {/* Voice Button */}
        {showVoiceButton && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
            <motion.button
              type="button"
              onClick={toggleVoiceInput}
              whileTap={{ scale: 0.95 }}
              disabled={disabled}
              className={`p-2 rounded-full transition-all ${
                isListening
                  ? "bg-error text-white animate-pulse shadow-lg"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              } disabled:opacity-50`}
              title={isListening ? "Tap to stop" : "Tap to speak"}
            >
              {isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </motion.button>

            {/* Listening Indicator */}
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-error pointer-events-none"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-error pointer-events-none"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary rounded-none p-2 hover:bg-opacity-90 disabled:opacity-50 transition-colors cursor-pointer border border-white"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hiragana Preview */}
      {value && hiraganaPreview !== value && (
        <div className="mt-2 text-center font-display-game font-bold text-xs bg-primary/10 text-primary py-1 px-4 rounded-full mx-auto max-w-xs animate-fade-in select-none">
          Preview: <span className="underline font-extrabold">{hiraganaPreview}</span>
        </div>
      )}

      {/* Voice Transcript Bubble */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface-container border-2 border-primary rounded-2xl px-4 py-2 shadow-lg z-20"
          >
            <p className="text-sm font-body text-on-surface whitespace-nowrap">
              🎤 {transcript}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Error */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-error/10 border border-error/30 rounded-lg px-3 py-2 text-xs text-error z-20"
          >
            {voiceError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prediction Dropdown */}
      <AnimatePresence>
        {showPredictionDropdown && predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-container border-2 border-primary rounded-lg shadow-2xl overflow-hidden z-30 max-h-[300px] overflow-y-auto"
          >
            <div className="p-2 bg-primary/5 border-b border-primary/20 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">
                Suggestions (↑↓ to navigate, Enter/Tab to select)
              </span>
            </div>
            
            {predictions.map((prediction, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => selectPrediction(prediction)}
                onMouseEnter={() => setSelectedPredictionIndex(index)}
                className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-outline-variant/10 last:border-b-0 ${
                  index === selectedPredictionIndex ? "bg-primary/10" : ""
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-on-surface text-base">
                        {prediction.hiragana}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        ({prediction.romaji})
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {prediction.translation}
                    </p>
                  </div>
                  {index === selectedPredictionIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-primary"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
