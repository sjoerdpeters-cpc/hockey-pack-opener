# Dataset overview — Hockey Pack Opener v1.5.1

## Belangrijke locatie datasetbestanden

De nieuwe datasetbestanden voor deze versie staan in:

```txt
src/data/v1.5.1/
```

Gebruik deze map als primaire databron voor v1.5.1. De bestanden direct onder `src/data/` kunnen nog bestaan voor backwards compatibility, maar Claude/Cursor moet bij twijfel de versie-map `src/data/v1.5.1/` gebruiken.


Dit document legt uit wat er in de dataset zit en hoe Claude/Cursor de bestanden moet gebruiken.

## Scope

De dataset is beperkt tot:

```txt
NL Hoofdklasse Heren + Dames 2025-2026
```

De basis komt uit de KNHB Hoofdklasse-spelerslijsten 2025-2026. Daarna is de dataset verrijkt met bronnen zoals Hockey.nl, Tulp Hoofdklasse, clubpublicaties, FIH-profielen en publicaties van buitenlandse bonden.

## Hoofdlagen

### 1. Feitelijke spelerlaag

Bestand:

```txt
src/data/playersBase.ts
```

Doel: alles wat feitelijk over de speler gaat.

Voorbeelden:

- naam
- club
- team
- competitie
- rugnummer
- keeper/aanvoerder
- positie
- nationaliteit
- pasfoto
- leeftijdvelden
- Oranje/Jong Oranje-status
- buitenlandse international-status
- officiële caps/goals waar beschikbaar

### 2. Game-laag

Bestand:

```txt
src/data/playerRatings.ts
```

Doel: alles wat voor de pack opener/game-balancing is.

Voorbeelden:

- rating
- rarity
- traitScores

De oude `traits` array blijft leeg. Gebruik altijd `traitScores`.

### 3. Trait-catalogus

Bestand:

```txt
src/data/traitCatalog.ts
```

Doel: centrale lijst met toegestane traits.

Huidige traits:

- sleepcorner
- 1 tegen 1 specialist
- dribbelaar
- schieten
- passing
- snelheid
- versnelling
- balcontrole
- spelverdeler
- visie
- pressing
- onderscheppen
- tackelen
- mandekking
- loopvermogen
- voorzet
- tip-in
- rebound
- keeper reflexen
- uitlopen strafcorner

### 4. Landen/vlaggen

Bestand:

```txt
src/data/playerCountries.ts
```

Doel: kaartweergave met vlaggen en landfilters.

Velden:

- code
- isoAlpha2
- nameNl
- nameEn
- flagEmoji
- flagSvgUrl
- flagPngUrl
- playerCount

### 5. Evidence-laag

Evidence-bestanden geven onderbouwing voor de velden in de dataset.

Belangrijke evidence-bestanden:

```txt
positionEvidence.ts
portraitEvidence.ts
nationalTeamEvidence.ts
foreignNationalTeamEvidence.ts
officialInternationalStatsEvidence.ts
teamMediaEvidence.ts
mediaSourceRegistry.ts
ageEvidence.ts
```

Deze bestanden zijn vooral voor controle, review en latere verrijking.

## Belangrijkste datavelden in playersBase

### Basis

```ts
id: string
name: string
gender: 'male' | 'female'
nationality: string
club: string
teamName: string
team: 'H1' | 'D1'
teamLabel: 'Heren 1' | 'Dames 1'
teamType: 'Hoofdklasse'
competition: string
```

### Wedstrijd/team

```ts
fieldPosition: 'GK' | 'DEF' | 'MID' | 'ATT' | 'UNKNOWN'
jerseyNumber: number | null
isKeeper: boolean
isCaptain: boolean
```

### Bron/status

```ts
source
sourceUrl
sourcePdfUrl
sourceSeason
verified
lastChecked
dataStatus
```

### Nationaliteit

```ts
nationalityStatus
nationalitySource
nationalitySourceUrl
nationalityNote
nationalityLastChecked
```

### International-status

```ts
internationalStatuses
isSeniorInternational
isJongOranje
internationalStatusSummary
foreignNationalTeamStatuses
isForeignSeniorInternational
foreignInternationalStatusSummary
```

### Officiële caps/goals

```ts
officialInternationalCaps: number | null
officialInternationalGoals: number | null
officialInternationalStatsStatus: string
officialInternationalStatsTeam: string
officialInternationalStatsSource: string
officialInternationalStatsSourceUrl: string
officialInternationalStatsEvidenceIds: string[]
```

Waarden worden alleen gevuld wanneer een officiële bron dit expliciet toont. Geen aannames.

### Pasfoto

```ts
portraitUrl
portraitStatus
portraitSource
portraitSourceUrl
portraitLastChecked
portraitEvidenceIds
```

Als `portraitUrl` leeg is, moet de app een fallback tonen.

### Leeftijd

```ts
birthDate
ageYears
ageAsOf
ageStatus
ageSource
ageSourceUrl
ageLastChecked
ageEvidenceIds
```

In v1.5.1 is leeftijd grotendeels nog niet gevuld. Alleen vullen met expliciete bron.

## Belangrijkste datavelden in playerRatings

```ts
playerId
rating
rarity
traits
ratingStatus
traitScores
```

`traitScores` bevat:

```ts
trait
confidence
basis
sourceType
sourceName
sourceUrl
note
```

## Aanbevolen app-join

```ts
const playerCards = playersBase.map(player => {
  const rating = playerRatings.find(r => r.playerId === player.id);
  const country = playerCountries.find(c => c.code === player.nationality);

  return {
    ...player,
    rating: rating?.rating,
    rarity: rating?.rarity,
    visibleTraits: rating?.traitScores.filter(t => t.confidence >= 60) ?? [],
    flag: country?.flagEmoji ?? '🏳️',
    flagUrl: country?.flagSvgUrl,
  };
});
```

## Kwaliteitsstatussen

Gebruik statusvelden in de UI/admin:

- `verified_*` = sterkste niveau
- `source_based` = bruikbaar, maar reviewbaar
- `assumed_*` = voorzichtig tonen of intern gebruiken
- `missing` / `unknown` = fallback tonen
- `needs_review_*` = op reviewlijst houden

## Versiebeheer

Huidige versie:

```txt
v1.5.1
```

Deze versie voegt vooral betere uitleg en Claude/Cursor-instructies toe. De inhoudelijke data blijft gebaseerd op v1.5.0.