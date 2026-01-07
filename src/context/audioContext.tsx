import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const STORAGE_KEY_ENABLED = "watchpicker_sound_enabled";
const SESSION_KEY_PLAYED = "watchpicker_startup_sound_played";

interface AudioContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playStartupSound: () => void;
  hasPlayedStartup: boolean;
}

const context = React.createContext<AudioContextValue>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  toggleSound: () => {},
  playStartupSound: () => {},
  hasPlayedStartup: false,
});

interface Props {
  children: React.ReactNode;
}

const getInitialSoundEnabled = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
  return stored !== null ? stored === "true" : true;
};

const getHasPlayedThisSession = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY_PLAYED) === "true";
};

export const AudioProvider = ({ children }: Props) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(
    getInitialSoundEnabled,
  );
  const [hasPlayedStartup, setHasPlayedStartup] = useState<boolean>(
    getHasPlayedThisSession,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef<boolean>(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio("/sounds/bear-roar.mp3");
    audio.preload = "auto";

    // Handle missing or failed audio file gracefully
    const handleError = () => {
      console.warn("Failed to load audio file: /sounds/bear-roar.mp3");
      audioRef.current = null;
    };

    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("error", handleError);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY_ENABLED, String(newValue));
      return newValue;
    });
  }, []);

  const playStartupSound = useCallback(() => {
    // Only play if: sound is enabled, hasn't played this session, and audio exists
    if (!soundEnabled || hasPlayedStartup || !audioRef.current) {
      return;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.volume = 0.5;

    audioRef.current
      .play()
      .then(() => {
        setHasPlayedStartup(true);
        sessionStorage.setItem(SESSION_KEY_PLAYED, "true");
      })
      .catch((error) => {
        // Autoplay was prevented - this is expected before user interaction
        console.log("Audio playback prevented:", error.message);
      });
  }, [soundEnabled, hasPlayedStartup]);

  // Set up listener for first user interaction to play startup sound
  useEffect(() => {
    if (hasPlayedStartup || !soundEnabled || hasInteracted.current) {
      return;
    }

    const handleFirstInteraction = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      playStartupSound();
      // Note: { once: true } handles automatic cleanup after first trigger
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasPlayedStartup, soundEnabled, playStartupSound]);

  return (
    <context.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        playStartupSound,
        hasPlayedStartup,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAudio = () => {
  return useContext(context);
};
