/**
 * Area-to-area movement times within destinations.
 * Used by the day builder to replace the flat 30-minute buffer with realistic transit estimates.
 *
 * Key format: "destination_slug:from_area:to_area"
 * Bidirectional — looked up both ways automatically.
 */

interface MovementEntry {
  minutes: number;
  method: "walk" | "train" | "bus" | "ferry";
}

const MOVEMENT_TIMES: Record<string, MovementEntry> = {
  // ================================================================
  // TOKYO
  // ================================================================
  "tokyo:asakusa:tsukiji": { minutes: 20, method: "train" },
  "tokyo:asakusa:shinjuku": { minutes: 30, method: "train" },
  "tokyo:asakusa:shibuya": { minutes: 35, method: "train" },
  "tokyo:asakusa:harajuku": { minutes: 35, method: "train" },
  "tokyo:asakusa:akihabara": { minutes: 15, method: "train" },
  "tokyo:asakusa:odaiba": { minutes: 40, method: "train" },
  "tokyo:asakusa:tokyo-station": { minutes: 20, method: "train" },
  "tokyo:tsukiji:shinjuku": { minutes: 25, method: "train" },
  "tokyo:tsukiji:shibuya": { minutes: 20, method: "train" },
  "tokyo:tsukiji:harajuku": { minutes: 25, method: "train" },
  "tokyo:tsukiji:akihabara": { minutes: 15, method: "train" },
  "tokyo:tsukiji:odaiba": { minutes: 25, method: "train" },
  "tokyo:tsukiji:tokyo-station": { minutes: 10, method: "walk" },
  "tokyo:shinjuku:shibuya": { minutes: 10, method: "train" },
  "tokyo:shinjuku:harajuku": { minutes: 5, method: "walk" },
  "tokyo:shinjuku:akihabara": { minutes: 25, method: "train" },
  "tokyo:shinjuku:odaiba": { minutes: 40, method: "train" },
  "tokyo:shinjuku:tokyo-station": { minutes: 15, method: "train" },
  "tokyo:shibuya:harajuku": { minutes: 5, method: "walk" },
  "tokyo:shibuya:akihabara": { minutes: 30, method: "train" },
  "tokyo:shibuya:odaiba": { minutes: 35, method: "train" },
  "tokyo:shibuya:tokyo-station": { minutes: 20, method: "train" },
  "tokyo:harajuku:akihabara": { minutes: 30, method: "train" },
  "tokyo:harajuku:odaiba": { minutes: 40, method: "train" },
  "tokyo:harajuku:tokyo-station": { minutes: 20, method: "train" },
  "tokyo:akihabara:odaiba": { minutes: 30, method: "train" },
  "tokyo:akihabara:tokyo-station": { minutes: 5, method: "train" },
  "tokyo:odaiba:tokyo-station": { minutes: 25, method: "train" },
  "tokyo:roppongi:shinjuku": { minutes: 15, method: "train" },
  "tokyo:roppongi:shibuya": { minutes: 10, method: "train" },
  "tokyo:roppongi:harajuku": { minutes: 15, method: "train" },
  "tokyo:roppongi:asakusa": { minutes: 30, method: "train" },
  "tokyo:roppongi:tsukiji": { minutes: 15, method: "train" },
  "tokyo:roppongi:akihabara": { minutes: 25, method: "train" },
  "tokyo:roppongi:odaiba": { minutes: 25, method: "train" },
  "tokyo:roppongi:tokyo-station": { minutes: 15, method: "train" },
  "tokyo:roppongi:ebisu": { minutes: 10, method: "train" },
  "tokyo:ebisu:shinjuku": { minutes: 10, method: "train" },
  "tokyo:ebisu:shibuya": { minutes: 5, method: "train" },
  "tokyo:ebisu:harajuku": { minutes: 10, method: "train" },
  "tokyo:ebisu:asakusa": { minutes: 30, method: "train" },
  "tokyo:ebisu:tsukiji": { minutes: 20, method: "train" },
  "tokyo:ebisu:akihabara": { minutes: 25, method: "train" },
  "tokyo:ebisu:odaiba": { minutes: 30, method: "train" },
  "tokyo:ebisu:tokyo-station": { minutes: 15, method: "train" },
  "tokyo:ueno:asakusa": { minutes: 10, method: "train" },
  "tokyo:ueno:tsukiji": { minutes: 15, method: "train" },
  "tokyo:ueno:shinjuku": { minutes: 20, method: "train" },
  "tokyo:ueno:shibuya": { minutes: 25, method: "train" },
  "tokyo:ueno:harajuku": { minutes: 25, method: "train" },
  "tokyo:ueno:akihabara": { minutes: 5, method: "train" },
  "tokyo:ueno:odaiba": { minutes: 35, method: "train" },
  "tokyo:ueno:tokyo-station": { minutes: 10, method: "train" },
  "tokyo:ueno:roppongi": { minutes: 20, method: "train" },
  "tokyo:ueno:ebisu": { minutes: 20, method: "train" },
  "tokyo:ueno:ginza": { minutes: 10, method: "train" },
  "tokyo:ginza:tsukiji": { minutes: 5, method: "walk" },
  "tokyo:ginza:tokyo-station": { minutes: 5, method: "walk" },
  "tokyo:ginza:asakusa": { minutes: 15, method: "train" },
  "tokyo:ginza:shinjuku": { minutes: 15, method: "train" },
  "tokyo:ginza:shibuya": { minutes: 15, method: "train" },
  "tokyo:ginza:harajuku": { minutes: 20, method: "train" },
  "tokyo:ginza:akihabara": { minutes: 10, method: "train" },
  "tokyo:ginza:odaiba": { minutes: 20, method: "train" },
  "tokyo:ginza:roppongi": { minutes: 10, method: "train" },
  "tokyo:ginza:ebisu": { minutes: 15, method: "train" },

  // ================================================================
  // KYOTO
  // ================================================================
  "kyoto:fushimi:central": { minutes: 15, method: "train" },
  "kyoto:fushimi:gion": { minutes: 20, method: "train" },
  "kyoto:fushimi:higashiyama": { minutes: 20, method: "train" },
  "kyoto:fushimi:arashiyama": { minutes: 40, method: "train" },
  "kyoto:fushimi:kinkakuji": { minutes: 35, method: "bus" },
  "kyoto:fushimi:pontocho": { minutes: 20, method: "train" },
  "kyoto:fushimi:kiyamachi": { minutes: 20, method: "train" },
  "kyoto:central:gion": { minutes: 10, method: "walk" },
  "kyoto:central:higashiyama": { minutes: 15, method: "bus" },
  "kyoto:central:arashiyama": { minutes: 25, method: "train" },
  "kyoto:central:kinkakuji": { minutes: 25, method: "bus" },
  "kyoto:central:pontocho": { minutes: 5, method: "walk" },
  "kyoto:central:kiyamachi": { minutes: 5, method: "walk" },
  "kyoto:gion:higashiyama": { minutes: 10, method: "walk" },
  "kyoto:gion:arashiyama": { minutes: 30, method: "train" },
  "kyoto:gion:kinkakuji": { minutes: 30, method: "bus" },
  "kyoto:gion:pontocho": { minutes: 5, method: "walk" },
  "kyoto:gion:kiyamachi": { minutes: 5, method: "walk" },
  "kyoto:higashiyama:arashiyama": { minutes: 35, method: "bus" },
  "kyoto:higashiyama:kinkakuji": { minutes: 30, method: "bus" },
  "kyoto:higashiyama:pontocho": { minutes: 15, method: "bus" },
  "kyoto:higashiyama:kiyamachi": { minutes: 15, method: "bus" },
  "kyoto:arashiyama:kinkakuji": { minutes: 20, method: "bus" },
  "kyoto:arashiyama:pontocho": { minutes: 25, method: "train" },
  "kyoto:arashiyama:kiyamachi": { minutes: 25, method: "train" },
  "kyoto:kinkakuji:pontocho": { minutes: 25, method: "bus" },
  "kyoto:kinkakuji:kiyamachi": { minutes: 25, method: "bus" },
  "kyoto:pontocho:kiyamachi": { minutes: 3, method: "walk" },

  // ================================================================
  // OSAKA
  // ================================================================
  "osaka:namba:osaka-castle": { minutes: 20, method: "train" },
  "osaka:namba:shinsekai": { minutes: 10, method: "train" },
  "osaka:namba:shinsaibashi": { minutes: 5, method: "walk" },
  "osaka:namba:universal-city": { minutes: 30, method: "train" },
  "osaka:osaka-castle:shinsekai": { minutes: 15, method: "train" },
  "osaka:osaka-castle:shinsaibashi": { minutes: 15, method: "train" },
  "osaka:osaka-castle:universal-city": { minutes: 35, method: "train" },
  "osaka:shinsekai:shinsaibashi": { minutes: 10, method: "train" },
  "osaka:shinsekai:universal-city": { minutes: 30, method: "train" },
  "osaka:shinsaibashi:universal-city": { minutes: 30, method: "train" },

  // ================================================================
  // KOBE
  // ================================================================
  "kobe:sannomiya:kitano": { minutes: 10, method: "walk" },
  "kobe:sannomiya:nada": { minutes: 15, method: "train" },
  "kobe:sannomiya:harborland": { minutes: 10, method: "walk" },
  "kobe:sannomiya:nankinmachi": { minutes: 5, method: "walk" },
  "kobe:kitano:nada": { minutes: 20, method: "train" },
  "kobe:kitano:harborland": { minutes: 15, method: "walk" },
  "kobe:kitano:nankinmachi": { minutes: 10, method: "walk" },
  "kobe:nada:harborland": { minutes: 20, method: "train" },
  "kobe:nada:nankinmachi": { minutes: 15, method: "train" },
  "kobe:harborland:nankinmachi": { minutes: 10, method: "walk" },

  // ================================================================
  // HIROSHIMA
  // ================================================================
  "hiroshima:central:miyajima": { minutes: 60, method: "ferry" },
};

/** Default movement time when no specific route exists (minutes) */
const SAME_AREA_DEFAULT = 10;
const UNKNOWN_ROUTE_DEFAULT = 20;

/**
 * Get estimated movement time between two activities.
 * Returns minutes and method, checking both directions.
 */
export function getMovementTime(
  destinationSlug: string,
  fromArea: string | undefined,
  toArea: string | undefined
): MovementEntry {
  if (!fromArea || !toArea) return { minutes: UNKNOWN_ROUTE_DEFAULT, method: "train" };
  if (fromArea === toArea) return { minutes: SAME_AREA_DEFAULT, method: "walk" };

  const key1 = `${destinationSlug}:${fromArea}:${toArea}`;
  const key2 = `${destinationSlug}:${toArea}:${fromArea}`;

  return MOVEMENT_TIMES[key1] ?? MOVEMENT_TIMES[key2] ?? { minutes: UNKNOWN_ROUTE_DEFAULT, method: "train" };
}
