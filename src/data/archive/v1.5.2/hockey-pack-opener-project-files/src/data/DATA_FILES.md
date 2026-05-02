# Data file catalog — Hockey Pack Opener

## Belangrijke locatie datasetbestanden

De nieuwe datasetbestanden voor deze versie staan in:

```txt
src/data/v1.5.1/
```

Gebruik deze map als primaire databron voor v1.5.1. De bestanden direct onder `src/data/` kunnen nog bestaan voor backwards compatibility, maar Claude/Cursor moet bij twijfel de versie-map `src/data/v1.5.1/` gebruiken.


Deze catalogus beschrijft wat Claude/Cursor in elk TypeScript-bestand kan vinden. Gebruik dit bestand als eerste referentie voordat je data aanpast.

## Belangrijkste app-data

| Bestand | Wat staat erin? | Wanneer gebruiken? |
|---|---|---|
| `datasetMeta.ts` | Centrale datasetmetadata: naam, versie, datum, scope, update sequence, status en bronnen. | Altijd checken bij datasetupdates en tonen in debug/admin UI. |
| `playersBase.ts` | Feitelijke spelersdata voor de NL Hoofdklasse Heren/Dames 2025-2026: speler-id, naam, club, team, competitie, rugnummer, keeper/captain, positie, nationaliteit, Oranje/Jong Oranje-status en buitenlandse international-status. | Hoofdbron voor spelers in de app. Gebruik dit voor filters, cluboverzichten, kaarten en spelerprofielen. |
| `playerRatings.ts` | Game-data per speler: `playerId`, rating, rarity, lege oude `traits`, en nieuwe `traitScores` met confidence-percentages. | Gebruik dit voor pack odds, kaartsterkte, rarity en trait-weergave. |
| `traitCatalog.ts` | De toegestane lijst met 20 hockeytraits. | Gebruik dit voor validatie, filters en UI-labels. Voeg traits alleen hier toe als ze app-breed toegestaan zijn. |

## Bron- en evidencebestanden

| Bestand | Wat staat erin? | Wanneer gebruiken? |
|---|---|---|
| `mediaSourceRegistry.ts` | Register van media-/nieuwsbronnen, zoals Hockey.nl, Tulp Hoofdklasse en KNHB-bronnen. | Gebruik voor bronherleiding bij trait-verrijking. |
| `teamMediaEvidence.ts` | Koppeling tussen teams en relevante media-/nieuwsbronnen. | Gebruik als startpunt om per team wedstrijdverslagen en nieuws te analyseren. |
| `nationalTeamEvidence.ts` | Evidence voor Nederlandse Oranje/Jong Oranje-statussen per speler. | Gebruik voor badges zoals Oranje, Jong Oranje of historische jeugdselectie. |
| `nationalTeamSourceRegistry.ts` | Register van Hockey.nl-bronnen voor Oranje/Jong Oranje. | Gebruik voor herkomst van national-team evidence. |
| `foreignNationalTeamEvidence.ts` | Evidence voor niet-Nederlandse spelers die international zijn of zijn geweest. | Gebruik voor buitenlandse international-badges. |
| `foreignNationalTeamSourceRegistry.ts` | Register van FIH- en buitenlandse bondspublicaties. | Gebruik voor herkomst van buitenlandse international-data. |

## JSON- en CSV-bestanden

| Bestandstype | Doel |
|---|---|
| `*.json` | Machineleesbare kopieën of samenvattingen van de TypeScript-data. Handig voor scripts en controles. |
| `*.csv` | Reviewbestanden voor handmatige controle, bijvoorbeeld unmatched players, nationaliteiten of trait-confidence checks. |

## Scripts

| Bestand | Wat doet het? |
|---|---|
| `scripts/validatePlayers.ts` | Controleert datasetkwaliteit, zoals unieke ids, geldige clubs, ratings, trait-waarden en ontbrekende velden. |

## Dataset-regels

