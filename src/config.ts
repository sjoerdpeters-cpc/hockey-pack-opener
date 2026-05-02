import type { Rarity } from './types';

// Verkoopprijs per kaarttype in coins.
// Pas hier de waarden aan om de balans te wijzigen.
export const SELL_PRICES: Record<Rarity, number> = {
  Bronze:  50,
  Silver:  150,
  Gold:    400,
  Elite:   1_200,
  Icon:    3_000,
  Special: 5_000,
};
