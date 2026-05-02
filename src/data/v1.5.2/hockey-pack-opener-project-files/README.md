# Hockey Pack Opener — dataset v1.5.1

## Belangrijke locatie datasetbestanden

De nieuwe datasetbestanden voor deze versie staan in:

```txt
src/data/v1.5.1/
```

Gebruik deze map als primaire databron voor v1.5.1. De bestanden direct onder `src/data/` kunnen nog bestaan voor backwards compatibility, maar Claude/Cursor moet bij twijfel de versie-map `src/data/v1.5.1/` gebruiken.


Deze projectset bevat de spelersdata voor de hockey pack opener app.

## Scope

Alleen:

```txt
NL Hoofdklasse Heren + Dames 2025-2026
```

Geen losse internationale spelers buiten deze competitie toevoegen.

## Snelstart voor Claude/Cursor

Laat Claude/Cursor eerst deze bestanden lezen:

```txt
src/data/v1.5.1/DATASET_OVERVIEW.md
src/data/v1.5.1/DATA_FILES.md
src/data/v1.5.1/CLAUDE_DATA_INSTRUCTIONS.md
src/data/v1.5.1/CLAUDE_NEXT_STEPS_INSTRUCTION.md
```

Belangrijkste regel:

```txt
playersBase.ts = feitelijke spelerdata
playerRatings.ts = game-data
traitScores = traits met confidence-percentages
```

## Belangrijkste bestanden

| Bestand | Doel |
|---|---|
| `src/data/playersBase.ts` | Feitelijke spelersdata: naam, club, team, positie, nationaliteit, pasfoto, international-status, caps/goals. |
| `src/data/playerRatings.ts` | Game-data: rating, rarity en traitScores. |
| `src/data/traitCatalog.ts` | Toegestane hockeytraits. |
| `src/data/playerCountries.ts` | Landen/vlaggen voor kaartweergave. |
| `src/data/datasetMeta.ts` | Versie, datum, scope en update sequence. |
| `src/data/DATASET_OVERVIEW.md` | Uitleg van de dataset en datalagen. |
| `src/data/CLAUDE_NEXT_STEPS_INSTRUCTION.md` | Kant-en-klare instructie voor Claude/Cursor. |

## Versie

```txt
Versie: v1.5.1
Datum: 2026-05-02
Update sequence: 9
Status: dataset_explanation_and_claude_instruction_refresh
```

## Update-afspraak

Bij elke inhoudelijke wijziging:

1. Pas de juiste databestanden aan.
2. Werk `datasetMeta.ts` en `datasetMeta.json` bij.
3. Voeg een regel toe aan `datasetCHANGELOG.md`.
4. Verhoog `updateSequence`.
5. Verhoog versie volgens semver: patch/minor/major.