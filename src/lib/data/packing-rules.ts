/**
 * Packing list rules based on season, activity types, and destination tags.
 */

export interface PackingItem {
  name: string;
  category: "clothing" | "gear" | "essentials" | "toiletries" | "tech";
  reason: string;
}

// Always pack these
const ESSENTIALS: PackingItem[] = [
  { name: "Passport", category: "essentials", reason: "Required for entry" },
  { name: "Travel insurance docs", category: "essentials", reason: "Keep accessible" },
  { name: "Yen cash (¥30,000+)", category: "essentials", reason: "Many places are cash-only" },
  { name: "IC card (Suica/Pasmo)", category: "essentials", reason: "Buy at any station for trains & convenience stores" },
  { name: "Portable charger", category: "tech", reason: "Long days out drain batteries fast" },
  { name: "Universal power adapter", category: "tech", reason: "Japan uses Type A plugs (same as US)" },
  { name: "Comfortable walking shoes", category: "clothing", reason: "You'll walk 15,000+ steps daily" },
  { name: "Small day bag/backpack", category: "gear", reason: "For daily excursions" },
  { name: "Reusable water bottle", category: "gear", reason: "Tap water is safe, refill stations at stations" },
  { name: "Basic toiletries", category: "toiletries", reason: "Though Japanese drugstores are excellent" },
  { name: "Handkerchief/hand towel", category: "essentials", reason: "Many restrooms lack paper towels" },
  { name: "Pocket tissues", category: "essentials", reason: "Often handed out free, useful everywhere" },
];

const SEASON_ITEMS: Record<string, PackingItem[]> = {
  spring: [
    { name: "Light layers/cardigan", category: "clothing", reason: "Temperatures vary 10-20°C" },
    { name: "Light rain jacket", category: "clothing", reason: "Spring showers are common" },
    { name: "Allergy medication", category: "essentials", reason: "Cedar pollen peaks in March-April" },
  ],
  summer: [
    { name: "Lightweight breathable clothing", category: "clothing", reason: "Hot and humid (30°C+)" },
    { name: "Sunscreen SPF 50+", category: "toiletries", reason: "Strong UV, especially at altitude" },
    { name: "Folding fan or portable fan", category: "gear", reason: "Essential in the humid heat" },
    { name: "Cooling towel", category: "gear", reason: "Wet and drape around neck" },
    { name: "Compact umbrella", category: "gear", reason: "Sudden summer storms and rainy season (June)" },
    { name: "Insect repellent", category: "toiletries", reason: "Mosquitoes near shrines and parks" },
  ],
  autumn: [
    { name: "Medium-weight jacket", category: "clothing", reason: "Cool mornings/evenings (10-20°C)" },
    { name: "Layers", category: "clothing", reason: "Temperature swings throughout the day" },
    { name: "Compact umbrella", category: "gear", reason: "October rain is common" },
  ],
  winter: [
    { name: "Warm winter coat", category: "clothing", reason: "Cold, especially in Tohoku/Hokkaido" },
    { name: "Thermal base layers", category: "clothing", reason: "Indoor heating can be minimal" },
    { name: "Warm hat and gloves", category: "clothing", reason: "Cold winds, especially near coast" },
    { name: "Hand warmers (kairo)", category: "gear", reason: "Available at convenience stores too" },
    { name: "Moisturizer/lip balm", category: "toiletries", reason: "Dry winter air" },
  ],
};

// Items triggered by activity types
const ACTIVITY_ITEMS: Record<string, PackingItem[]> = {
  onsen: [
    { name: "Modesty towel (small)", category: "gear", reason: "For onsen bathing (large towels provided)" },
    { name: "Waterproof bag", category: "gear", reason: "Keep clothes dry at onsen" },
  ],
  nature: [
    { name: "Hiking shoes/boots", category: "clothing", reason: "Trails can be steep and uneven" },
    { name: "Rain poncho", category: "gear", reason: "Mountain weather is unpredictable" },
  ],
  temples: [
    { name: "Slip-on shoes", category: "clothing", reason: "Frequent shoe removal at temples" },
    { name: "Modest clothing", category: "clothing", reason: "Cover shoulders and knees at temples" },
    { name: "¥100 coins", category: "essentials", reason: "For shrine offerings and lockers" },
  ],
  nightlife: [
    { name: "Smart casual outfit", category: "clothing", reason: "Some bars have dress codes" },
  ],
  beach: [
    { name: "Swimsuit", category: "clothing", reason: "For beach days" },
    { name: "Reef-safe sunscreen", category: "toiletries", reason: "Protect Okinawan coral" },
    { name: "Water shoes", category: "clothing", reason: "Rocky beaches in some areas" },
  ],
  skiing: [
    { name: "Ski/snowboard gear or rental reservation", category: "gear", reason: "Book rentals in advance for popular resorts" },
    { name: "Goggles and neck gaiter", category: "gear", reason: "Powder days can be intense" },
    { name: "Waterproof pants", category: "clothing", reason: "For deep snow" },
  ],
  shopping: [
    { name: "Extra foldable bag", category: "gear", reason: "For souvenirs — plastic bags cost extra" },
    { name: "Tax-free passport copies", category: "essentials", reason: "Stores need passport for tax-free purchases over ¥5,000" },
  ],
};

export function generatePackingList(
  season: string,
  activityTags: string[]
): PackingItem[] {
  const items = [...ESSENTIALS];
  const seen = new Set(items.map((i) => i.name));

  // Season-specific items
  const seasonItems = SEASON_ITEMS[season] ?? SEASON_ITEMS.spring;
  for (const item of seasonItems) {
    if (!seen.has(item.name)) {
      items.push(item);
      seen.add(item.name);
    }
  }

  // Activity-specific items
  for (const tag of activityTags) {
    const tagItems = ACTIVITY_ITEMS[tag];
    if (!tagItems) continue;
    for (const item of tagItems) {
      if (!seen.has(item.name)) {
        items.push(item);
        seen.add(item.name);
      }
    }
  }

  return items;
}
