import type { Player } from '../types';

// Fan-made fictional ratings. Not affiliated with KNHB, FIH, or any club.
export const players: Player[] = [
  // === NEDERLAND HEREN INTERNATIONALS ===
  { id: 'nl-m-001', name: 'Thierry Brinkman', gender: 'male', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'ATT', rating: 95, rarity: 'Icon', traits: ['Speed', 'Dragflick', 'Vision'], source: 'FIH' },
  { id: 'nl-m-009', name: 'Thijs Peters', gender: 'male', nationality: 'NL', club: 'Den Bosch', teamType: 'Both', position: 'ATT', rating: 99, rarity: 'Icon', traits: ['1v1 Skill', 'Passing', 'Turn'], source: 'HM' },
  { id: 'nl-m-002', name: 'Florent van Aubel', gender: 'male', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'ATT', rating: 91, rarity: 'Elite', traits: ['Speed', '1v1 Skill', 'Passing'], source: 'FIH' },
  { id: 'nl-m-003', name: 'Seve van Ass', gender: 'male', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'MID', rating: 90, rarity: 'Elite', traits: ['Vision', 'Passing', 'Leadership'], source: 'FIH' },
  { id: 'nl-m-004', name: 'Jonas de Geus', gender: 'male', nationality: 'NL', club: 'Rotterdam', teamType: 'Both', position: 'DEF', rating: 88, rarity: 'Elite', traits: ['Interceptions', 'Leadership'], source: 'FIH' },
  { id: 'nl-m-005', name: 'Pirmin Blaak', gender: 'male', nationality: 'NL', club: 'Oranje-Rood', teamType: 'Both', position: 'DEF', rating: 92, rarity: 'Icon', traits: ['Dragflick', 'Shoot Power', 'Leadership'], source: 'FIH' },
  { id: 'nl-m-006', name: 'Tristan Algera', gender: 'male', nationality: 'NL', club: 'Rotterdam', teamType: 'Both', position: 'GK', rating: 89, rarity: 'Elite', traits: ['1v1 Skill', 'Leadership'], source: 'FIH' },
  { id: 'nl-m-007', name: 'Jip Janssen', gender: 'male', nationality: 'NL', club: 'Kampong', teamType: 'Both', position: 'DEF', rating: 87, rarity: 'Gold', traits: ['Interceptions', 'Passing'], source: 'FIH' },
  { id: 'nl-m-008', name: 'Dico Tromp', gender: 'male', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'MID', rating: 86, rarity: 'Gold', traits: ['Passing', 'Speed'], source: 'FIH' },

  // === NEDERLAND DAMES INTERNATIONALS ===
  { id: 'nl-f-001', name: 'Felice Albers', gender: 'female', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'ATT', rating: 96, rarity: 'Icon', traits: ['Speed', '1v1 Skill', 'Vision'], source: 'FIH' },
  { id: 'nl-f-002', name: 'Frederique Matla', gender: 'female', nationality: 'NL', club: 'Rotterdam', teamType: 'Both', position: 'ATT', rating: 93, rarity: 'Icon', traits: ['Shoot Power', 'Speed', 'Dragflick'], source: 'FIH' },
  { id: 'nl-f-003', name: 'Maria Verschoor', gender: 'female', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'ATT', rating: 92, rarity: 'Icon', traits: ['Dragflick', 'Passing', 'Vision'], source: 'FIH' },
  { id: 'nl-f-004', name: 'Xan de Waard', gender: 'female', nationality: 'NL', club: 'Rotterdam', teamType: 'Both', position: 'MID', rating: 91, rarity: 'Elite', traits: ['Vision', 'Passing', 'Speed'], source: 'FIH' },
  { id: 'nl-f-005', name: 'Joosje Burg', gender: 'female', nationality: 'NL', club: 'Kampong', teamType: 'Both', position: 'DEF', rating: 89, rarity: 'Elite', traits: ['Interceptions', 'Leadership'], source: 'FIH' },
  { id: 'nl-f-006', name: 'Anne Veenendaal', gender: 'female', nationality: 'NL', club: 'Amsterdam', teamType: 'Both', position: 'GK', rating: 94, rarity: 'Icon', traits: ['1v1 Skill', 'Leadership', 'Vision'], source: 'FIH' },
  { id: 'nl-f-007', name: 'Pien Dicke', gender: 'female', nationality: 'NL', club: 'Oranje-Rood', teamType: 'Both', position: 'DEF', rating: 87, rarity: 'Gold', traits: ['Interceptions', 'Speed'], source: 'FIH' },

  // === DUITSLAND HEREN ===
  { id: 'de-m-001', name: 'Mats Grambusch', gender: 'male', nationality: 'DE', club: 'Hamburg', teamType: 'International', position: 'MID', rating: 91, rarity: 'Elite', traits: ['Vision', 'Passing', 'Leadership'], source: 'FIH' },
  { id: 'de-m-002', name: 'Niklas Wellen', gender: 'male', nationality: 'DE', club: 'Uhlenhorst', teamType: 'International', position: 'ATT', rating: 89, rarity: 'Elite', traits: ['Speed', 'Shoot Power'], source: 'FIH' },
  { id: 'de-m-003', name: 'Gonzalo Peillat', gender: 'male', nationality: 'DE', club: 'Hamburg', teamType: 'International', position: 'DEF', rating: 93, rarity: 'Icon', traits: ['Dragflick', 'Shoot Power', 'Leadership'], source: 'FIH' },
  { id: 'de-m-004', name: 'Christopher Rühr', gender: 'male', nationality: 'DE', club: 'Uhlenhorst', teamType: 'International', position: 'ATT', rating: 88, rarity: 'Elite', traits: ['Speed', '1v1 Skill'], source: 'FIH' },

  // === DUITSLAND DAMES ===
  { id: 'de-f-001', name: 'Anne Schröder', gender: 'female', nationality: 'DE', club: 'Hamburg', teamType: 'International', position: 'ATT', rating: 88, rarity: 'Elite', traits: ['Speed', 'Shoot Power'], source: 'FIH' },
  { id: 'de-f-002', name: 'Charlotte Stapenhorst', gender: 'female', nationality: 'DE', club: 'Hamburg', teamType: 'International', position: 'ATT', rating: 90, rarity: 'Elite', traits: ['Speed', '1v1 Skill', 'Vision'], source: 'FIH' },
  { id: 'de-f-003', name: 'Nike Lorenz', gender: 'female', nationality: 'DE', club: 'Hamburg', teamType: 'International', position: 'DEF', rating: 87, rarity: 'Gold', traits: ['Dragflick', 'Interceptions'], source: 'FIH' },

  // === SPANJE HEREN ===
  { id: 'es-m-001', name: 'Marc Miralles', gender: 'male', nationality: 'ES', club: 'Club de Campo', teamType: 'International', position: 'GK', rating: 87, rarity: 'Gold', traits: ['1v1 Skill', 'Leadership'], source: 'FIH' },
  { id: 'es-m-002', name: 'Pau Quemada', gender: 'male', nationality: 'ES', club: 'Junior FC', teamType: 'International', position: 'ATT', rating: 86, rarity: 'Gold', traits: ['Speed', '1v1 Skill'], source: 'FIH' },
  { id: 'es-m-003', name: 'Marc Bolto', gender: 'male', nationality: 'ES', club: 'Real Club de Polo', teamType: 'International', position: 'MID', rating: 85, rarity: 'Gold', traits: ['Passing', 'Vision'], source: 'FIH' },

  // === SPANJE DAMES ===
  { id: 'es-f-001', name: 'Berta Bonastre', gender: 'female', nationality: 'ES', club: 'Junior FC', teamType: 'International', position: 'GK', rating: 86, rarity: 'Gold', traits: ['1v1 Skill', 'Leadership'], source: 'FIH' },
  { id: 'es-f-002', name: 'Lola Riera', gender: 'female', nationality: 'ES', club: 'Atlètic Terrassa', teamType: 'International', position: 'ATT', rating: 85, rarity: 'Gold', traits: ['Speed', 'Shoot Power'], source: 'FIH' },

  // === TULP HOOFDKLASSE HEREN ===
  { id: 'hkh-m-001', name: 'Tim Rooijakkers', gender: 'male', nationality: 'NL', club: 'Oranje-Rood', teamType: 'Hoofdklasse', position: 'ATT', rating: 83, rarity: 'Gold', traits: ['Speed', 'Shoot Power'], source: 'KNHB' },
  { id: 'hkh-m-002', name: 'Sander de Wijn', gender: 'male', nationality: 'NL', club: 'Amsterdam', teamType: 'Hoofdklasse', position: 'MID', rating: 81, rarity: 'Gold', traits: ['Passing', 'Vision'], source: 'KNHB' },
  { id: 'hkh-m-003', name: 'Lars Balk', gender: 'male', nationality: 'NL', club: 'Kampong', teamType: 'Hoofdklasse', position: 'DEF', rating: 79, rarity: 'Silver', traits: ['Interceptions'], source: 'KNHB' },
  { id: 'hkh-m-004', name: 'Jorrit Croon', gender: 'male', nationality: 'NL', club: 'Rotterdam', teamType: 'Hoofdklasse', position: 'GK', rating: 80, rarity: 'Gold', traits: ['1v1 Skill'], source: 'KNHB' },
  { id: 'hkh-m-005', name: 'Koen Bijen', gender: 'male', nationality: 'NL', club: 'Bloemendaal', teamType: 'Hoofdklasse', position: 'ATT', rating: 77, rarity: 'Silver', traits: ['Speed', '1v1 Skill'], source: 'KNHB' },
  { id: 'hkh-m-006', name: 'Pepijn Wielheesen', gender: 'male', nationality: 'NL', club: 'Tilburg', teamType: 'Hoofdklasse', position: 'MID', rating: 74, rarity: 'Silver', traits: ['Passing'], source: 'KNHB' },
  { id: 'hkh-m-007', name: 'Dylan Castelein', gender: 'male', nationality: 'NL', club: 'Den Bosch', teamType: 'Hoofdklasse', position: 'ATT', rating: 72, rarity: 'Silver', traits: ['Speed'], source: 'KNHB' },
  { id: 'hkh-m-008', name: 'Niels Senden', gender: 'male', nationality: 'NL', club: 'Oranje-Rood', teamType: 'Hoofdklasse', position: 'DEF', rating: 70, rarity: 'Silver', traits: ['Interceptions'], source: 'KNHB' },
  { id: 'hkh-m-009', name: 'Ruben Punt', gender: 'male', nationality: 'NL', club: 'Bloemendaal', teamType: 'Hoofdklasse', position: 'MID', rating: 68, rarity: 'Bronze', traits: ['Passing'], source: 'KNHB' },
  { id: 'hkh-m-010', name: 'Thomas Beulens', gender: 'male', nationality: 'NL', club: 'Kampong', teamType: 'Hoofdklasse', position: 'DEF', rating: 65, rarity: 'Bronze', traits: ['Interceptions'], source: 'KNHB' },

  // === TULP HOOFDKLASSE DAMES ===
  { id: 'hkd-f-001', name: 'Yibbi Jansen', gender: 'female', nationality: 'NL', club: 'Den Bosch', teamType: 'Hoofdklasse', position: 'ATT', rating: 84, rarity: 'Gold', traits: ['Speed', '1v1 Skill', 'Dragflick'], source: 'KNHB' },
  { id: 'hkd-f-002', name: 'Lisa Lejeune', gender: 'female', nationality: 'NL', club: 'Amsterdam', teamType: 'Hoofdklasse', position: 'MID', rating: 82, rarity: 'Gold', traits: ['Passing', 'Vision'], source: 'KNHB' },
  { id: 'hkd-f-003', name: 'Pien van Kleef', gender: 'female', nationality: 'NL', club: 'Oranje-Rood', teamType: 'Hoofdklasse', position: 'DEF', rating: 80, rarity: 'Gold', traits: ['Interceptions', 'Leadership'], source: 'KNHB' },
  { id: 'hkd-f-004', name: 'Floor de Haan', gender: 'female', nationality: 'NL', club: 'Rotterdam', teamType: 'Hoofdklasse', position: 'GK', rating: 78, rarity: 'Silver', traits: ['1v1 Skill'], source: 'KNHB' },
  { id: 'hkd-f-005', name: 'Bente Broeder', gender: 'female', nationality: 'NL', club: 'Kampong', teamType: 'Hoofdklasse', position: 'ATT', rating: 76, rarity: 'Silver', traits: ['Speed', 'Shoot Power'], source: 'KNHB' },
  { id: 'hkd-f-006', name: 'Sophie Schreiber', gender: 'female', nationality: 'NL', club: 'Bloemendaal', teamType: 'Hoofdklasse', position: 'MID', rating: 73, rarity: 'Silver', traits: ['Passing'], source: 'KNHB' },
  { id: 'hkd-f-007', name: 'Maud Simons', gender: 'female', nationality: 'NL', club: 'Den Bosch', teamType: 'Hoofdklasse', position: 'DEF', rating: 71, rarity: 'Silver', traits: ['Interceptions'], source: 'KNHB' },
  { id: 'hkd-f-008', name: 'Loes Janssen', gender: 'female', nationality: 'NL', club: 'Tilburg', teamType: 'Hoofdklasse', position: 'ATT', rating: 67, rarity: 'Bronze', traits: ['Speed'], source: 'KNHB' },
  { id: 'hkd-f-009', name: 'Nina van der Berg', gender: 'female', nationality: 'NL', club: 'Rotterdam', teamType: 'Hoofdklasse', position: 'MID', rating: 64, rarity: 'Bronze', traits: ['Passing'], source: 'KNHB' },
  { id: 'hkd-f-010', name: 'Eva Dommerholt', gender: 'female', nationality: 'NL', club: 'Kampong', teamType: 'Hoofdklasse', position: 'GK', rating: 62, rarity: 'Bronze', traits: ['1v1 Skill'], source: 'KNHB' },
];
