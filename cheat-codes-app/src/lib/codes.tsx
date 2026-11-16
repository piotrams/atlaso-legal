import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { REMOTE_CODES_URL } from '../config';
import { BUNDLED_CODES } from '../data/codes';
import { SAMPLE_CODES } from '../data/sampleCodes';
import type { CheatCode, CodesFile } from '../data/types';

const CACHE_KEY = 'codes.cache.v1';

interface CodesState {
  codes: CheatCode[];
  updatedAt: string;
  isSample: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

const CodesContext = createContext<CodesState | null>(null);

function isValidFile(x: unknown): x is CodesFile {
  const f = x as CodesFile;
  return (
    !!f &&
    typeof f.version === 'number' &&
    Array.isArray(f.codes) &&
    f.codes.every((c) => c && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.inputs === 'object')
  );
}

const newest = (a: CodesFile, b: CodesFile | null) => (b && b.version > a.version ? b : a);

async function fetchRemote(): Promise<CodesFile | null> {
  if (!REMOTE_CODES_URL) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${REMOTE_CODES_URL}?t=${Date.now()}`, { signal: controller.signal });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return isValidFile(json) ? json : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function CodesProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<CodesFile>(BUNDLED_CODES);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const remote = await fetchRemote();
    if (remote) {
      setFile((cur) => newest(cur, remote));
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remote)).catch(() => {});
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        const cached: unknown = raw ? JSON.parse(raw) : null;
        if (isValidFile(cached)) setFile((cur) => newest(cur, cached));
      } catch {}
      refresh();
    })();
  }, [refresh]);

  // Dev builds with no real codes yet show fake samples so the UI can be previewed.
  const useSample = __DEV__ && file.codes.length === 0;
  const shown = useSample ? SAMPLE_CODES : file;

  return (
    <CodesContext.Provider
      value={{ codes: shown.codes, updatedAt: shown.updatedAt, isSample: useSample, refreshing, refresh }}
    >
      {children}
    </CodesContext.Provider>
  );
}

export function useCodes() {
  const ctx = useContext(CodesContext);
  if (!ctx) throw new Error('useCodes must be used inside CodesProvider');
  return ctx;
}
