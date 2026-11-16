import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import type { PlatformId } from '../data/types';

const KEY = 'prefs.v1';

interface Prefs {
  platform: PlatformId;
  favorites: string[];
}

interface PrefsState extends Prefs {
  setPlatform: (p: PlatformId) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const PrefsContext = createContext<PrefsState | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>({ platform: 'ps', favorites: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setPrefs((p) => ({ ...p, ...JSON.parse(raw) })))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(prefs)).catch(() => {});
  }, [prefs, loaded]);

  const setPlatform = useCallback((platform: PlatformId) => setPrefs((p) => ({ ...p, platform })), []);
  const toggleFavorite = useCallback(
    (id: string) =>
      setPrefs((p) => ({
        ...p,
        favorites: p.favorites.includes(id) ? p.favorites.filter((f) => f !== id) : [id, ...p.favorites],
      })),
    [],
  );
  const isFavorite = useCallback((id: string) => prefs.favorites.includes(id), [prefs.favorites]);

  return (
    <PrefsContext.Provider value={{ ...prefs, setPlatform, toggleFavorite, isFavorite }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}
