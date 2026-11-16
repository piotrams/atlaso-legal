import type { CodesFile } from './types';

/**
 * FAKE codes for previewing the UI in development builds only.
 * They are never loaded in a release build (see src/lib/codes.tsx).
 */
export const SAMPLE_CODES: CodesFile = {
  version: -1,
  updatedAt: 'sample',
  codes: [
    {
      id: 'sample-armor',
      name: 'Max health & armor',
      category: 'player',
      description: 'Sample entry: refills health and armor.',
      inputs: { ps: 'CIRCLE L1 TRIANGLE R2 CROSS SQUARE CIRCLE RIGHT', xbox: 'B LB Y RT A X B RIGHT', pc: 'SAMPLEARMOR', phone: '1-999-000-0001' },
      warning: 'Sample: may disable trophies/achievements.',
      isNew: true,
    },
    {
      id: 'sample-weapons',
      name: 'Weapon pack',
      category: 'weapons',
      inputs: { ps: 'TRIANGLE R2 LEFT L1 CROSS RIGHT TRIANGLE DOWN SQUARE L1', xbox: 'Y RT LEFT LB A RIGHT Y DOWN X LB', pc: 'SAMPLEGUNS' },
    },
    {
      id: 'sample-car',
      name: 'Spawn sports car',
      category: 'vehicles',
      inputs: { ps: 'R1 CIRCLE R2 RIGHT L1 L2 CROSS CROSS SQUARE R1', xbox: 'RB B RT RIGHT LB LT A A X RB', phone: '1-999-000-0003' },
    },
    {
      id: 'sample-weather',
      name: 'Change weather',
      category: 'world',
      inputs: { ps: 'R2 CROSS L1 L1 L2 L2 L2 SQUARE', xbox: 'RT A LB LB LT LT LT X', pc: 'SAMPLESKY' },
    },
    {
      id: 'sample-slowmo',
      name: 'Slow motion',
      category: 'fun',
      inputs: { ps: 'TRIANGLE LEFT RIGHT RIGHT SQUARE R2 R1', xbox: 'Y LEFT RIGHT RIGHT X RT RB' },
    },
  ],
};
