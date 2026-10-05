-- ==============================================================================
-- KAALCHAKRA — AUTHORITATIVE CULTURAL CONTENT & ACHIEVEMENTS SEED
-- ==============================================================================

-- 1. SEED CULTURAL DISCOVERIES
INSERT INTO public.cultural_discoveries (
    slug, title, subtitle, region, era, domains, summary, significance, source_name, source_url, related_experience_ids, key_quote, practical_insight, published
) VALUES
(
    'ck-dholavira-water',
    'Dholavira Hydraulic Architecture & Reservoirs',
    'Great Rann of Kutch, Gujarat',
    'Western India (Maharashtra / Gujarat)',
    'Harappan Civilization (c. 2600 – 1900 BCE)',
    ARRAY['water-management', 'engineering', 'architecture'],
    'Dholavira possesses one of the world’s most sophisticated prehistoric water harvesting networks with 16 massive rock-cut reservoirs, stone feeder canals, cascading check-dams, and settling chambers storing over 250,000 cubic metres of freshwater.',
    'Demonstrates that civilization flourished in marginal climates through rigorous civil planning rather than permanent river abundance.',
    'UNESCO World Heritage Centre / Archaeological Survey of India (ASI)',
    'https://whc.unesco.org/en/list/1644',
    ARRAY['bharat-architect', 'fort-master', 'engineering-lab'],
    '“The hydraulic system of Dholavira represents a masterpiece of human creative genius, storing precious monsoon runoff with precision masonry and gradient engineering.”',
    'Settlements survived seasonal droughts by combining rock-hewn storage with upstream filtration basins to remove silt before storage.',
    true
),
(
    'ck-shivneri-rainwater',
    'Deccan Hill-Fort Rainwater Cisterns (Tankas & Tankis)',
    'Shivneri, Raigad & Rajgad, Maharashtra',
    'Western India (Maharashtra / Gujarat)',
    'Medieval Fortresses & Trade (c. 1200 – 1700 CE)',
    ARRAY['water-management', 'defence', 'architecture'],
    'Deccan forts built on high basalt plateaus were engineered to be self-sustaining during prolonged sieges through deep natural-cut basalt cisterns and catchment channels collecting monsoon runoff.',
    'Fortress strength was defined by water endurance. Amatya’s Adnyapatra mandated that a fort must secure independent water bodies inside its ramparts before construction.',
    'Archaeological Survey of India (ASI) — Hill Forts of Maharashtra / UNESCO Tentative List',
    'https://whc.unesco.org/en/tentativelists/6495/',
    ARRAY['fort-master', 'rajya-builder'],
    '“A fort without an inexhaustible natural water source is like an open field. First secure the water, then erect the ramparts.” — Adnyapatra (c. 1716 CE)',
    'Placing grain granaries and rock cisterns near high bastions ensured defenders could withstand months of isolation.',
    true
),
(
    'ck-lothal-dockyard',
    'Lothal Tidal Dockyard & World Trade Hub',
    'Saurashtra, Gujarat',
    'Western India (Maharashtra / Gujarat)',
    'Harappan Civilization (c. 2600 – 1900 BCE)',
    ARRAY['trade', 'engineering'],
    'Excavated by S.R. Rao of the ASI, Lothal features the world’s earliest known tidal dock basin connected to the Sabarmati estuary with brick revetments, spillways, and water-locking gates.',
    'Proves ancient Indian trade was scientifically integrated with hydrodynamics, tidal mechanics, and standardized weight certification.',
    'Archaeological Survey of India (ASI) — Excavations at Lothal',
    'https://asi.nic.in/lothal/',
    ARRAY['bharat-bazaar', 'bharat-architect'],
    '“The brick basin of Lothal accommodated sea-going vessels during high tide, stabilizing them through ingenious sluice systems.”',
    'Dock gates opened with the crest of the tidal wave, allowing ships to enter before sealing the basin to prevent sediment stranding.',
    true
),
(
    'ck-ashokan-brahmi',
    'Ashokan Rock Edicts & The Decipherment of Brahmi',
    'Girnar, Sopara, Dhauli & Sarnath',
    'Pan-Indian',
    'Mauryan & Early Historic (c. 320 – 180 BCE)',
    ARRAY['language', 'heritage'],
    'Emperor Ashoka inscribed moral edicts across rock-faces throughout India in Prakrit using Brahmi script. Deciphered in 1837 by James Prinsep, Brahmi is the ancestral script of modern Indic writing.',
    'Marked the transition from oral cultural transmission to standardized epigraphic civic communication promoting compassion and religious tolerance.',
    'Archaeological Survey of India (ASI) — Inscriptions of Asoka',
    'https://asi.nic.in/epigraphical-studies/',
    ARRAY['lost-script', 'rajya-builder'],
    '“All men are my children. Just as I desire for my own children that they may enjoy every kind of prosperity and happiness, so do I desire for all men.” — Rock Edict II',
    'The Brahmi script is an abugida where each consonant carries an inherent vowel ‘a’, modified systematically with diacritic strokes.',
    true
),
(
    'ck-harappan-grid',
    'Harappan Orthogonal Urban Grid & Covered Sanitation',
    'Mohenjo-daro & Harappa',
    'Northern India (Indus / Gangetic)',
    'Harappan Civilization (c. 2600 – 1900 BCE)',
    ARRAY['architecture', 'engineering', 'water-management'],
    'Harappan cities were planned with strict cardinal orientation. Every residence featured private bathing platforms connected through terracotta pipes to street-level covered brick drainage ditches with inspection traps.',
    'Represented the pinnacle of ancient public health and civic engineering unmatched in contemporary Bronze Age civilizations.',
    'UNESCO World Heritage Centre — Archaeological Ruins at Moenjodaro',
    'https://whc.unesco.org/en/list/138',
    ARRAY['bharat-architect', 'engineering-lab'],
    '“The brick-paved streets and corbelled subterranean storm drains reflected a municipal authority devoted to sanitation and egalitarian public hygiene.”',
    'Sump pits trapped heavy solid silt before domestic greywater entered primary city drainage channels.',
    true
),
(
    'ck-harappan-seals',
    'Steatite Seals & Indus Trade Glyphs',
    'Kalibangan, Rakhigarhi & Mohenjo-daro',
    'Northern India (Indus / Gangetic)',
    'Harappan Civilization (c. 2600 – 1900 BCE)',
    ARRAY['language', 'trade', 'heritage'],
    'Carved from soapstone and fired to ivory hardness, Harappan seals feature enigmatic iconography—the Unicorn Bull, Elephants, and Tigers—used to stamp wet clay tags onto overseas trade cargo.',
    'Highlights the interconnection between literacy, commodity verification, and maritime merchants across ancient Afro-Eurasian trade routes.',
    'National Museum New Delhi — Harappan Gallery & Inscriptions',
    'https://nationalmuseumindia.gov.in',
    ARRAY['lost-script', 'bharat-bazaar'],
    '“Impressions of these seals found in Mesopotamian Ur and Kish confirm regular trading voyages across the Persian Gulf.”',
    'Glyphs were engraved in reverse (intaglio) so that when pressed into soft clay, the emblem appeared in raised relief.',
    true
),
(
    'ck-arthashastra-forts',
    'Kautilya’s Durgavidhana: Fort Classification & Planning',
    'Taxila & Pataliputra, Bihar',
    'Northern India (Indus / Gangetic)',
    'Mauryan & Early Historic (c. 320 – 180 BCE)',
    ARRAY['defence', 'architecture'],
    'The Arthashastra by Chanakya systematized defensive military geography into four fort categories: Jala-durga, Giri-durga, Vana-durga, and Dhanvana-durga, dictating strict ratios for granary reserves and moats.',
    'The foundational Indian treatise on strategic defense planning, emphasizing that foresight and supply self-reliance matter more than brute numerical force.',
    'Indira Gandhi National Centre for the Arts (IGNCA)',
    'http://ignca.gov.in',
    ARRAY['fort-master', 'rajya-builder'],
    '“A king must ensure that fort granaries contain staples sufficient for years of isolation, with storehouses elevated above moisture.” — Arthashastra, Book II',
    'Concentric moats forced attackers into narrow choke points controlled by elevated archer towers.',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    significance = EXCLUDED.significance,
    updated_at = NOW();

-- 2. SEED AUTHORITATIVE ACHIEVEMENTS
INSERT INTO public.achievements (
    slug, name, description, icon, domain, published
) VALUES
(
    'ach-fort-architect',
    'Fort Architect',
    'Constructed and fortified your first Deccan hill stronghold in Fort Master.',
    '🏰',
    'defence',
    true
),
(
    'ach-water-steward',
    'Water Steward',
    'Secured freshwater resilience against seasonal monsoons or droughts.',
    '💧',
    'water-management',
    true
),
(
    'ach-master-builder',
    'Master Builder',
    'Engineered an egalitarian Harappan settlement with full drainage and road connectivity.',
    '🏛️',
    'architecture',
    true
),
(
    'ach-cultural-detective',
    'Cultural Detective',
    'Investigated and matched ancient inscription fragments in Lost Script.',
    '🧩',
    'heritage',
    true
),
(
    'ach-epigraphist',
    'Royal Epigraphist',
    'Deciphered an Ashokan edict or Harappan trade seal with high accuracy.',
    '📜',
    'language',
    true
),
(
    'ach-civil-engineer',
    'Hydraulic Pioneer',
    'Engineered subterranean rainwater channels inspired by Dholavira.',
    '⚙️',
    'engineering',
    true
),
(
    'ach-bharat-darshan',
    'Bharat Darshan',
    'Unlocked cultural discoveries across three distinct historical Indian regions.',
    '🌏',
    'heritage',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;
