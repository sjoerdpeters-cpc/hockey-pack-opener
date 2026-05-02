# Rating model v1

Applied: 2026-05-02  
Dataset version: v1.6.0

This model turns the factual player data and trait-confidence layer into game ratings.

## Formula

`rating = base + dataCompleteness + performance + international + caps + internationalGoals + traits + leadership + confidenceCorrection`

The output is capped between 40 and 99.

## Components

- `base`: 58 for every Dutch Hoofdklasse player in scope.
- `dataCompleteness`: +2 known position, +1 verified/source-based nationality, +1 portrait/profile image when present.
- `performance`: derived from `traitScores`, especially `schieten`, `sleepcorner`, attacking traits and keeper reflexes.
- `international`: +12 senior international, +5 Jong Oranje/U21, +9 foreign senior/former international when available.
- `caps`: bonus only when `officialInternationalCaps` is present.
- `internationalGoals`: bonus only when `officialInternationalGoals` is present and player is not a keeper.
- `traits`: top three trait confidence values, capped at +6.
- `leadership`: +2 for captains.
- `confidenceCorrection`: penalties for unknown position, assumed nationality, low trait evidence and sparse source data.

## Rarity

- 90-99: Icon
- 82-89: Elite
- 70-81: Gold
- 58-69: Silver
- 40-57: Bronze

## Important

Ratings are game values, not official KNHB/FIH values. Do not overwrite factual fields in `playersBase.ts` based on this model.
