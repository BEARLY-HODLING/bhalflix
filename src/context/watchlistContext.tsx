import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { IWatchlistItem } from "@/types";

const WATCHLIST_KEY = "watchpicker_watchlist";
const WATCHED_KEY = "watchpicker_watched";

export interface WatchedItem {
  id: string;
  title: string;
  poster_path: string;
  category: "movie" | "tv";
  watchedAt: number;
}

interface WatchlistContextType {
  watchlist: IWatchlistItem[];
  addToWatchlist: (item: Omit<IWatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  clearWatchlist: () => void;
  watched: WatchedItem[];
  markAsWatched: (item: Omit<WatchedItem, "watchedAt">) => void;
  removeFromWatched: (id: string) => void;
  isWatched: (id: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined,
);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<IWatchlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(WATCHLIST_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn(
        "Corrupted watchlist data in localStorage, clearing:",
        error,
      );
      localStorage.removeItem(WATCHLIST_KEY);
      return [];
    }
  });

  const [watched, setWatched] = useState<WatchedItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(WATCHED_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Corrupted watched data in localStorage, clearing:", error);
      localStorage.removeItem(WATCHED_KEY);
      return [];
    }
  });

  // Persist watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.warn(
        "Failed to save watchlist to localStorage (quota exceeded?):",
        error,
      );
    }
  }, [watchlist]);

  // Persist watched to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
    } catch (error) {
      console.warn(
        "Failed to save watched to localStorage (quota exceeded?):",
        error,
      );
    }
  }, [watched]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WATCHLIST_KEY && e.newValue) {
        try {
          setWatchlist(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            "Corrupted watchlist data from storage event, clearing:",
            error,
          );
          localStorage.removeItem(WATCHLIST_KEY);
          setWatchlist([]);
        }
      }
      if (e.key === WATCHED_KEY && e.newValue) {
        try {
          setWatched(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            "Corrupted watched data from storage event, clearing:",
            error,
          );
          localStorage.removeItem(WATCHED_KEY);
          setWatched([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToWatchlist = useCallback(
    (item: Omit<IWatchlistItem, "addedAt">) => {
      setWatchlist((prev) => {
        // Don't add if already exists
        if (prev.some((i) => i.id === item.id)) return prev;
        return [{ ...item, addedAt: Date.now() }, ...prev];
      });
    },
    [],
  );

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInWatchlist = useCallback(
    (id: string) => {
      return watchlist.some((item) => item.id === id);
    },
    [watchlist],
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  const markAsWatched = useCallback((item: Omit<WatchedItem, "watchedAt">) => {
    setWatched((prev) => {
      // Don't add if already exists
      if (prev.some((i) => i.id === item.id)) return prev;
      return [{ ...item, watchedAt: Date.now() }, ...prev];
    });

    // KEY LOGIC: If the item is a TV show, automatically add it to the watchlist
    if (item.category === "tv") {
      setWatchlist((prev) => {
        // Don't add if already in watchlist
        if (prev.some((i) => i.id === item.id)) return prev;
        return [
          {
            id: item.id,
            title: item.title,
            poster_path: item.poster_path,
            category: item.category,
            addedAt: Date.now(),
          },
          ...prev,
        ];
      });
    }
  }, []);

  const removeFromWatched = useCallback((id: string) => {
    setWatched((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isWatched = useCallback(
    (id: string) => {
      return watched.some((item) => item.id === id);
    },
    [watched],
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
        watched,
        markAsWatched,
        removeFromWatched,
        isWatched,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
