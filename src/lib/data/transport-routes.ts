export interface TransportRoute {
  from_slug: string;
  to_slug: string;
  from_name: string;
  to_name: string;
  primary_method: string;
  duration: string;
  cost_jpy: number;
  cost_display: string;
  jr_pass_covered: boolean;
  tip: string | null;
}

export const TRANSPORT_ROUTES: TransportRoute[] = [
  // Tokyo connections (prices updated 2026)
  { from_slug: "tokyo", to_slug: "kyoto", from_name: "Tokyo", to_name: "Kyoto", primary_method: "Tokaido Shinkansen", duration: "2h 15m", cost_jpy: 14170, cost_display: "~¥14,170", jr_pass_covered: true, tip: "Take Nozomi for fastest (not JR Pass), Hikari for JR Pass holders" },
  { from_slug: "tokyo", to_slug: "osaka", from_name: "Tokyo", to_name: "Osaka", primary_method: "Tokaido Shinkansen", duration: "2h 30m", cost_jpy: 14920, cost_display: "~¥14,920", jr_pass_covered: true, tip: "Shin-Osaka station — transfer to local lines for Namba/Dotonbori" },
  { from_slug: "tokyo", to_slug: "hiroshima", from_name: "Tokyo", to_name: "Hiroshima", primary_method: "Tokaido/Sanyo Shinkansen", duration: "4h", cost_jpy: 19760, cost_display: "~¥19,760", jr_pass_covered: true, tip: "Long ride — reserve a window seat on the right side for Mt. Fuji views" },
  { from_slug: "tokyo", to_slug: "kanazawa", from_name: "Tokyo", to_name: "Kanazawa", primary_method: "Hokuriku Shinkansen", duration: "2h 30m", cost_jpy: 14580, cost_display: "~¥14,580", jr_pass_covered: true, tip: null },
  { from_slug: "tokyo", to_slug: "sendai", from_name: "Tokyo", to_name: "Sendai", primary_method: "Tohoku Shinkansen", duration: "1h 30m", cost_jpy: 11410, cost_display: "~¥11,410", jr_pass_covered: true, tip: null },
  { from_slug: "tokyo", to_slug: "hakone", from_name: "Tokyo", to_name: "Hakone", primary_method: "Romancecar from Shinjuku", duration: "1h 25m", cost_jpy: 2330, cost_display: "~¥2,330", jr_pass_covered: false, tip: "Hakone Free Pass (¥6,100) covers round-trip + all local transport for 3 days" },
  { from_slug: "tokyo", to_slug: "nagoya", from_name: "Tokyo", to_name: "Nagoya", primary_method: "Tokaido Shinkansen", duration: "1h 40m", cost_jpy: 11300, cost_display: "~¥11,300", jr_pass_covered: true, tip: null },
  { from_slug: "tokyo", to_slug: "kamakura", from_name: "Tokyo", to_name: "Kamakura", primary_method: "JR Yokosuka Line", duration: "55m", cost_jpy: 940, cost_display: "~¥940", jr_pass_covered: true, tip: "Direct from Tokyo Station, no transfer needed" },
  { from_slug: "tokyo", to_slug: "nikko", from_name: "Tokyo", to_name: "Nikko", primary_method: "Tobu Railway or JR + Shinkansen", duration: "2h", cost_jpy: 2800, cost_display: "~¥2,800", jr_pass_covered: false, tip: "JR Pass holders: Shinkansen to Utsunomiya + JR Nikko Line" },
  { from_slug: "tokyo", to_slug: "mt-fuji-area", from_name: "Tokyo", to_name: "Mt. Fuji Area", primary_method: "JR Chuo Line + Fuji Excursion", duration: "2h", cost_jpy: 4130, cost_display: "~¥4,130", jr_pass_covered: false, tip: "Highway bus from Shinjuku is cheaper (~¥2,000) but slower" },
  { from_slug: "tokyo", to_slug: "takayama", from_name: "Tokyo", to_name: "Takayama", primary_method: "Shinkansen + JR Hida", duration: "4h", cost_jpy: 12130, cost_display: "~¥12,130", jr_pass_covered: true, tip: null },
  { from_slug: "tokyo", to_slug: "sapporo", from_name: "Tokyo", to_name: "Sapporo", primary_method: "Flight", duration: "1h 45m", cost_jpy: 15000, cost_display: "~¥15,000", jr_pass_covered: false, tip: "Fly direct — the Shinkansen only goes to Shin-Hakodate and takes 8+ hours total to Sapporo. Peach/Jetstar have cheap fares." },
  { from_slug: "tokyo", to_slug: "fukuoka", from_name: "Tokyo", to_name: "Fukuoka", primary_method: "Tokaido/Sanyo Shinkansen", duration: "5h", cost_jpy: 23810, cost_display: "~¥23,810", jr_pass_covered: true, tip: "Consider flying (~2h, often cheaper). JR Pass makes Shinkansen worthwhile" },

  // Kansai connections
  { from_slug: "kyoto", to_slug: "osaka", from_name: "Kyoto", to_name: "Osaka", primary_method: "JR Special Rapid", duration: "30m", cost_jpy: 580, cost_display: "~¥580", jr_pass_covered: true, tip: "Runs every 15 minutes, no reservation needed" },
  { from_slug: "kyoto", to_slug: "nara", from_name: "Kyoto", to_name: "Nara", primary_method: "JR Nara Line", duration: "45m", cost_jpy: 720, cost_display: "~¥720", jr_pass_covered: true, tip: "Kintetsu Railway is slightly faster but not JR Pass covered" },
  { from_slug: "kyoto", to_slug: "hiroshima", from_name: "Kyoto", to_name: "Hiroshima", primary_method: "Sanyo Shinkansen", duration: "1h 40m", cost_jpy: 11420, cost_display: "~¥11,420", jr_pass_covered: true, tip: null },
  { from_slug: "kyoto", to_slug: "kanazawa", from_name: "Kyoto", to_name: "Kanazawa", primary_method: "Thunderbird Limited Express", duration: "2h 15m", cost_jpy: 6490, cost_display: "~¥6,490", jr_pass_covered: true, tip: null },
  { from_slug: "kyoto", to_slug: "kobe", from_name: "Kyoto", to_name: "Kobe", primary_method: "JR Special Rapid", duration: "50m", cost_jpy: 1110, cost_display: "~¥1,110", jr_pass_covered: true, tip: null },
  { from_slug: "kyoto", to_slug: "koya-san", from_name: "Kyoto", to_name: "Koya-san", primary_method: "JR + Nankai Railway", duration: "3h", cost_jpy: 3500, cost_display: "~¥3,500", jr_pass_covered: false, tip: "Book temple lodging (shukubo) in advance" },
  { from_slug: "osaka", to_slug: "hiroshima", from_name: "Osaka", to_name: "Hiroshima", primary_method: "Sanyo Shinkansen", duration: "1h 30m", cost_jpy: 10870, cost_display: "~¥10,870", jr_pass_covered: true, tip: null },
  { from_slug: "osaka", to_slug: "kobe", from_name: "Osaka", to_name: "Kobe", primary_method: "JR Special Rapid", duration: "20m", cost_jpy: 410, cost_display: "~¥410", jr_pass_covered: true, tip: null },
  { from_slug: "osaka", to_slug: "nara", from_name: "Osaka", to_name: "Nara", primary_method: "JR Yamatoji Rapid", duration: "50m", cost_jpy: 820, cost_display: "~¥820", jr_pass_covered: true, tip: null },
  { from_slug: "osaka", to_slug: "kanazawa", from_name: "Osaka", to_name: "Kanazawa", primary_method: "Thunderbird Limited Express", duration: "2h 30m", cost_jpy: 7260, cost_display: "~¥7,260", jr_pass_covered: true, tip: null },
  { from_slug: "osaka", to_slug: "fukuoka", from_name: "Osaka", to_name: "Fukuoka", primary_method: "Sanyo Shinkansen", duration: "2h 30m", cost_jpy: 16060, cost_display: "~¥16,060", jr_pass_covered: true, tip: null },

  // Chubu connections
  { from_slug: "kanazawa", to_slug: "takayama", from_name: "Kanazawa", to_name: "Takayama", primary_method: "Nohi Bus", duration: "2h 15m", cost_jpy: 3600, cost_display: "~¥3,600", jr_pass_covered: false, tip: "Reserve seats in advance — popular route with limited capacity" },
  { from_slug: "takayama", to_slug: "shirakawa-go", from_name: "Takayama", to_name: "Shirakawa-go", primary_method: "Nohi Bus", duration: "50m", cost_jpy: 2600, cost_display: "~¥2,600", jr_pass_covered: false, tip: "Winter light-up events require advance lottery registration" },
  { from_slug: "kanazawa", to_slug: "shirakawa-go", from_name: "Kanazawa", to_name: "Shirakawa-go", primary_method: "Nohi Bus", duration: "1h 15m", cost_jpy: 2000, cost_display: "~¥2,000", jr_pass_covered: false, tip: null },
  { from_slug: "matsumoto", to_slug: "takayama", from_name: "Matsumoto", to_name: "Takayama", primary_method: "JR Hida Wide View", duration: "2h 15m", cost_jpy: 3300, cost_display: "~¥3,300", jr_pass_covered: true, tip: "Scenic alpine route through the mountains" },
  { from_slug: "nagoya", to_slug: "takayama", from_name: "Nagoya", to_name: "Takayama", primary_method: "JR Hida Limited Express", duration: "2h 20m", cost_jpy: 5610, cost_display: "~¥5,610", jr_pass_covered: true, tip: null },

  // Hiroshima / Chugoku
  { from_slug: "hiroshima", to_slug: "fukuoka", from_name: "Hiroshima", to_name: "Fukuoka", primary_method: "Sanyo Shinkansen", duration: "1h", cost_jpy: 9170, cost_display: "~¥9,170", jr_pass_covered: true, tip: null },
  { from_slug: "hiroshima", to_slug: "onomichi", from_name: "Hiroshima", to_name: "Onomichi", primary_method: "Sanyo Shinkansen + Local", duration: "1h", cost_jpy: 4000, cost_display: "~¥4,000", jr_pass_covered: true, tip: "Start of the Shimanami Kaido cycling route" },

  // Hokkaido
  { from_slug: "sapporo", to_slug: "niseko", from_name: "Sapporo", to_name: "Niseko", primary_method: "JR + Bus", duration: "2h 30m", cost_jpy: 2500, cost_display: "~¥2,500", jr_pass_covered: false, tip: "Ski season shuttle buses are more convenient" },
  { from_slug: "sapporo", to_slug: "furano-biei", from_name: "Sapporo", to_name: "Furano & Biei", primary_method: "JR Lavender Express", duration: "2h", cost_jpy: 4500, cost_display: "~¥4,500", jr_pass_covered: true, tip: "Seasonal direct trains in summer only; otherwise transfer at Asahikawa" },

  // Kyushu
  { from_slug: "fukuoka", to_slug: "beppu", from_name: "Fukuoka", to_name: "Beppu", primary_method: "JR Sonic Limited Express", duration: "2h", cost_jpy: 5570, cost_display: "~¥5,570", jr_pass_covered: true, tip: null },
  { from_slug: "fukuoka", to_slug: "yakushima", from_name: "Fukuoka", to_name: "Yakushima", primary_method: "Shinkansen + Jetfoil", duration: "4h 30m", cost_jpy: 15000, cost_display: "~¥15,000", jr_pass_covered: false, tip: "Fly from Kagoshima or Fukuoka for faster access" },

  // Shikoku
  { from_slug: "osaka", to_slug: "naoshima", from_name: "Osaka", to_name: "Naoshima", primary_method: "Shinkansen + Ferry", duration: "2h 30m", cost_jpy: 5500, cost_display: "~¥5,500", jr_pass_covered: false, tip: "Take Shinkansen to Okayama, then Uno Line to Uno Port, then ferry" },

  // Izu Peninsula
  { from_slug: "tokyo", to_slug: "ito", from_name: "Tokyo", to_name: "Ito", primary_method: "JR Odoriko Limited Express", duration: "1h 45m", cost_jpy: 3490, cost_display: "~¥3,490", jr_pass_covered: true, tip: "Direct from Tokyo Station. Saphir Odoriko is a premium option with ocean views." },
  { from_slug: "hakone", to_slug: "ito", from_name: "Hakone", to_name: "Ito", primary_method: "Bus + JR", duration: "1h 30m", cost_jpy: 2000, cost_display: "~¥2,000", jr_pass_covered: false, tip: "Bus to Atami then JR to Ito. Easy day trip or combo." },

  // Okinawa
  { from_slug: "tokyo", to_slug: "okinawa", from_name: "Tokyo", to_name: "Okinawa", primary_method: "Flight", duration: "2h 45m", cost_jpy: 15000, cost_display: "~¥15,000", jr_pass_covered: false, tip: "No rail connection — flights from Tokyo, Osaka, or Fukuoka" },
  { from_slug: "osaka", to_slug: "okinawa", from_name: "Osaka", to_name: "Okinawa", primary_method: "Flight", duration: "2h", cost_jpy: 12000, cost_display: "~¥12,000", jr_pass_covered: false, tip: "Peach Aviation often has good deals from Kansai Airport" },
];

export function findRoute(
  fromSlug: string,
  toSlug: string
): TransportRoute | null {
  return (
    TRANSPORT_ROUTES.find(
      (r) =>
        (r.from_slug === fromSlug && r.to_slug === toSlug) ||
        (r.from_slug === toSlug && r.to_slug === fromSlug)
    ) ?? null
  );
}

// JR Pass prices (reusable across calculator and builder)
export const JR_PASS_PRICES = {
  "7-day": { ordinary: 50000, green: 70000 },
  "14-day": { ordinary: 80000, green: 110000 },
  "21-day": { ordinary: 100000, green: 140000 },
};
