import { useCallback, useRef } from "react";

type SoundName = "correct" | "wrong" | "tap" | "star" | "celebrate";

const SOUND_URLS: Record<SoundName, string> = {
  correct: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  wrong: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  tap: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  star: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  celebrate: "data:audio/wav;base64,UklGRhYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
};

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [getContext]
  );

  const play = useCallback(
    (sound: SoundName) => {
      switch (sound) {
        case "correct":
          playTone(523, 0.15);
          setTimeout(() => playTone(659, 0.15), 100);
          setTimeout(() => playTone(784, 0.25), 200);
          break;
        case "wrong":
          playTone(200, 0.3, "triangle");
          break;
        case "tap":
          playTone(440, 0.08);
          break;
        case "star":
          playTone(880, 0.1);
          setTimeout(() => playTone(1047, 0.15), 80);
          break;
        case "celebrate":
          [523, 659, 784, 1047].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.2), i * 120);
          });
          break;
      }
    },
    [playTone]
  );

  const speak = useCallback((text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis not available
    }
  }, []);

  return { play, speak, SOUND_URLS };
}
