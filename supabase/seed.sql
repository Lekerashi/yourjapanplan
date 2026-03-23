-- ============================================================
-- Seed Data: Japan Destinations & Activities
-- ============================================================

-- ============================================================
-- DESTINATIONS
-- ============================================================

insert into destinations (slug, name, region, description, highlights, best_seasons, crowd_level_by_month, tags, lat, lng, jr_accessible, reservation_tips, accommodation_zones) values

-- KANTO
('tokyo', 'Tokyo', 'kanto',
 'Japan''s massive capital blends ultramodern and traditional, from neon-lit skyscrapers and anime shops to historic temples and serene gardens.',
 array['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Outer Market', 'Akihabara', 'Meiji Shrine', 'TeamLab Borderless'],
 array['spring', 'autumn'],
 '{"1":3,"2":3,"3":4,"4":5,"5":4,"6":3,"7":4,"8":4,"9":3,"10":4,"11":4,"12":4}',
 array['shopping', 'food', 'nightlife', 'culture', 'temples'],
 35.6762, 139.6503, true,
 'Book TeamLab tickets 2-3 weeks ahead. Popular restaurants in Ginza/Shibuya need reservations. Sumo tournament tickets sell out months in advance (Jan, May, Sep).',
 '[{"name":"Shinjuku","description":"Central hub with great train access, nightlife, and hotels at every price point","best_for":["nightlife","first-timers","transit"]},{"name":"Shibuya","description":"Trendy area with shopping, dining, and iconic crossing","best_for":["shopping","young travelers","couples"]},{"name":"Asakusa","description":"Traditional neighborhood near Senso-ji, budget-friendly","best_for":["culture","budget","temples"]},{"name":"Ginza","description":"Upscale district with luxury shopping and fine dining","best_for":["luxury","shopping","couples"]}]'),