1. `playersBase.ts` is de feitelijke bron. Stop hier geen game-balancing in.
2. `playerRatings.ts` is de game-laag. Stop hier geen feitelijke club-/nationaliteitscorrecties in.
3. `traitCatalog.ts` is leidend voor toegestane traits.
4. Verwijder evidence niet zomaar. Voeg liever nieuwe evidence toe met bron, confidence en datum.
5. Bij elke inhoudelijke wijziging moeten `datasetMeta.ts`, `datasetMeta.json` en `datasetCHANGELOG.md` worden bijgewerkt.
6. De dataset is bewust beperkt tot **NL Hoofdklasse Heren + Dames 2025-2026**.


## Positie-evidence

| Bestand | Wat staat erin? | Wanneer gebruiken? |
|---|---|---|
| `positionEvidence.ts` | Bronrecords voor expliciet gevonden posities per speler. | Gebruik dit om te verklaren waarom een speler `GK`, `DEF`, `MID` of `ATT` heeft gekregen. |
| `positionEvidence.json` | JSON-versie van dezelfde positie-evidence. | Handig voor scripts, controles en externe verwerking. |
| `position-evidence.csv` | Controle-export van alle gevonden positie-records. | Handig voor handmatige review in Excel. |
| `position-review.csv` | Spelers waarvan de positie nog `UNKNOWN` is. | Gebruik dit als werklijst voor de volgende verrijkingsronde. |
| `position-summary.json` | Samenvatting van aantallen posities, statussen en bronnen. | Gebruik dit om voortgang te meten. |


## Update v1.2.1

- `position-lookup-added-v1.2.1.csv` — overzicht van de extra positiehits die in v1.2.1 zijn toegevoegd na gerichte lookup op spelers met `UNKNOWN` positie.

- `portraitEvidence.ts` / `.json` - bewijslaag voor speler-pasfoto’s/headshots met externe club/CDN-URL, bronpagina en confidence.
- `portrait-review.csv` - spelers waarvoor nog geen directe pasfoto-URL is gevonden.
- `portrait-summary.json` - tellingen van gevonden en ontbrekende pasfoto’s.


## Toegevoegd in v1.4.0

| Bestand | Wat staat erin? | Wanneer gebruiken? |
|---|---|---|
| `playerCountries.ts` | Landen die voorkomen in `playersBase.nationality`, inclusief Nederlandse/Engelse naam, flag emoji, SVG/PNG vlag-URL en speler-aantal. | Voor vlaggetjes op spelerkaarten, nationaliteitsfilters en land-legenda's. |
| `ageEvidence.ts` | Evidence-records voor geboortedatum/leeftijd. In v1.4.0 nog baseline leeg. | Alleen vullen wanneer een expliciete club/FIH/bond-bron geboortedatum of leeftijd vermeldt. |

### Leeftijdvelden in `playersBase.ts`

Elke speler heeft nu: `birthDate`, `ageYears`, `ageAsOf`, `ageStatus`, `ageSource`, `ageSourceUrl`, `ageLastChecked`, `ageEvidenceIds`. Gebruik `ageStatus === 'missing'` om een placeholder te tonen.


## Official international caps/goals stats

- `playersBase.ts` bevat per speler nu `officialInternationalCaps`, `officialInternationalGoals`, `officialInternationalStatsStatus`, `officialInternationalStatsTeam`, `officialInternationalStatsSourceUrl` en `officialInternationalStatsEvidenceIds`.
- `officialInternationalStatsEvidence.ts/json/csv` bevat de bronregels voor ingevulde caps/goals.
- `official-international-stats-review.csv` bevat internationals waarvoor nog een officiële FIH-/bondbron of niet-uitgelezen Hockey.nl-statistiek nodig is.
- Gebruik alleen waarden met status `verified_caps_and_goals_hockeynl` of `verified_caps_goals_missing_in_retrieved_profile` als bronwaarden; vul geen caps/goals op basis van aannames.


## Toegevoegd in v1.5.1 — uitleg en Claude-instructie

| Bestand | Wat staat erin? | Wanneer gebruiken? |
|---|---|---|
| `DATASET_OVERVIEW.md` | Leesbare uitleg van de volledige dataset, datalagen, velden en join-logica. | Eerste document voor Claude/Cursor of nieuwe ontwikkelaars. |
| `CLAUDE_NEXT_STEPS_INSTRUCTION.md` | Kant-en-klare instructie/prompt voor Claude/Cursor met update-regels en UI-logica. | Gebruik dit als startprompt bij app- of datawijzigingen. |
