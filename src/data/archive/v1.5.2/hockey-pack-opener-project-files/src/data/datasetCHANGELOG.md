# Dataset changelog

## v1.5.1 — 2026-05-02

- Nieuwe leesbare datasetuitleg toegevoegd: `src/data/DATASET_OVERVIEW.md`.
- Nieuwe concrete Claude/Cursor-instructie toegevoegd: `src/data/CLAUDE_NEXT_STEPS_INSTRUCTION.md`.
- `CLAUDE_DATA_INSTRUCTIONS.md`, `DATA_FILES.md` en `README.md` aangescherpt.
- Datasetmetadata bijgewerkt naar `v1.5.1`, update sequence `9`.
- Geen inhoudelijke spelersmutaties in deze versie; data-inhoud blijft gelijk aan v1.5.0.

## v1.5.0 — 2026-05-02

- Dataelementen toegevoegd voor officiële international-statistieken:
  - `officialInternationalCaps`
  - `officialInternationalGoals`
  - `officialInternationalStatsStatus`
  - `officialInternationalStatsTeam`
  - `officialInternationalStatsSourceUrl`
  - `officialInternationalStatsEvidenceIds`
- Hockey.nl Oranje-profielen ingevuld waar caps/goals numeriek beschikbaar waren.
- Nieuwe evidence/review-bestanden toegevoegd voor verdere FIH-/bondcontrole van buitenlandse internationals.
- Datasetmetadata bijgewerkt naar `v1.5.0`, update sequence `8`.


## v1.1.1 — 2026-05-02

- Bestandscatalogus toegevoegd: `src/data/DATA_FILES.md`.
- Claude/Cursor-instructies toegevoegd: `src/data/CLAUDE_DATA_INSTRUCTIONS.md`.
- README uitgebreid met verwijzing naar de nieuwe documentatiebestanden.
- Datasetmetadata bijgewerkt naar versie `1.1.1` en update sequence `3`.


## v1.1.0 — 2026-05-02

- Scope expliciet vastgezet op **NL Hoofdklasse Heren/Dames 2025-2026**.
- `playersBase` en `playerRatings` gefilterd op deze scope.
- Non-NL spelers verrijkt met `foreignNationalTeamStatuses`, `isForeignSeniorInternational`, `foreignInternationalStatusSummary` en bronverwijzingen.
- Nieuwe review- en evidencebestanden toegevoegd voor buitenlandse internationals.
- Let op: records zonder officiële match blijven op `needs_review_no_official_match_yet`.


## v1.0.0 — 2026-05-02

Baseline versie met centrale versie-informatie toegevoegd. Deze versie bevat:

- Hoofdklasse-spelersbasis 2025-2026
- Nationaliteitsverrijking met bronstatus
- Trait-catalogus en trait-confidence structuur
- Media-evidence per team
- Oranje/Jong Oranje-statussen op basis van Hockey.nl-publicaties
- Reviewbestanden voor handmatige controle

Vanaf deze versie wordt bij iedere inhoudelijke datasetwijziging het versienummer en `updateSequence` opgehoogd.


## v1.2.0 - 2026-05-02

### Added
- Nieuwe positie-evidence-laag toegevoegd: `positionEvidence.ts/json`, `position-evidence.csv`, `position-review.csv`, `position-summary.json`.
- `playersBase.ts/json` bijgewerkt met expliciete posities waar deze in clubpagina's of Hockey.nl/media-publicaties gevonden zijn.

### Changed
- `datasetMeta` opgehoogd naar v1.2.0, updateSequence 4.
- `DATA_FILES.md` en `CLAUDE_DATA_INSTRUCTIONS.md` aangevuld met uitleg over positiebronnen.

### Notes
- Deze update verifieert 142 extra positie-records. Totaal staan nu 179 spelers met een bekende veldpositie/keeperpositie in de set; 342 blijven op `UNKNOWN` voor nadere review.


## v1.2.1 - 2026-05-02

### Status
additional_position_lookup_for_unknowns

### Wijzigingen
- Extra lookup uitgevoerd op spelers met `fieldPosition: UNKNOWN`.
- 32 extra expliciete positiehits toegevoegd aan `playersBase` en `positionEvidence`.
- Nieuwe controle-export toegevoegd: `position-lookup-added-v1.2.1.csv`.
- `position-review.csv` en `position-summary.json` opnieuw gegenereerd.

### Belangrijke regel
Alleen posities met expliciete bronvermelding zijn overgenomen. Spelers zonder expliciete positie blijven `UNKNOWN`.

## v1.3.0 - 2026-05-02

- Extra dataelement voor pasfoto/portrait toegevoegd aan `playersBase`.
- Nieuwe evidence-laag toegevoegd: `portraitEvidence.ts/json`, `portrait-evidence.csv`, `portrait-review.csv`, `portrait-summary.json`.
- Eerste clubsite-pass uitgevoerd voor Bloemendaal H1 en Den Bosch H1. Overige spelers blijven `portraitStatus: missing` voor follow-up.
- Let op: externe club/CDN-URL’s niet rehosten zonder toestemming.


## v1.4.0 - 2026-05-02

### Added
- Leeftijdvelden toegevoegd aan iedere speler in `playersBase.ts/json`: `birthDate`, `ageYears`, `ageAsOf`, `ageStatus`, `ageSource`, `ageSourceUrl`, `ageLastChecked`, `ageEvidenceIds`.
- Nieuwe landen/vlaggen-dataset toegevoegd: `playerCountries.ts/json` en `player-countries.csv`.
- Nieuwe leeftijd-evidence baseline toegevoegd: `ageEvidence.ts/json`, `age-review.csv`, `age-summary.json`.

### Notes
- Leeftijd is bewust niet gegokt. In deze baseline staan leeftijden op `missing` totdat een expliciete club-, FIH- of bond-bron is gevonden.
- Vlaggen zijn afgeleid van de nationaliteitscodes in `playersBase` en verwijzen naar FlagCDN URLs.


## v1.5.2 - 2026-05-02

### Status
version_folder_path_documented

### Changed
- Aangevuld dat de nieuwe datasetbestanden voor v1.5.1 staan in `src/data/v1.5.1/`.
- Versiemap `src/data/v1.5.1/` toegevoegd met kopieën van de databestanden en documentatie.
- Claude/Cursor-instructies bijgewerkt zodat deze versie-map als primaire databron wordt gebruikt.

### Notes
- De bestanden direct onder `src/data/` blijven beschikbaar voor backwards compatibility.
- Nieuwe app-implementaties en Claude-taken moeten bij voorkeur de bestanden uit `src/data/v1.5.1/` gebruiken.
