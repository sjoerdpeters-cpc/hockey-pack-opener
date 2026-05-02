# Claude/Cursor instructie — Hockey Pack Opener data v1.5.1

## Belangrijke locatie datasetbestanden

De nieuwe datasetbestanden voor deze versie staan in:

```txt
src/data/v1.5.1/
```

Gebruik deze map als primaire databron voor v1.5.1. De bestanden direct onder `src/data/` kunnen nog bestaan voor backwards compatibility, maar Claude/Cursor moet bij twijfel de versie-map `src/data/v1.5.1/` gebruiken.


Gebruik deze instructie als vaste prompt wanneer je Claude/Cursor aan de hockey pack opener app of dataset laat werken.

## Context

De app is een visuele hockey pack opener met spelers uit de Nederlandse Hoofdklasse. De dataset bevat bewust alleen:

- Tulp Hoofdklasse Hockey Heren 2025-2026
- Tulp Hoofdklasse Hockey Dames 2025-2026

Voeg geen losse internationale spelers toe die niet in deze NL Hoofdklasse-set zitten. Internationale informatie mag alleen als extra status/evidence bij bestaande Hoofdklasse-spelers worden toegevoegd.

## Belangrijkste regel

Gebruik deze scheiding altijd:

- `playersBase.ts` = feitelijke spelerdata
- `playerRatings.ts` = game-data
- evidence-bestanden = onderbouwing en review

Vermeng deze lagen niet.

## Bestanden die je meestal nodig hebt

### 1. Spelers tonen of filteren

Gebruik:

```ts
src/data/playersBase.ts
```

Hierin staan onder andere:

```ts
id
name
gender
club
teamName
teamLabel
competition
jerseyNumber
isKeeper
isCaptain
fieldPosition
positionStatus
nationality
nationalityStatus
portraitUrl
birthDate
ageYears
isSeniorInternational
isJongOranje
isForeignSeniorInternational
officialInternationalCaps
officialInternationalGoals
```

### 2. Kaartsterkte, rarity en traits

Gebruik:

```ts
src/data/playerRatings.ts
```

Koppelen via:

```ts
playerRatings.playerId === playersBase.id
```

Belangrijk:

- `traits: []` blijft leeg voor backwards compatibility.
- Gebruik `traitScores` voor echte trait-logica.
- Toon bijvoorbeeld alleen traits vanaf 60% confidence.

Voorbeeld:

```ts
const visibleTraits = rating.traitScores.filter(t => t.confidence >= 60);
```

### 3. Toegestane traits

Gebruik:

```ts
src/data/traitCatalog.ts
```

Voeg geen traits toe buiten deze lijst zonder eerst de catalogus aan te passen.

### 4. Landen en vlaggen

Gebruik:

```ts
src/data/playerCountries.ts
```

Voor vlaggen op kaarten kun je gebruiken:

```ts
flagEmoji
flagSvgUrl
flagPngUrl
```

### 5. Versie en datasetstatus

Gebruik:

```ts
src/data/datasetMeta.ts
```

Toon deze eventueel in debug/admin UI.

## Evidence-bestanden

Deze bestanden gebruik je om te verklaren waarom iets in `playersBase` of `playerRatings` staat.

| Bestand | Doel |
|---|---|
| `positionEvidence.ts` | Onderbouwing van spelerpositie |
| `portraitEvidence.ts` | Onderbouwing van pasfoto/headshot |
| `nationalTeamEvidence.ts` | Oranje/Jong Oranje status |
| `foreignNationalTeamEvidence.ts` | Buitenlandse internationals |
| `officialInternationalStatsEvidence.ts` | Officiële caps/goals |
| `mediaSourceRegistry.ts` | Bronnenregister media/nieuws |
| `teamMediaEvidence.ts` | Bronnen per team |
| `ageEvidence.ts` | Geboortedatum/leeftijd, nu grotendeels leeg |

Gebruik evidence om confidence, bronverwijzingen en reviewstatus te behouden. Verwijder evidence niet zomaar.

## UI-logica voorstel

### Spelerkaart

Gebruik op een spelerkaart:

- naam: `playersBase.name`
- club: `playersBase.club`
- team: `playersBase.teamName`
- rugnummer: `playersBase.jerseyNumber`
- positie: `playersBase.fieldPosition`
- vlag: koppel `playersBase.nationality` aan `playerCountries.code`
- pasfoto: `playersBase.portraitUrl`, fallback als leeg
- rating/rarity: uit `playerRatings`
- traits: uit `traitScores` boven confidence-grens

### Badges

Toon badges op basis van:

```ts
isSeniorInternational
isJongOranje
isForeignSeniorInternational
officialInternationalCaps
officialInternationalGoals
```

Voorbeelden:

- Oranje
- Jong Oranje
- Buitenlands international
- 100+ caps
- 50+ internationale goals

### Trait confidence

Aanbevolen drempels:

```ts
>= 80: zeer sterk
60-79: sterk
40-59: indicatief
20-39: zwak signaal
< 20: niet tonen
```

## Update-regels

Bij elke datasetwijziging moet je:

1. De inhoudelijke databestanden aanpassen.
2. `datasetMeta.ts` en `datasetMeta.json` bijwerken.
3. `datasetCHANGELOG.md` aanvullen.
4. `updateSequence` met 1 verhogen.
5. Versienummer ophogen:
   - patch: kleine correctie of documentatie-update
   - minor: nieuw dataelement of nieuwe evidence-laag
   - major: breaking wijziging in structuur

## Wat je niet moet doen

- Geen spelers buiten NL Hoofdklasse Heren/Dames 2025-2026 toevoegen.
- Geen oude `traits` arrays opnieuw vullen.
- Geen caps/goals gokken.
- Geen nationaliteit of leeftijd gokken.
- Geen positie invullen zonder expliciete bron, tenzij status duidelijk `assumed` of `heuristic` is.
- Geen externe pasfoto's downloaden/herhosten zonder toestemming; gebruik URL als referentie of toon met fallback.

## Aanbevolen startprompt voor Claude

```txt
Je werkt aan de hockey pack opener app. Lees eerst:
- src/data/v1.5.1/DATASET_OVERVIEW.md
- src/data/v1.5.1/DATA_FILES.md
- src/data/v1.5.1/CLAUDE_DATA_INSTRUCTIONS.md
- src/data/v1.5.1/CLAUDE_NEXT_STEPS_INSTRUCTION.md

Gebruik src/data/v1.5.1/playersBase.ts als feitelijke bron en src/data/v1.5.1/playerRatings.ts als game-laag. Gebruik traitScores in plaats van de oude traits-array. Beperk alles tot NL Hoofdklasse Heren/Dames 2025-2026. Werk bij elke datasetupdate ook datasetMeta en datasetCHANGELOG bij.
```