('kamakura', 'Kamakura', 'kanto',
 'Coastal town south of Tokyo known for its Great Buddha, historic temples, and beach vibes. A perfect day trip or overnight from the capital.',
 array['Great Buddha (Kotoku-in)', 'Tsurugaoka Hachimangu', 'Hase-dera Temple', 'Enoshima Island', 'Komachi-dori Street'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":3,"4":4,"5":3,"6":3,"7":4,"8":4,"9":3,"10":3,"11":3,"12":2}',
 array['temples', 'culture', 'beach', 'nature'],
 35.3192, 139.5467, true,
 'No major reservations needed. Go early on weekends to avoid crowds at the Great Buddha.',
 '[{"name":"Kamakura Station area","description":"Walking distance to temples and Komachi-dori shopping street","best_for":["convenience","culture"]}]'),

('nikko', 'Nikko', 'kanto',
 'Mountain town famous for the ornate Toshogu Shrine (a UNESCO site), stunning autumn foliage, and natural hot springs.',
 array['Toshogu Shrine', 'Kegon Falls', 'Lake Chuzenji', 'Shinkyo Bridge', 'Kanmangafuchi Abyss'],
 array['autumn', 'spring'],
 '{"1":1,"2":1,"3":2,"4":3,"5":3,"6":2,"7":3,"8":3,"9":2,"10":5,"11":4,"12":1}',
 array['temples', 'nature', 'onsen', 'culture'],
 36.7500, 139.5983, true,
 'Buy the Nikko All-Area Pass for bus and train discounts. Toshogu gets crowded mid-day — go early.',
 '[{"name":"Nikko town center","description":"Near the shrines and main attractions","best_for":["convenience","culture"]}]'),

-- KANSAI
('kyoto', 'Kyoto', 'kansai',
 'The cultural heart of Japan with over 2,000 temples and shrines, traditional geisha districts, and exquisite kaiseki cuisine.',
 array['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo Grove', 'Gion District', 'Nishiki Market', 'Kiyomizu-dera'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":4,"4":5,"5":4,"6":3,"7":3,"8":3,"9":3,"10":4,"11":5,"12":3}',
 array['temples', 'culture', 'food', 'nature', 'shopping'],
 35.0116, 135.7681, true,
 'Book ryokans 2-3 months ahead during cherry blossom (late Mar-Apr) and autumn foliage (Nov). Some temples require advance booking.',
 '[{"name":"Downtown (Kawaramachi/Gion)","description":"Central location near shopping, restaurants, and Gion geisha district","best_for":["nightlife","food","culture","first-timers"]},{"name":"Higashiyama","description":"Eastern hills area surrounded by temples","best_for":["temples","culture","walking"]},{"name":"Arashiyama","description":"Western district with bamboo grove and monkey park","best_for":["nature","couples"]},{"name":"Kyoto Station area","description":"Transit hub, convenient for day trips","best_for":["transit","budget"]}]'),

('osaka', 'Osaka', 'kansai',
 'Japan''s kitchen and comedy capital. Known for incredible street food, vibrant nightlife, and a laid-back, friendly atmosphere.',
 array['Dotonbori', 'Osaka Castle', 'Shinsekai', 'Kuromon Market', 'Universal Studios Japan', 'Namba'],
 array['spring', 'autumn'],
 '{"1":3,"2":3,"3":4,"4":4,"5":4,"6":3,"7":4,"8":4,"9":3,"10":4,"11":4,"12":3}',
 array['food', 'nightlife', 'shopping', 'culture'],
 34.6937, 135.5023, true,
 'Book Universal Studios tickets online in advance. Most street food spots are walk-in. Reserve high-end sushi/kappo restaurants ahead.',
 '[{"name":"Namba/Dotonbori","description":"Heart of Osaka nightlife and street food, always buzzing","best_for":["nightlife","food","first-timers"]},{"name":"Umeda/Kita","description":"Business district with upscale dining and shopping","best_for":["luxury","shopping"]},{"name":"Shinsekai","description":"Retro neighborhood famous for kushikatsu and local vibes","best_for":["food","budget","culture"]}]'),

('nara', 'Nara', 'kansai',
 'Ancient capital home to friendly free-roaming deer, massive bronze Buddha, and some of Japan''s oldest wooden buildings.',
 array['Todai-ji Temple', 'Nara Deer Park', 'Kasuga Grand Shrine', 'Isuien Garden', 'Naramachi'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":3,"4":4,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":2}',
 array['temples', 'culture', 'nature'],
 34.6851, 135.8048, true,
 'No reservations needed for main sights. Easy day trip from Kyoto or Osaka (30-45 min by train).',
 '[{"name":"Near Nara Park","description":"Walking distance to deer park and temples","best_for":["convenience","culture"]}]'),

('kobe', 'Kobe', 'kansai',
 'Port city famous for Kobe beef, sake breweries in Nada, vibrant Chinatown, and mountain-harbor scenery.',
 array['Kobe Beef tasting', 'Nada sake district', 'Nankinmachi Chinatown', 'Nunobiki Herb Garden', 'Meriken Park'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":3,"4":3,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":2}',
 array['food', 'culture', 'nature'],
 34.6901, 135.1956, true,
 'Reserve Kobe beef restaurants at least a week ahead, especially on weekends.',
 '[{"name":"Sannomiya/Motomachi","description":"Central district with shopping, Chinatown, and restaurants","best_for":["food","shopping","convenience"]}]'),

-- CHUBU
('hakone', 'Hakone', 'chubu',
 'Hot spring resort town in the mountains near Mt. Fuji, with open-air museums, lake cruises, and traditional ryokans.',
 array['Hakone Open-Air Museum', 'Lake Ashi cruise', 'Owakudani volcanic valley', 'Mt. Fuji views', 'Onsen ryokans'],
 array['autumn', 'spring', 'winter'],
 '{"1":2,"2":2,"3":3,"4":4,"5":3,"6":2,"7":3,"8":4,"9":2,"10":4,"11":4,"12":2}',
 array['onsen', 'nature', 'culture'],
 35.2326, 139.1070, true,
 'Book ryokans with private onsen well in advance, especially weekends. Get the Hakone Free Pass for transport savings.',
 '[{"name":"Hakone-Yumoto","description":"Main gateway town with many ryokans and easy access","best_for":["onsen","convenience"]},{"name":"Gora/Sounzan area","description":"Higher elevation with mountain views and quieter atmosphere","best_for":["nature","luxury","couples"]}]'),

('takayama', 'Takayama', 'chubu',
 'Beautifully preserved Edo-era merchant town in the Japanese Alps, known for morning markets, sake, and Hida beef.',
 array['Old Town (Sanmachi Suji)', 'Morning Markets', 'Hida Folk Village', 'Hida Beef', 'Sake Breweries'],
 array['spring', 'autumn', 'winter'],
 '{"1":2,"2":2,"3":3,"4":4,"5":3,"6":2,"7":3,"8":3,"9":2,"10":4,"11":3,"12":2}',
 array['culture', 'food', 'nature', 'onsen'],
 36.1461, 137.2517, true,
 'During Takayama Festival (Apr & Oct), book accommodation months ahead. Morning markets run daily.',
 '[{"name":"Old Town area","description":"Walking distance to Sanmachi Suji, markets, and breweries","best_for":["culture","food","walking"]}]'),

('kanazawa', 'Kanazawa', 'chubu',
 'The "Little Kyoto" on the Sea of Japan coast, with one of Japan''s top three gardens, samurai districts, and fresh seafood.',
 array['Kenroku-en Garden', 'Higashi Chaya District', 'Omicho Market', '21st Century Museum', 'Nagamachi Samurai District'],
 array['spring', 'autumn', 'winter'],
 '{"1":2,"2":2,"3":3,"4":3,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":2}',
 array['culture', 'food', 'nature', 'shopping'],
 36.5613, 136.6562, true,
 'Most attractions are walk-in. Try to visit Omicho Market on weekdays for a calmer experience.',
 '[{"name":"Central Kanazawa","description":"Near Kenroku-en and the main attractions, walkable","best_for":["convenience","culture"]}]'),

('matsumoto', 'Matsumoto', 'chubu',
 'Gateway to the Japanese Alps with one of Japan''s most beautiful original castles and a charming art-focused downtown.',
 array['Matsumoto Castle', 'Kamikochi Alpine Valley', 'Nawate-dori Street', 'Japan Ukiyo-e Museum'],
 array['summer', 'autumn', 'spring'],
 '{"1":1,"2":1,"3":2,"4":3,"5":3,"6":2,"7":4,"8":4,"9":3,"10":4,"11":3,"12":1}',
 array['culture', 'nature', 'adventure'],
 36.2381, 137.9720, true,
 'Kamikochi is open mid-April to mid-November only. No cars allowed — take the bus from Matsumoto.',
 '[{"name":"Near Matsumoto Castle","description":"Central, walking distance to castle and shopping streets","best_for":["convenience","culture"]}]'),

-- HOKKAIDO
('sapporo', 'Sapporo', 'hokkaido',
 'Hokkaido''s capital, famous for its snow festival, miso ramen, fresh seafood, beer, and nearby ski resorts.',
 array['Sapporo Snow Festival', 'Nijo Market', 'Odori Park', 'Sapporo Beer Museum', 'Susukino nightlife', 'Ramen Alley'],
 array['winter', 'summer'],
 '{"1":4,"2":5,"3":3,"4":2,"5":2,"6":2,"7":4,"8":4,"9":2,"10":2,"11":2,"12":3}',
 array['food', 'nightlife', 'skiing', 'culture', 'nature'],
 43.0621, 141.3544, true,
 'Snow Festival (early Feb) requires booking hotels 3+ months ahead. Ramen Alley is walk-in. Book ski day trips in advance during peak season.',
 '[{"name":"Odori/Tanukikoji","description":"Central area near parks, shopping, and attractions","best_for":["convenience","shopping","first-timers"]},{"name":"Susukino","description":"Nightlife and entertainment district","best_for":["nightlife","food"]}]'),

('niseko', 'Niseko', 'hokkaido',
 'World-class powder snow destination and growing summer adventure hub with rafting, hiking, and golf.',
 array['Powder skiing', 'Mt. Yotei views', 'Onsen after skiing', 'Summer rafting', 'Local craft beer'],
 array['winter'],
 '{"1":5,"2":4,"3":3,"4":1,"5":1,"6":1,"7":2,"8":2,"9":1,"10":1,"11":1,"12":4}',
 array['skiing', 'adventure', 'onsen', 'nature'],
 42.8604, 140.6874, false,
 'Book ski accommodation and lift passes well in advance for Dec-Feb. Many places require minimum night stays during peak.',
 '[{"name":"Hirafu Village","description":"Main village with most restaurants, bars, and ski access","best_for":["skiing","nightlife","convenience"]},{"name":"Annupuri area","description":"Quieter side with family-friendly slopes","best_for":["family","budget"]}]'),

('furano-biei', 'Furano & Biei', 'hokkaido',
 'Rolling hills of lavender fields and patchwork farmland. Stunning in summer, great skiing in winter.',
 array['Farm Tomita lavender fields', 'Blue Pond', 'Patchwork Road', 'Furano Ski Resort', 'Furano Wine House'],
 array['summer', 'winter'],
 '{"1":2,"2":2,"3":1,"4":1,"5":2,"6":3,"7":5,"8":4,"9":2,"10":2,"11":1,"12":2}',
 array['nature', 'adventure', 'skiing'],
 43.3420, 142.3832, true,
 'Lavender peaks mid-July. Rent a car for Biei — public transport is limited between scenic spots.',
 '[{"name":"Furano town","description":"Central base for both summer flower fields and winter ski","best_for":["convenience"]}]'),

-- TOHOKU
('sendai', 'Sendai', 'tohoku',
 'The largest city in the Tohoku region, known for gyutan (beef tongue), Tanabata festival, and gateway to Matsushima Bay.',
 array['Matsushima Bay', 'Gyutan (beef tongue)', 'Zuihoden Mausoleum', 'Jozenji-dori Avenue', 'Tanabata Festival (Aug)'],
 array['summer', 'autumn'],
 '{"1":1,"2":1,"3":2,"4":3,"5":3,"6":2,"7":3,"8":5,"9":2,"10":3,"11":2,"12":2}',
 array['food', 'culture', 'nature'],
 38.2682, 140.8694, true,
 'Tanabata Festival (Aug 6-8) requires very early hotel bookings. Matsushima Bay is a 30-min train ride.',
 '[{"name":"Sendai Station area","description":"Central hub with great restaurant selection and transit access","best_for":["convenience","food","transit"]}]'),

-- KYUSHU
('fukuoka', 'Fukuoka', 'kyushu',
 'Kyushu''s largest city, famous for its yatai (street food stalls), tonkotsu ramen, beaches, and relaxed atmosphere.',
 array['Yatai street food stalls', 'Canal City', 'Ohori Park', 'Dazaifu Tenmangu', 'Hakata Ramen'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":3,"4":3,"5":3,"6":3,"7":3,"8":3,"9":2,"10":3,"11":3,"12":2}',
 array['food', 'nightlife', 'culture', 'beach'],
 33.5904, 130.4017, true,
 'Yatai stalls are first-come, first-served — go around 7-8pm for best selection. Dazaifu is an easy day trip.',
 '[{"name":"Tenjin/Nakasu","description":"Central entertainment district with yatai stalls along the river","best_for":["nightlife","food","first-timers"]},{"name":"Hakata Station area","description":"Transit hub, convenient for bullet train travel","best_for":["transit","convenience"]}]'),

('beppu', 'Beppu', 'kyushu',
 'One of Japan''s top onsen towns with more hot spring sources than anywhere else in the country. Famous for its "hells" (jigoku).',
 array['Beppu Hells', 'Sand baths', 'Onsen hopping', 'Jigoku Mushi (hell-steamed cooking)', 'Kannawa area'],
 array['autumn', 'winter', 'spring'],
 '{"1":2,"2":2,"3":3,"4":3,"5":2,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":2}',
 array['onsen', 'nature', 'food'],
 33.2846, 131.4914, true,
 'Most onsen are walk-in. Beppu Hells combo ticket available on-site. Try the sand bath at Beppu Beach — no reservation needed but expect a short wait.',
 '[{"name":"Kannawa area","description":"Traditional onsen town with steam vents and ryokans","best_for":["onsen","culture"]},{"name":"Beppu Station area","description":"Convenient, near the beach sand baths","best_for":["convenience","budget"]}]'),

('yakushima', 'Yakushima', 'kyushu',
 'UNESCO World Heritage island with ancient cedar forests that inspired Princess Mononoke. A paradise for hikers and nature lovers.',
 array['Jomon Sugi (ancient cedar)', 'Shiratani Unsuikyo Ravine', 'Yakusugi Land', 'Sea turtle nesting', 'Oko Falls'],
 array['spring', 'autumn'],
 '{"1":1,"2":1,"3":2,"4":2,"5":3,"6":3,"7":3,"8":3,"9":2,"10":2,"11":2,"12":1}',
 array['nature', 'adventure'],
 30.3564, 130.5072, false,
 'Book ferry or flights to Yakushima early. Hire a guide for the Jomon Sugi hike (10+ hours). Mountain hut reservations needed for overnight treks.',
 '[{"name":"Miyanoura/Anbou","description":"Port towns with most accommodation and restaurants","best_for":["convenience"]}]'),

-- CHUGOKU
('hiroshima', 'Hiroshima', 'chugoku',
 'A city of resilience and peace, home to the atomic bomb memorial, incredible okonomiyaki, and gateway to Miyajima Island.',
 array['Peace Memorial Park', 'Atomic Bomb Dome', 'Miyajima Island', 'Itsukushima Shrine', 'Hiroshima-style okonomiyaki'],
 array['spring', 'autumn'],
 '{"1":2,"2":2,"3":3,"4":4,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":4,"12":2}',
 array['culture', 'food', 'temples', 'nature'],
 34.3853, 132.4553, true,
 'Miyajima has limited accommodation — book ryokans well ahead if staying overnight. The floating torii gate is best at high tide.',
 '[{"name":"Peace Park area","description":"Central, walkable to main sights and okonomiyaki street","best_for":["culture","convenience","first-timers"]},{"name":"Miyajima Island","description":"Stay overnight to see the shrine without day-trip crowds","best_for":["temples","couples","nature"]}]'),

-- SHIKOKU
('naoshima', 'Naoshima', 'shikoku',
 'Art island in the Seto Inland Sea featuring world-class museums, outdoor installations, and the iconic yellow pumpkin.',
 array['Chichu Art Museum', 'Benesse House', 'Yayoi Kusama Pumpkin', 'Art House Project', 'Lee Ufan Museum'],
 array['spring', 'autumn', 'summer'],
 '{"1":1,"2":1,"3":3,"4":3,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":1}',
 array['culture', 'nature'],
 34.4614, 133.9956, false,
 'Chichu Art Museum requires timed-entry tickets — book online in advance. Benesse House hotel books out months ahead. Some art houses are closed Mondays.',
 '[{"name":"Honmura area","description":"Village with Art House Project installations","best_for":["culture","budget"]},{"name":"Benesse House","description":"Stay in the museum-hotel for the ultimate art island experience","best_for":["luxury","culture"]}]'),

-- OKINAWA
('okinawa-main', 'Okinawa (Main Island)', 'okinawa',
 'Subtropical paradise with turquoise beaches, unique Ryukyu culture, American influence, and some of Japan''s best diving.',
 array['Shuri Castle', 'Churaumi Aquarium', 'Kokusai Street', 'American Village', 'Blue cave snorkeling', 'Okinawan cuisine'],
 array['spring', 'summer'],
 '{"1":2,"2":2,"3":3,"4":3,"5":3,"6":3,"7":5,"8":5,"9":3,"10":3,"11":2,"12":2}',
 array['beach', 'food', 'culture', 'nature', 'adventure'],
 26.3344, 127.8056, false,
 'Rent a car — public transport is limited outside Naha. Book diving/snorkeling tours ahead in summer. Churaumi Aquarium gets packed in peak season.',
 '[{"name":"Naha","description":"Capital city with Kokusai Street, nightlife, and Shuri Castle","best_for":["nightlife","food","culture","budget"]},{"name":"Chatan/American Village","description":"Mid-island area with beaches, shopping, and resort hotels","best_for":["beach","family","shopping"]},{"name":"Northern Okinawa","description":"Near Churaumi Aquarium, quieter beaches, jungle","best_for":["nature","adventure","couples"]}]'),

-- MORE DESTINATIONS
('mt-fuji', 'Mt. Fuji Area', 'chubu',
 'Japan''s iconic volcanic peak and surrounding Five Lakes region. Climbing season is short but the views are year-round.',
 array['Fuji Five Lakes', 'Chureito Pagoda', 'Kawaguchiko', 'Fuji climbing (Jul-Sep)', 'Oshino Hakkai'],
 array['summer', 'autumn'],
 '{"1":2,"2":2,"3":2,"4":3,"5":3,"6":3,"7":5,"8":5,"9":3,"10":4,"11":3,"12":2}',
 array['nature', 'adventure', 'onsen'],
 35.3606, 138.7274, true,
 'Climbing season is July-September only. Mountain hut reservations required. Kawaguchiko area is accessible year-round.',
 '[{"name":"Kawaguchiko","description":"Lake town with Fuji views, onsen, and museums","best_for":["nature","onsen","couples"]}]'),

('shirakawa-go', 'Shirakawa-go', 'chubu',
 'UNESCO World Heritage village of traditional thatched-roof farmhouses (gassho-zukuri) in a mountain valley. Magical in winter snow.',
 array['Gassho-zukuri farmhouses', 'Shiroyama Viewpoint', 'Wada House', 'Winter light-up event', 'Doburoku Festival (Oct)'],
 array['winter', 'autumn', 'spring'],
 '{"1":4,"2":4,"3":2,"4":2,"5":2,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":3}',
 array['culture', 'nature'],
 36.2611, 136.9064, false,
 'Winter light-up events require a lottery reservation months in advance. Staying overnight in a gassho-zukuri house is possible but books up fast.',
 '[{"name":"In the village","description":"Stay in a traditional farmhouse for the full experience","best_for":["culture","couples"]}]'),

('koyasan', 'Koya-san', 'kansai',
 'Sacred mountaintop monastery town and center of Shingon Buddhism. Stay in a temple, eat shojin ryori (Buddhist vegetarian cuisine), and walk the ancient cemetery at night.',
 array['Okunoin Cemetery', 'Kongobu-ji Temple', 'Temple lodging (shukubo)', 'Shojin ryori', 'Danjo Garan'],
 array['autumn', 'spring'],
 '{"1":1,"2":1,"3":2,"4":3,"5":3,"6":2,"7":2,"8":2,"9":2,"10":4,"11":4,"12":1}',
 array['temples', 'culture', 'nature'],
 34.2130, 135.5802, true,
 'Book temple lodging (shukubo) well in advance — there are no regular hotels. Accessible from Osaka via Nankai Railway (~90 min).',
 '[{"name":"Central Koya-san","description":"Near Okunoin and main temples, all accommodation is temple lodging","best_for":["culture","temples"]}]'),

('onomichi', 'Onomichi', 'chugoku',
 'Charming hillside port town and starting point of the Shimanami Kaido cycling route across islands to Shikoku.',
 array['Shimanami Kaido cycling', 'Temple Walk', 'Onomichi Ramen', 'Senko-ji Temple & Ropeway', 'Cat Alley'],
 array['spring', 'autumn'],
 '{"1":1,"2":1,"3":2,"4":3,"5":3,"6":2,"7":3,"8":3,"9":2,"10":3,"11":3,"12":1}',
 array['adventure', 'culture', 'food', 'nature'],
 34.4088, 133.2051, true,
 'Rent bikes for Shimanami Kaido at the terminal — reserve online in peak season. The full route is ~70km to Imabari.',
 '[{"name":"Onomichi hillside","description":"Atmospheric old town with temple walks and sea views","best_for":["culture","budget"]}]');

-- ============================================================
-- SAMPLE ACTIVITIES (for Tokyo and Kyoto to start)
-- ============================================================

-- Tokyo activities
insert into activities (destination_id, name, description, type, duration_minutes, cost_estimate, reservation_required, best_time_of_day, seasonal_availability, tags, address, lat, lng) values

((select id from destinations where slug = 'tokyo'),
 'Senso-ji Temple & Nakamise Street', 'Tokyo''s oldest and most famous temple. Walk through the Kaminarimon gate and browse traditional snack and souvenir shops along Nakamise-dori.', 'sight', 60, 'Free', false, 'Early morning', array['spring','summer','autumn','winter'], array['temples','culture','shopping'], 'Asakusa, Taito City', 35.7148, 139.7967),

((select id from destinations where slug = 'tokyo'),
 'Shibuya Crossing & Shibuya Sky', 'Experience the world''s busiest pedestrian crossing, then head up Shibuya Sky for a 360° rooftop view of the city.', 'sight', 90, '2,000 yen', true, 'Evening', array['spring','summer','autumn','winter'], array['culture','shopping'], 'Shibuya, Shibuya City', 35.6595, 139.7004),

((select id from destinations where slug = 'tokyo'),
 'Tsukiji Outer Market food tour', 'Wander the narrow alleys of the outer market sampling fresh sushi, tamagoyaki, grilled seafood, and matcha sweets.', 'food', 120, '3,000-5,000 yen', false, 'Morning', array['spring','summer','autumn','winter'], array['food'], 'Tsukiji, Chuo City', 35.6654, 139.7707),

((select id from destinations where slug = 'tokyo'),
 'TeamLab Borderless', 'Immersive digital art museum where artworks flow across rooms. A must-see experience.', 'experience', 120, '3,800 yen', true, 'Afternoon', array['spring','summer','autumn','winter'], array['culture'], 'Azabudai Hills, Minato City', 35.6604, 139.7312),

((select id from destinations where slug = 'tokyo'),
 'Meiji Shrine & Harajuku', 'Visit the serene Shinto shrine in a forest, then explore Harajuku''s Takeshita Street for fashion and crepes.', 'sight', 120, 'Free (shrine)', false, 'Morning', array['spring','summer','autumn','winter'], array['temples','culture','shopping'], 'Harajuku, Shibuya City', 35.6764, 139.6993),

((select id from destinations where slug = 'tokyo'),
 'Akihabara Electric Town', 'Anime, manga, electronics, and gaming paradise. Visit maid cafes, retro game shops, and multi-story arcades.', 'shopping', 180, 'Varies', false, 'Afternoon', array['spring','summer','autumn','winter'], array['shopping','culture','nightlife'], 'Akihabara, Chiyoda City', 35.6984, 139.7731),

((select id from destinations where slug = 'tokyo'),
 'Shinjuku Golden Gai & Omoide Yokocho', 'Tiny atmospheric bars in Golden Gai and yakitori alleys in Memory Lane — peak Tokyo nightlife experience.', 'nightlife', 180, '3,000-6,000 yen', false, 'Evening', array['spring','summer','autumn','winter'], array['nightlife','food'], 'Shinjuku, Shinjuku City', 35.6938, 139.7036),

((select id from destinations where slug = 'tokyo'),
 'Yanaka neighborhood walk', 'Old-town Tokyo: quiet temple lanes, a traditional shopping street (Yanaka Ginza), and the best sunset spot in the city.', 'sight', 120, 'Free', false, 'Afternoon', array['spring','summer','autumn','winter'], array['culture'], 'Yanaka, Taito City', 35.7259, 139.7676),

-- Kyoto activities
((select id from destinations where slug = 'kyoto'),
 'Fushimi Inari Shrine', 'Thousands of vermillion torii gates wind up the mountain. The full hike takes 2-3 hours but you can turn back anytime.', 'sight', 120, 'Free', false, 'Early morning', array['spring','summer','autumn','winter'], array['temples','nature'], 'Fushimi, Kyoto', 34.9671, 135.7727),

((select id from destinations where slug = 'kyoto'),
 'Arashiyama Bamboo Grove & Monkey Park', 'Walk through towering bamboo, then climb to the monkey park for panoramic views and wild macaques.', 'nature', 180, '550 yen (monkey park)', false, 'Morning', array['spring','summer','autumn','winter'], array['nature','culture'], 'Arashiyama, Ukyo Ward', 35.0094, 135.6722),

((select id from destinations where slug = 'kyoto'),
 'Kinkaku-ji (Golden Pavilion)', 'The iconic gold-leaf temple reflected in its mirror pond. One of Kyoto''s most photographed spots.', 'sight', 60, '500 yen', false, 'Morning', array['spring','summer','autumn','winter'], array['temples','culture'], 'Kita Ward, Kyoto', 35.0394, 135.7292),

((select id from destinations where slug = 'kyoto'),
 'Nishiki Market', 'Kyoto''s "Kitchen" — a narrow covered market with 100+ stalls selling pickles, tofu, matcha, knives, and street food.', 'food', 90, '1,000-3,000 yen', false, 'Late morning', array['spring','summer','autumn','winter'], array['food','shopping'], 'Nakagyo Ward, Kyoto', 35.0050, 135.7655),

((select id from destinations where slug = 'kyoto'),
 'Gion evening walk', 'Stroll through Kyoto''s geisha district at dusk. Spot maiko (apprentice geisha) heading to appointments along Hanamikoji-dori.', 'experience', 90, 'Free', false, 'Evening', array['spring','summer','autumn','winter'], array['culture','nightlife'], 'Gion, Higashiyama Ward', 35.0037, 135.7755),

((select id from destinations where slug = 'kyoto'),
 'Kiyomizu-dera Temple', 'Hillside temple with a famous wooden stage offering sweeping views of Kyoto. The approach streets are lined with pottery and sweet shops.', 'sight', 90, '400 yen', false, 'Early morning', array['spring','summer','autumn','winter'], array['temples','culture','shopping'], 'Higashiyama Ward, Kyoto', 34.9949, 135.7850),

((select id from destinations where slug = 'kyoto'),
 'Tea ceremony experience', 'Participate in a traditional Japanese tea ceremony in a Kyoto machiya (townhouse). Learn the etiquette and savor matcha with wagashi sweets.', 'experience', 60, '2,000-5,000 yen', true, 'Afternoon', array['spring','summer','autumn','winter'], array['culture','food'], 'Various locations, Kyoto', 35.0040, 135.7690);
