// Trait catalog for hockey pack opener.
// These are game tags. Actual assignment is stored as confidence percentages in playerRatings.ts.

export const hockeyTraits = [
  "sleepcorner",
  "1 tegen 1 specialist",
  "dribbelaar",
  "schieten",
  "passing",
  "snelheid",
  "versnelling",
  "balcontrole",
  "spelverdeler",
  "visie",
  "pressing",
  "onderscheppen",
  "tackelen",
  "mandekking",
  "loopvermogen",
  "voorzet",
  "tip-in",
  "rebound",
  "keeper reflexen",
  "uitlopen strafcorner"
] as const;

export type HockeyTrait = typeof hockeyTraits[number];
