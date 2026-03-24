/**
 * Day templates — pre-built thematic day plans for each destination.
 * Activity IDs reference the catalog in seed-activities.ts using the
 * "{destination_slug}-{activity-slug}" convention.
 */

import type { InterestTag, TripPace } from "@/types";

export interface DayTemplate {
  id: string;
  destination_slug: string;
  name: string;
  description: string;
  target_interests: InterestTag[];
  activity_ids: string[];
  suggested_pace: TripPace;
}

export const DAY_TEMPLATES: DayTemplate[] = [
  // ============================================================
  // TOKYO
  // ============================================================
  {
    id: "tokyo-classic-day",
    destination_slug: "tokyo",
    name: "Classic Tokyo Day",
    description:
      "The quintessential first-timer route hitting Senso-ji, Meiji Shrine, Shibuya Crossing, and Harajuku in one satisfying sweep.",
    target_interests: ["culture", "shopping", "temples"],
    activity_ids: [
      "tokyo-senso-ji",
      "tokyo-meiji-shrine",
      "tokyo-shibuya-crossing",
      "tokyo-akihabara",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "tokyo-foodie-day",
    destination_slug: "tokyo",
    name: "Tokyo Eats & Beats",
    description:
      "A dawn-to-dark feast through Tsukiji Market, Yanaka backstreets, and the tiny bars of Golden Gai.",
    target_interests: ["food", "nightlife", "culture"],
    activity_ids: [
      "tokyo-tsukiji-outer-market",
      "tokyo-yanaka-walk",
      "tokyo-shinjuku-golden-gai",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "tokyo-pop-culture-day",
    destination_slug: "tokyo",
    name: "Neon & Pixels",
    description:
      "Dive into Tokyo's pop-culture universe with Akihabara arcades, TeamLab immersive art, and late-night Shinjuku.",
    target_interests: ["shopping", "culture", "nightlife"],
    activity_ids: [
      "tokyo-akihabara",
      "tokyo-teamlab-borderless",
      "tokyo-shibuya-crossing",
      "tokyo-shinjuku-golden-gai",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // KYOTO
  // ============================================================
  {
    id: "kyoto-zen-day",
    destination_slug: "kyoto",
    name: "Zen Kyoto",
    description:
      "A serene morning at Fushimi Inari, the golden gleam of Kinkaku-ji, and a quiet tea ceremony to close the day.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "kyoto-fushimi-inari",
      "kyoto-kinkaku-ji",
      "kyoto-tea-ceremony",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kyoto-iconic-day",
    destination_slug: "kyoto",
    name: "Iconic Kyoto",
    description:
      "All the greatest hits in a single ambitious day — Kiyomizu-dera, Nishiki Market, and an evening stroll through Gion.",
    target_interests: ["temples", "food", "culture"],
    activity_ids: [
      "kyoto-kiyomizu-dera",
      "kyoto-nishiki-market",
      "kyoto-gion-evening",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "kyoto-nature-day",
    destination_slug: "kyoto",
    name: "Bamboo & Beyond",
    description:
      "Lose yourself in the towering bamboo of Arashiyama, meet wild macaques, and wander the mossy trails west of the city.",
    target_interests: ["nature", "culture", "temples"],
    activity_ids: [
      "kyoto-arashiyama-bamboo",
      "kyoto-fushimi-inari",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // OSAKA
  // ============================================================
  {
    id: "osaka-foodie-day",
    destination_slug: "osaka",
    name: "Foodie's Osaka",
    description:
      "Graze from Kuromon Market through Shinsekai's kushikatsu joints, and end under the neon glow of Dotonbori.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "osaka-kuromon-market",
      "osaka-shinsekai",
      "osaka-dotonbori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "osaka-culture-day",
    destination_slug: "osaka",
    name: "Castle & Culture",
    description:
      "Explore Osaka Castle's storied grounds, browse Shinsaibashi's shops, and close with street food along the canal.",
    target_interests: ["culture", "shopping", "food"],
    activity_ids: [
      "osaka-castle",
      "osaka-shinsaibashi",
      "osaka-dotonbori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "osaka-thrill-day",
    destination_slug: "osaka",
    name: "Thrills & Eats",
    description:
      "Spend the day at Universal Studios Japan, then refuel with takoyaki and ramen in the neon heart of the city.",
    target_interests: ["adventure", "food", "nightlife"],
    activity_ids: [
      "osaka-universal-studios",
      "osaka-dotonbori",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // HAKONE
  // ============================================================
  {
    id: "hakone-onsen-day",
    destination_slug: "hakone",
    name: "Soak & Scenery",
    description:
      "A lazy loop of Lake Ashi cruises, Owakudani's volcanic steam, and a sunset soak in a mountain onsen.",
    target_interests: ["onsen", "nature"],
    activity_ids: [
      "hakone-lake-ashi-cruise",
      "hakone-owakudani",
      "hakone-onsen-ryokan",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "hakone-art-nature-day",
    destination_slug: "hakone",
    name: "Art in the Mountains",
    description:
      "Wander the Open-Air Museum's sculpture garden, ride the ropeway over volcanic vents, and enjoy Mt. Fuji views from the lake.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "hakone-open-air-museum",
      "hakone-ropeway",
      "hakone-lake-ashi-cruise",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // HIROSHIMA
  // ============================================================
  {
    id: "hiroshima-peace-day",
    destination_slug: "hiroshima",
    name: "Peace & Remembrance",
    description:
      "A reflective morning at the Peace Memorial Park and Museum, followed by Hiroshima's legendary okonomiyaki.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "hiroshima-peace-memorial-park",
      "hiroshima-atomic-bomb-dome",
      "hiroshima-okonomiyaki",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "hiroshima-miyajima-day",
    destination_slug: "hiroshima",
    name: "Miyajima Island Escape",
    description:
      "Ferry to Miyajima to see the floating torii gate, hike Mt. Misen, and taste freshly grilled oysters by the water.",
    target_interests: ["temples", "nature", "food"],
    activity_ids: [
      "hiroshima-miyajima-island",
      "hiroshima-itsukushima-shrine",
      "hiroshima-mt-misen-hike",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // NARA
  // ============================================================
  {
    id: "nara-deer-temples-day",
    destination_slug: "nara",
    name: "Deer Park & Ancient Temples",
    description:
      "Feed the bowing deer, stand beneath the Great Buddha at Todai-ji, and explore the lantern-lined paths of Kasuga Shrine.",
    target_interests: ["temples", "nature", "culture"],
    activity_ids: [
      "nara-deer-park",
      "nara-todai-ji",
      "nara-kasuga-shrine",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "nara-full-day",
    destination_slug: "nara",
    name: "Complete Nara",
    description:
      "A thorough exploration pairing all the major shrines with quiet strolls through Isuien Garden and the old merchant quarter of Naramachi.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "nara-todai-ji",
      "nara-kasuga-shrine",
      "nara-isuien-garden",
      "nara-naramachi",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // KAMAKURA
  // ============================================================
  {
    id: "kamakura-temple-day",
    destination_slug: "kamakura",
    name: "Temple Trail to the Sea",
    description:
      "Walk from the Great Buddha through ancient hillside temples, ending at the ocean with Enoshima Island glowing in the distance.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "kamakura-great-buddha",
      "kamakura-hase-dera",
      "kamakura-tsurugaoka-hachimangu",
      "kamakura-komachi-dori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "kamakura-beach-day",
    destination_slug: "kamakura",
    name: "Surf & Shrine",
    description:
      "Mix sacred with seaside — temples in the morning, Enoshima Island caves in the afternoon, and sunset over the Pacific.",
    target_interests: ["beach", "temples", "nature"],
    activity_ids: [
      "kamakura-great-buddha",
      "kamakura-enoshima-island",
      "kamakura-beach",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // NIKKO
  // ============================================================
  {
    id: "nikko-shrine-day",
    destination_slug: "nikko",
    name: "Gilded Shrines of Nikko",
    description:
      "Marvel at the ornate Toshogu Shrine complex, cross the sacred Shinkyo Bridge, and wander among the stone Jizo statues of Kanmangafuchi.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "nikko-toshogu-shrine",
      "nikko-shinkyo-bridge",
      "nikko-kanmangafuchi",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "nikko-nature-day",
    destination_slug: "nikko",
    name: "Waterfalls & Highland Lakes",
    description:
      "Head up to Lake Chuzenji and Kegon Falls, hike through old-growth forest, and soak in Yumoto onsen at dusk.",
    target_interests: ["nature", "onsen"],
    activity_ids: [
      "nikko-kegon-falls",
      "nikko-lake-chuzenji",
      "nikko-yumoto-onsen",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // TAKAYAMA
  // ============================================================
  {
    id: "takayama-old-town-day",
    destination_slug: "takayama",
    name: "Edo-era Morning to Night",
    description:
      "Browse the morning market at dawn, stroll the dark-wood merchant streets, sample sake in centuries-old breweries, and feast on melt-in-your-mouth Hida beef.",
    target_interests: ["culture", "food"],
    activity_ids: [
      "takayama-morning-market",
      "takayama-sanmachi-suji",
      "takayama-sake-breweries",
      "takayama-hida-beef",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "takayama-heritage-day",
    destination_slug: "takayama",
    name: "Alpine Heritage",
    description:
      "Explore thatched-roof farmhouses at Hida Folk Village and learn about mountain life in the Japanese Alps.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "takayama-hida-folk-village",
      "takayama-sanmachi-suji",
      "takayama-morning-market",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // KANAZAWA
  // ============================================================
  {
    id: "kanazawa-garden-culture-day",
    destination_slug: "kanazawa",
    name: "Gardens & Geisha Streets",
    description:
      "Wander Kenroku-en at its seasonal best, step into a samurai residence, and sip gold-leaf tea in the geisha quarter.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "kanazawa-kenroku-en",
      "kanazawa-higashi-chaya",
      "kanazawa-nagamachi-samurai",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kanazawa-food-art-day",
    destination_slug: "kanazawa",
    name: "Market Fresh & Modern Art",
    description:
      "Start with the freshest seafood at Omicho Market, then explore the boundary-pushing 21st Century Museum of Contemporary Art.",
    target_interests: ["food", "culture", "shopping"],
    activity_ids: [
      "kanazawa-omicho-market",
      "kanazawa-21st-century-museum",
      "kanazawa-higashi-chaya",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // SAPPORO
  // ============================================================
  {
    id: "sapporo-taste-of-hokkaido",
    destination_slug: "sapporo",
    name: "Taste of Hokkaido",
    description:
      "Feast your way through Nijo Market crab and uni, slurp legendary miso ramen on Ramen Alley, and finish with Sapporo beer at the brewery.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "sapporo-nijo-market",
      "sapporo-ramen-alley",
      "sapporo-beer-museum",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "sapporo-city-night-day",
    destination_slug: "sapporo",
    name: "Snow City After Dark",
    description:
      "Stroll Odori Park, catch the Snow Festival illuminations (winter), and dive into the buzzing Susukino nightlife district.",
    target_interests: ["nightlife", "culture", "food"],
    activity_ids: [
      "sapporo-odori-park",
      "sapporo-snow-festival",
      "sapporo-susukino",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "sapporo-ski-day",
    destination_slug: "sapporo",
    name: "City Slopes",
    description:
      "Hit the slopes at a nearby resort in the morning, then warm up with ramen and craft beer back in the city.",
    target_interests: ["skiing", "food"],
    activity_ids: [
      "sapporo-ski-resort",
      "sapporo-ramen-alley",
      "sapporo-beer-museum",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // NISEKO
  // ============================================================
  {
    id: "niseko-powder-day",
    destination_slug: "niseko",
    name: "Legendary Powder Day",
    description:
      "Carve through Niseko's world-famous dry powder, refuel with craft beer in Hirafu Village, and thaw in a steaming outdoor onsen.",
    target_interests: ["skiing", "onsen"],
    activity_ids: [
      "niseko-skiing",
      "niseko-craft-beer",
      "niseko-onsen",
    ],
    suggested_pace: "packed",
  },
  {
    id: "niseko-adventure-day",
    destination_slug: "niseko",
    name: "Mountain Adventures",
    description:
      "Raft the Shiribetsu River in summer, hike toward Mt. Yotei's cone, and end with a well-earned soak overlooking the valley.",
    target_interests: ["adventure", "nature", "onsen"],
    activity_ids: [
      "niseko-rafting",
      "niseko-mt-yotei-hike",
      "niseko-onsen",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // FUKUOKA
  // ============================================================
  {
    id: "fukuoka-yatai-night",
    destination_slug: "fukuoka",
    name: "Yatai Street Food Crawl",
    description:
      "Spend the evening hopping between riverfront yatai stalls for tonkotsu ramen, gyoza, and yakitori under the lanterns.",
    target_interests: ["food", "nightlife"],
    activity_ids: [
      "fukuoka-yatai-stalls",
      "fukuoka-hakata-ramen",
      "fukuoka-nakasu-nightlife",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "fukuoka-culture-day",
    destination_slug: "fukuoka",
    name: "Shrines, Parks & Ramen",
    description:
      "Day-trip to Dazaifu Tenmangu shrine, stroll Ohori Park's lakeside paths, and circle back for a bowl of Hakata's finest.",
    target_interests: ["culture", "food", "nature"],
    activity_ids: [
      "fukuoka-dazaifu-tenmangu",
      "fukuoka-ohori-park",
      "fukuoka-hakata-ramen",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "fukuoka-beach-city-day",
    destination_slug: "fukuoka",
    name: "Beach & Canal City",
    description:
      "Catch morning sun at Momochi Beach, wander the Canal City shopping complex, and wind down with seaside cocktails.",
    target_interests: ["beach", "shopping", "nightlife"],
    activity_ids: [
      "fukuoka-momochi-beach",
      "fukuoka-canal-city",
      "fukuoka-nakasu-nightlife",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // OKINAWA (okinawa-main)
  // ============================================================
  {
    id: "okinawa-beach-day",
    destination_slug: "okinawa-main",
    name: "Tropical Beach Day",
    description:
      "Snorkel the Blue Cave in the morning, laze on white-sand beaches in the afternoon, and watch the sun drop into the East China Sea.",
    target_interests: ["beach", "adventure", "nature"],
    activity_ids: [
      "okinawa-main-blue-cave-snorkeling",
      "okinawa-main-beach",
      "okinawa-main-sunset-cruise",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "okinawa-culture-day",
    destination_slug: "okinawa-main",
    name: "Ryukyu Kingdom",
    description:
      "Explore the rebuilt Shuri Castle, browse Kokusai Street for Okinawan crafts, and taste unique island cuisine like goya champuru and soki soba.",
    target_interests: ["culture", "food", "shopping"],
    activity_ids: [
      "okinawa-main-shuri-castle",
      "okinawa-main-kokusai-street",
      "okinawa-main-okinawan-cuisine",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "okinawa-aquarium-day",
    destination_slug: "okinawa-main",
    name: "Ocean Explorer",
    description:
      "Drive north to the jaw-dropping Churaumi Aquarium, swim at Emerald Beach, and stop at American Village on the way back.",
    target_interests: ["nature", "beach", "culture"],
    activity_ids: [
      "okinawa-main-churaumi-aquarium",
      "okinawa-main-emerald-beach",
      "okinawa-main-american-village",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // KOBE
  // ============================================================
  {
    id: "kobe-beef-sake-day",
    destination_slug: "kobe",
    name: "Beef, Sake & Harbor Views",
    description:
      "Tour the Nada sake breweries by morning, savor Kobe beef at lunch, and catch the harbor lights at Meriken Park by night.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "kobe-nada-sake-district",
      "kobe-beef-tasting",
      "kobe-meriken-park",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "kobe-city-stroll-day",
    destination_slug: "kobe",
    name: "Port City Stroll",
    description:
      "Ride the ropeway up to Nunobiki Herb Garden for panoramic views, wander Nankinmachi Chinatown, and browse the waterfront shops.",
    target_interests: ["nature", "food", "culture"],
    activity_ids: [
      "kobe-nunobiki-herb-garden",
      "kobe-nankinmachi",
      "kobe-meriken-park",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // MT. FUJI AREA (mt-fuji)
  // ============================================================
  {
    id: "mt-fuji-lakeside-day",
    destination_slug: "mt-fuji",
    name: "Fuji Five Lakes",
    description:
      "Circle Lake Kawaguchiko by bike, photograph the Chureito Pagoda framing Mt. Fuji, and soak in a lakeside onsen at sunset.",
    target_interests: ["nature", "onsen"],
    activity_ids: [
      "mt-fuji-kawaguchiko",
      "mt-fuji-chureito-pagoda",
      "mt-fuji-onsen",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "mt-fuji-adventure-day",
    destination_slug: "mt-fuji",
    name: "Fuji Summit Challenge",
    description:
      "Begin the overnight ascent of Japan's sacred peak, watch sunrise from the summit, and descend to a well-earned onsen.",
    target_interests: ["adventure", "nature"],
    activity_ids: [
      "mt-fuji-climbing",
      "mt-fuji-sunrise-summit",
      "mt-fuji-onsen",
    ],
    suggested_pace: "packed",
  },
  {
    id: "mt-fuji-village-day",
    destination_slug: "mt-fuji",
    name: "Villages at Fuji's Feet",
    description:
      "Wander the crystal-clear springs of Oshino Hakkai, visit the Itchiku Kubota Art Museum, and take in Fuji views from every angle.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "mt-fuji-oshino-hakkai",
      "mt-fuji-itchiku-kubota-museum",
      "mt-fuji-kawaguchiko",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // BEPPU
  // ============================================================
  {
    id: "beppu-onsen-tour",
    destination_slug: "beppu",
    name: "Hell Tour & Hot Springs",
    description:
      "Tour the surreal Beppu Hells, bury yourself in a volcanic sand bath, and cap the day with an open-air onsen under the stars.",
    target_interests: ["onsen", "nature"],
    activity_ids: [
      "beppu-hells",
      "beppu-sand-bath",
      "beppu-onsen-hopping",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "beppu-food-steam-day",
    destination_slug: "beppu",
    name: "Steam-Cooked & Soaked",
    description:
      "Cook your own meal in natural steam at Jigoku Mushi workshop, wander the steaming Kannawa streets, and soak in a local sento.",
    target_interests: ["food", "onsen", "culture"],
    activity_ids: [
      "beppu-jigoku-mushi",
      "beppu-kannawa-walk",
      "beppu-onsen-hopping",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // NAOSHIMA
  // ============================================================
  {
    id: "naoshima-art-day",
    destination_slug: "naoshima",
    name: "Art Island Immersion",
    description:
      "Descend into Chichu Art Museum's subterranean Monets, hunt outdoor sculptures, and pose with Kusama's iconic yellow pumpkin at sunset.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "naoshima-chichu-art-museum",
      "naoshima-art-house-project",
      "naoshima-yellow-pumpkin",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "naoshima-island-hop-day",
    destination_slug: "naoshima",
    name: "Island Gallery Hop",
    description:
      "Spend the day cycling between Benesse House, the Lee Ufan Museum, and tiny village installations on the Seto Inland Sea.",
    target_interests: ["culture"],
    activity_ids: [
      "naoshima-benesse-house",
      "naoshima-lee-ufan-museum",
      "naoshima-art-house-project",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // YAKUSHIMA
  // ============================================================
  {
    id: "yakushima-jomon-sugi-day",
    destination_slug: "yakushima",
    name: "Ancient Forest Trek",
    description:
      "An epic full-day hike through moss-draped rainforest to the 7,000-year-old Jomon Sugi cedar, Japan's oldest living tree.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "yakushima-jomon-sugi",
      "yakushima-forest-hike",
    ],
    suggested_pace: "packed",
  },
  {
    id: "yakushima-mononoke-day",
    destination_slug: "yakushima",
    name: "Princess Mononoke's Forest",
    description:
      "Wander the ethereal moss-covered Shiratani Unsuikyo ravine that inspired Studio Ghibli, then cool off at Oko Falls.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "yakushima-shiratani-unsuikyo",
      "yakushima-oko-falls",
      "yakushima-yakusugi-land",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // SHIRAKAWA-GO
  // ============================================================
  {
    id: "shirakawa-go-village-day",
    destination_slug: "shirakawa-go",
    name: "Thatched-Roof Village Walk",
    description:
      "Step inside preserved gassho-zukuri farmhouses, climb to Shiroyama Viewpoint for the postcard panorama, and experience rural mountain hospitality.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "shirakawa-go-farmhouses",
      "shirakawa-go-shiroyama-viewpoint",
      "shirakawa-go-wada-house",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "shirakawa-go-winter-day",
    destination_slug: "shirakawa-go",
    name: "Winter Light-Up Magic",
    description:
      "See the village blanketed in snow and illuminated at night during the famous winter light-up, a once-in-a-lifetime scene.",
    target_interests: ["culture", "nature"],
    activity_ids: [
      "shirakawa-go-light-up",
      "shirakawa-go-shiroyama-viewpoint",
      "shirakawa-go-farmhouses",
    ],
    suggested_pace: "relaxed",
  },

  // ============================================================
  // KOYA-SAN (koyasan)
  // ============================================================
  {
    id: "koyasan-spiritual-day",
    destination_slug: "koyasan",
    name: "Mountaintop Monastery",
    description:
      "Walk through the otherworldly Okunoin cemetery, join morning prayers at a temple, and dine on exquisite shojin ryori.",
    target_interests: ["temples", "culture"],
    activity_ids: [
      "koyasan-okunoin-cemetery",
      "koyasan-kongobu-ji",
      "koyasan-shojin-ryori",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "koyasan-temple-circuit-day",
    destination_slug: "koyasan",
    name: "Sacred Circuit",
    description:
      "Explore the vermillion Danjo Garan complex, visit Kongobu-ji's rock garden, and return to Okunoin at dusk when lanterns flicker among the graves.",
    target_interests: ["temples", "culture", "nature"],
    activity_ids: [
      "koyasan-danjo-garan",
      "koyasan-kongobu-ji",
      "koyasan-okunoin-cemetery",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // MATSUMOTO
  // ============================================================
  {
    id: "matsumoto-castle-day",
    destination_slug: "matsumoto",
    name: "Black Castle & Art Streets",
    description:
      "Tour Matsumoto's striking black castle, browse ukiyo-e woodblock prints at the museum, and stroll the frog-themed Nawate-dori shopping street.",
    target_interests: ["culture"],
    activity_ids: [
      "matsumoto-castle",
      "matsumoto-ukiyo-e-museum",
      "matsumoto-nawate-dori",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "matsumoto-alpine-day",
    destination_slug: "matsumoto",
    name: "Kamikochi Alpine Escape",
    description:
      "Bus into the pristine Kamikochi valley for a day of riverside hikes beneath soaring Northern Alps peaks.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "matsumoto-kamikochi",
      "matsumoto-alpine-hike",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // SENDAI
  // ============================================================
  {
    id: "sendai-food-culture-day",
    destination_slug: "sendai",
    name: "Beef Tongue & Boulevard Strolls",
    description:
      "Try Sendai's signature charcoal-grilled gyutan, wander the zelkova-lined Jozenji-dori, and visit the ornate Zuihoden mausoleum.",
    target_interests: ["food", "culture"],
    activity_ids: [
      "sendai-gyutan",
      "sendai-jozenji-dori",
      "sendai-zuihoden",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "sendai-matsushima-day",
    destination_slug: "sendai",
    name: "Matsushima Bay Cruise",
    description:
      "Take a scenic boat ride among the pine-clad islands of Matsushima Bay, one of Japan's three most celebrated views.",
    target_interests: ["nature", "culture"],
    activity_ids: [
      "sendai-matsushima-bay",
      "sendai-matsushima-temples",
      "sendai-gyutan",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // FURANO & BIEI
  // ============================================================
  {
    id: "furano-biei-flower-day",
    destination_slug: "furano-biei",
    name: "Lavender Fields Forever",
    description:
      "Breathe in endless purple at Farm Tomita, drive the Patchwork Road past rolling technicolor hills, and sip Furano wine at sunset.",
    target_interests: ["nature"],
    activity_ids: [
      "furano-biei-farm-tomita",
      "furano-biei-patchwork-road",
      "furano-biei-wine-house",
    ],
    suggested_pace: "relaxed",
  },
  {
    id: "furano-biei-blue-pond-day",
    destination_slug: "furano-biei",
    name: "Blue Pond & Back Roads",
    description:
      "Photograph the surreal Blue Pond, cruise Biei's panoramic back roads, and catch golden hour over the flower fields.",
    target_interests: ["nature", "adventure"],
    activity_ids: [
      "furano-biei-blue-pond",
      "furano-biei-patchwork-road",
      "furano-biei-farm-tomita",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "furano-biei-ski-day",
    destination_slug: "furano-biei",
    name: "Furano Powder Run",
    description:
      "Carve uncrowded groomed runs and fluffy off-piste at Furano Ski Resort, then warm up with a hot cheese fondue in the village.",
    target_interests: ["skiing", "adventure"],
    activity_ids: [
      "furano-biei-ski-resort",
      "furano-biei-onsen",
    ],
    suggested_pace: "packed",
  },

  // ============================================================
  // ONOMICHI
  // ============================================================
  {
    id: "onomichi-cycling-day",
    destination_slug: "onomichi",
    name: "Shimanami Kaido Ride",
    description:
      "Pedal across the Seto Inland Sea on Japan's most spectacular cycling route, hopping between islands connected by soaring bridges.",
    target_interests: ["adventure", "nature"],
    activity_ids: [
      "onomichi-shimanami-kaido",
      "onomichi-island-stop",
    ],
    suggested_pace: "packed",
  },
  {
    id: "onomichi-temple-walk-day",
    destination_slug: "onomichi",
    name: "Hillside Temple Walk",
    description:
      "Climb the winding temple trail past cats dozing on stone walls, ride the Senko-ji ropeway, and slurp Onomichi ramen with a harbor view.",
    target_interests: ["culture", "food", "nature"],
    activity_ids: [
      "onomichi-temple-walk",
      "onomichi-senko-ji-ropeway",
      "onomichi-ramen",
      "onomichi-cat-alley",
    ],
    suggested_pace: "moderate",
  },

  // ============================================================
  // ITO
  // ============================================================
  {
    id: "ito-onsen-nightlife",
    destination_slug: "ito",
    name: "Soak & Night Out in Ito",
    description:
      "Relax in hot springs during the day, feast on fresh kinmedai, then hit the local nightlife scene.",
    target_interests: ["onsen", "nightlife", "food"],
    activity_ids: [
      "ito-onsen",
      "ito-seafood",
      "ito-joynt",
      "ito-craps",
      "ito-akatambo",
    ],
    suggested_pace: "moderate",
  },
  {
    id: "ito-nature-day",
    destination_slug: "ito",
    name: "Coastal Nature Day",
    description:
      "Hike the dramatic Jogasaki volcanic coastline, then unwind with onsen and fresh seafood.",
    target_interests: ["nature", "onsen", "food"],
    activity_ids: [
      "ito-jogasaki-coast",
      "ito-onsen",
      "ito-seafood",
    ],
    suggested_pace: "relaxed",
  },
];

/**
 * Returns all day templates for a given destination slug.
 */
export function getTemplatesForDestination(slug: string): DayTemplate[] {
  return DAY_TEMPLATES.filter((t) => t.destination_slug === slug);
}
