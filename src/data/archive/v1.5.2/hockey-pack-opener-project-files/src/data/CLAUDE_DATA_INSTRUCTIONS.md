# Claude/Cursor instructions — Hockey Pack Opener dataset v1.5.1

## Belangrijke locatie datasetbestanden

De nieuwe datasetbestanden voor deze versie staan in:

```txt
src/data/v1.5.1/
```

Gebruik deze map als primaire databron voor v1.5.1. De bestanden direct onder `src/data/` kunnen nog bestaan voor backwards compatibility, maar Claude/Cursor moet bij twijfel de versie-map `src/data/v1.5.1/` gebruiken.


Lees bij voorkeur eerst deze twee bestanden:

1. `src/data/DATASET_OVERVIEW.md` — leesbare uitleg van de dataset en datalagen.
2. `src/data/CLAUDE_NEXT_STEPS_INSTRUCTION.md` — concrete werkregels en startprompt voor Claude/Cursor.

Onderstaande instructies blijven geldig als detailreferentie.

---

# Claude/Cursor instructions — Hockey Pack Opener dataset

Gebruik deze instructie wanneer je Claude of Cursor vraagt om de data of app te wijzigen.

## Doel van de dataset

Deze dataset voedt een visuele hockey pack opener app. De dataset bevat alleen spelers uit de **Nederlandse Hoofdklasse Heren en Dames 2025-2026**. Buitenlandse en internationale context mag alleen als status/evidence bij deze Hoofdklasse-spelers worden toegevoegd.

## Welke bestanden moet je gebruiken?

### 1. Spelers tonen in de app

Gebruik:

```ts
src/data/playersBase.ts
```

Dit is de feitelijke hoofdbron met spelers, clubs, rugnummers, posities, nationaliteiten en international-statussen.

### 2. Ratings, rarity en traits tonen

Gebruik:

```ts
src/data/playerRatings.ts
```

Koppel dit bestand aan `playersBase.ts` via `playerId`.

Belangrijk:

- `traits: []` blijft leeg voor backwards compatibility.
- Gebruik de nieuwe `traitScores` voor echte trait-logica.
- Toon alleen traits boven een gekozen confidence-grens, bijvoorbeeld `confidence >= 60`.

Voorbeeld:

```ts
const visibleTraits = rating.traitScores.filter(t => t.confidence >= 60);
```

### 3. Geldige traitnamen

Gebruik:

```ts
src/data/traitCatalog.ts
```

Voeg geen willekeurige traits toe buiten deze catalogus.

### 4. Clubkleuren en logo’s

Gebruik de bestaande clubdata, meestal:

```ts
src/data/clubs.ts
```

Als een clubkleur of logo ontbreekt, gebruik fallback-kleuren in de UI.

### 5. Bronnen en bewijs

Gebruik deze bestanden alleen voor herleiding, controles en verdere verrijking:

```ts
src/data/mediaSourceRegistry.ts
src/data/teamMediaEvidence.ts
src/data/nationalTeamEvidence.ts
src/data/nationalTeamSourceRegistry.ts
src/data/foreignNationalTeamEvidence.ts
src/data/foreignNationalTeamSourceRegistry.ts
```

Deze bestanden zijn bedoeld om te verklaren waarom een speler bepaalde status of trait-confidence heeft.

## Belangrijke datavelden

### In `playersBase.ts`

Let vooral op:

```ts
id
name
gender
club
teamName
competition
shirtNumber
fieldPosition
positionStatus
nationality
nationalityStatus
isSeniorInternational
isJongOranje
internationalStatusSummary
isForeignSeniorInternational
foreignInternationalStatusSummary
```

### In `playerRatings.ts`

Let vooral op:

```ts
playerId
rating
rarity
traits
traitScores
```

`traitScores` bevat per trait:

```ts
trait
confidence
basis
sourceType
sourceName
note
```

## Regels voor updates

Bij elke datasetupdate:

1. Werk de inhoudelijke bestanden bij.
2. Werk `src/data/datasetMeta.ts` bij.
3. Werk `src/data/datasetMeta.json` bij.
4. Voeg een regel toe aan `src/data/datasetCHANGELOG.md`.
5. Verhoog `updateSequence` met 1.
6. Verhoog het versienummer volgens deze afspraak:
   - Kleine datacorrectie: patch, bijvoorbeeld `1.1.1` naar `1.1.2`.
   - Nieuwe bronlaag of datamodeluitbreiding: minor, bijvoorbeeld `1.1.0` naar `1.2.0`.
   - Grote breaking change: major, bijvoorbeeld `1.1.0` naar `2.0.0`.

## Scope-regel

Verwijder spelers die niet onder deze scope vallen:

```txt
NL Hoofdklasse Heren + Dames 2025-2026
```

Voeg dus geen losse FIH-, Oranje-, Duitse, Spaanse of andere internationale spelers toe als ze niet ook in de Hoofdklasse-set zitten.

