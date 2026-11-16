export type PlatformId = 'ps' | 'xbox' | 'pc' | 'phone';

export type CategoryId = 'player' | 'weapons' | 'vehicles' | 'world' | 'fun';

export interface CheatCode {
  /** Stable, unique id. Used for favorites, so never change it once shipped. */
  id: string;
  name: string;
  category: CategoryId;
  description?: string;
  /**
   * Inputs per platform. Console inputs are space separated button tokens:
   *   PlayStation: TRIANGLE CIRCLE CROSS SQUARE L1 L2 L3 R1 R2 R3 UP DOWN LEFT RIGHT
   *   Xbox:        A B X Y LB LT LS RB RT RS UP DOWN LEFT RIGHT
   * PC and phone inputs are shown as typed text exactly as written.
   * Leave a platform out if the cheat doesn't exist there.
   */
  inputs: Partial<Record<PlatformId, string>>;
  /** e.g. "Disables trophies/achievements for this session". */
  warning?: string;
  /** Shows a NEW badge. */
  isNew?: boolean;
}

export interface CodesFile {
  /** Bump this every time you publish a change to codes.json. */
  version: number;
  updatedAt: string;
  codes: CheatCode[];
}

export const PLATFORMS: { id: PlatformId; label: string; short: string }[] = [
  { id: 'ps', label: 'PlayStation', short: 'PS5' },
  { id: 'xbox', label: 'Xbox', short: 'Xbox' },
  { id: 'pc', label: 'PC', short: 'PC' },
  { id: 'phone', label: 'In-game phone', short: 'Phone' },
];

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'player', label: 'Player', icon: '🧍' },
  { id: 'weapons', label: 'Weapons', icon: '🔫' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'world', label: 'World', icon: '🌴' },
  { id: 'fun', label: 'Fun', icon: '🎉' },
];