## Trait-regels

- Voeg niet zomaar harde traits toe zonder bron of reden.
- Gebruik confidence-percentages van 0 t/m 100.
- Harde statistiek, zoals veel strafcornergoals, mag hoge confidence geven.
- Positie-afleiding mag alleen middel/lage confidence geven.
- Onzekere media-afleiding moet voorzichtig blijven.

Voorbeeldregels:

```ts
sleepcorner >= 85: duidelijke strafcornerspecialist
schieten >= 70: sterke scorende speler
keeper reflexen >= 70: keeper met sterke keeperstatus/evidence
passing >= 60: bruikbaar als zichtbare kaarttrait
```

## App-integratie advies

Maak een helper zoals:

```ts
export function getPlayerCardData(playerId: string) {
  const player = playersBase.find(p => p.id === playerId);
  const rating = playerRatings.find(r => r.playerId === playerId);

  return {
    ...player,
    rating: rating?.rating ?? 60,
    rarity: rating?.rarity ?? 'Bronze',
    visibleTraits: rating?.traitScores?.filter(t => t.confidence >= 60) ?? []
  };
}
```

## Niet doen

- Niet terugvallen op de oude mockdata in `src/players.ts` als waarheid.
- Niet gokken op nationaliteit op basis van naam als `verified`.
- Niet alle spelers automatisch Nederlandse nationaliteit geven zonder status `assumed_nl`.
- Niet `traits` vullen met strings; gebruik `traitScores`.
- Niet spelers buiten de Hoofdklasse toevoegen.


## Werken met posities

- Gebruik `playersBase.ts` als actuele positiebron voor de app.
- Gebruik `positionEvidence.ts` om te onderbouwen waar een positie vandaan komt.
- Gebruik alleen expliciete bronnen voor positiewijzigingen: clubprofiel, Hockey.nl-profiel, FIH/bondprofiel of nieuwsbericht waarin de positie letterlijk staat.
- Gok niet op basis van rugnummer, goals of naam.
- Laat spelers op `fieldPosition: 'UNKNOWN'` staan wanneer geen expliciete bron gevonden is.
- Bij elke nieuwe positieverrijking: werk `positionEvidence`, `playersBase`, `position-summary`, `position-review`, `datasetMeta` en `datasetCHANGELOG` bij.


## v1.2.1 positie-lookup

Bij positie-updates geldt: gebruik alleen `fieldPosition` als hard veld wanneer een bron expliciet keeper/verdediger/middenvelder/aanvaller/forward/defender/midfielder/goalkeeper noemt. Doelpunten of rugnummer mogen niet automatisch naar een positie worden vertaald; zulke gevallen blijven `UNKNOWN` of krijgen hooguit een reviewnotitie.

## Pasfoto / portrait regels

- Gebruik `player.portraitUrl` alleen als deze gevuld is.
- Als `portraitUrl` leeg is, toon een fallback-avatar of clublogo.
- Gebruik `portraitEvidence.ts` voor broncontrole.
- Download of herhost clubfoto’s niet zonder toestemming; link extern of gebruik als development reference.
- Bij elke nieuwe portretverrijking: update `portraitEvidence`, `portrait-summary`, `portrait-review`, `datasetMeta` en `datasetCHANGELOG`.


## Regels voor leeftijd en vlaggen - vanaf v1.4.0

- Gebruik `playerCountries.ts` voor vlaggen en landnamen. Bouw vlag-URL's niet opnieuw hardcoded in componenten.
- Koppel een speler aan een vlag via `player.nationality === playerCountries.code`.
- Gebruik `flagSvgUrl` voor scherpe kaartweergave en `flagPngUrl` als fallback.
- Vul `ageYears` alleen als `birthDate` of leeftijd uit een expliciete bron komt. Niet raden op basis van naam, team of foto.
- Bij leeftijd-update: voeg een record toe in `ageEvidence.ts/json`, zet `ageStatus` op `verified_source` of `source_based`, en werk `ageLastChecked`, `datasetMeta` en `datasetCHANGELOG` bij.
- Als geen leeftijd bekend is: laat `ageYears: null` en `ageStatus: 'missing'`.


## Official international caps/goals stats

- `playersBase.ts` bevat per speler nu `officialInternationalCaps`, `officialInternationalGoals`, `officialInternationalStatsStatus`, `officialInternationalStatsTeam`, `officialInternationalStatsSourceUrl` en `officialInternationalStatsEvidenceIds`.
- `officialInternationalStatsEvidence.ts/json/csv` bevat de bronregels voor ingevulde caps/goals.
- `official-international-stats-review.csv` bevat internationals waarvoor nog een officiële FIH-/bondbron of niet-uitgelezen Hockey.nl-statistiek nodig is.
- Gebruik alleen waarden met status `verified_caps_and_goals_hockeynl` of `verified_caps_goals_missing_in_retrieved_profile` als bronwaarden; vul geen caps/goals op basis van aannames.