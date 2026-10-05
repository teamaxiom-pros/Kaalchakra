import { CulturalKnowledge } from '../types/cultural';

export const CULTURAL_DATABASE: CulturalKnowledge[] = [
  {
    id: 'ck-dholavira-water',
    title: 'Dholavira Hydraulic Architecture & Reservoirs',
    subtitle: 'Great Rann of Kutch, Gujarat',
    region: 'Western India (Maharashtra / Gujarat)',
    era: 'Harappan Civilization (c. 2600 – 1900 BCE)',
    domain: ['water-management', 'engineering', 'architecture'],
    summary:
      'Dholavira possesses one of the world’s most sophisticated prehistoric water harvesting and distribution networks. In an arid landscape flanked by ephemeral streams (Manhar and Mansar), Harappan engineers constructed 16 massive rock-cut reservoirs, stone feeder canals, cascading check-dams, and settling chambers that stored over 250,000 cubic metres of freshwater.',
    significance:
      'Demonstrates that civilization flourished in marginal climates through rigorous civil planning rather than permanent river abundance. The reservoirs occupied over 10% of the entire urban settlement.',
    sourceName: 'UNESCO World Heritage Centre / Archaeological Survey of India (ASI)',
    sourceUrl: 'https://whc.unesco.org/en/list/1644',
    relatedExperiences: ['bharat-architect', 'fort-master', 'engineering-lab'],
    keyQuote:
      '“The hydraulic system of Dholavira represents a masterpiece of human creative genius, storing precious monsoon runoff with precision masonry and gradient engineering.”',
    practicalInsight:
      'Settlements survived seasonal droughts by combining rock-hewn storage with upstream filtration basins to remove silt before storage.'
  },
  {
    id: 'ck-shivneri-rainwater',
    title: 'Deccan Hill-Fort Rainwater Cisterns (Tankas & Tankis)',
    subtitle: 'Shivneri, Raigad & Rajgad, Maharashtra',
    region: 'Western India (Maharashtra / Gujarat)',
    era: 'Medieval Fortresses & Trade (c. 1200 – 1700 CE)',
    domain: ['water-management', 'defence', 'architecture'],
    summary:
      'Deccan forts built on high basalt plateaus were engineered to be self-sustaining during prolonged sieges. Fort builders quarried basalt rock to create deep natural-cut cisterns (such as the Badami and Ganga-Jamuna tanks at Shivneri). Strategic catchment channels carved into rocky escarpments collected monsoon runoff, while natural subterranean aquifers kept water cool throughout summer.',
    significance:
      'Fortress strength was defined not by perimeter walls alone, but by water endurance. Chhatrapati Shivaji Maharaj’s state manual (Ramchandra Pant Amatya’s Adnyapatra) mandated that a fort must have independent natural water bodies inside its ramparts before construction.',
    sourceName: 'Archaeological Survey of India (ASI) — Hill Forts of Maharashtra / UNESCO Tentative List',
    sourceUrl: 'https://whc.unesco.org/en/tentativelists/6495/',
    relatedExperiences: ['fort-master', 'rajya-builder'],
    keyQuote:
      '“A fort without an inexhaustible natural water source is like an open field. First secure the water, then erect the ramparts.” — Adnyapatra (c. 1716 CE)',
    practicalInsight:
      'Placing grain granaries (Amberkhana) and rock cisterns near high bastions ensured defenders could withstand months of isolation.'
  },
  {
    id: 'ck-lothal-dockyard',
    title: 'Lothal Tidal Dockyard & World Trade Hub',
    subtitle: 'Saurashtra, Gujarat',
    region: 'Western India (Maharashtra / Gujarat)',
    era: 'Harappan Civilization (c. 2600 – 1900 BCE)',
    domain: ['trade', 'engineering'],
    summary:
      'Excavated by S.R. Rao of the ASI, Lothal features the world’s earliest known tidal dock basin connected via an inlet channel to the Sabarmati river estuary. Kiln-fired brick revetments, spillways, water-locking gates, and massive warehouse complexes handled international maritime shipments of carnelian beads, copper, and ivory exchanged with Mesopotamia and Dilmun.',
    significance:
      'Proves ancient Indian trade was scientifically integrated with hydrodynamics, tidal mechanics, and standardized weight certification.',
    sourceName: 'Archaeological Survey of India (ASI) — Excavations at Lothal',
    sourceUrl: 'https://asi.nic.in/lothal/',
    relatedExperiences: ['bharat-bazaar', 'bharat-architect'],
    keyQuote:
      '“The brick basin of Lothal accommodated sea-going vessels during high tide, stabilizing them through ingenious sluice systems.”',
    practicalInsight:
      'Dock gates opened with the crest of the tidal wave, allowing ships to enter before sealing the basin to prevent sediment stranding.'
  },
  {
    id: 'ck-ashokan-brahmi',
    title: 'Ashokan Rock Edicts & The Decipherment of Brahmi',
    subtitle: 'Girnar, Sopara, Dhauli & Sarnath',
    region: 'Pan-Indian',
    era: 'Mauryan & Early Historic (c. 320 – 180 BCE)',
    domain: ['language', 'heritage'],
    summary:
      'Emperor Ashoka inscribed moral edicts (Dhamma Lipi) across natural cliff-faces and polished sandstone monoliths throughout the subcontinent in Prakrit using the Brahmi script. Deciphered in 1837 by James Prinsep using bilingual Indo-Greek coins and recurring royal formulae, Brahmi is the ancestral mother script of virtually all modern Indic and Southeast Asian scripts (Devanagari, Tamil, Bengali, Tibetan, Thai).',
    significance:
      'Brahmi inscriptions mark the transition from oral cultural transmission to standardized epigraphic civic communication promoting compassion, religious tolerance, and public welfare.',
    sourceName: 'Archaeological Survey of India (ASI) — Inscriptions of Asoka (Corpus Inscriptionum Indicarum)',
    sourceUrl: 'https://asi.nic.in/epigraphical-studies/',
    relatedExperiences: ['lost-script', 'rajya-builder'],
    keyQuote:
      '“All men are my children. Just as I desire for my own children that they may enjoy every kind of prosperity and happiness, so do I desire for all men.” — Rock Edict II',
    practicalInsight:
      'The Brahmi script is an abugida where each consonant carries an inherent vowel ‘a’, modified systematically with diacritic strokes (matras).'
  },
  {
    id: 'ck-harappan-grid',
    title: 'Harappan Orthogonal Urban Grid & Covered Sanitation',
    subtitle: 'Mohenjo-daro & Harappa',
    region: 'Northern India (Indus / Gangetic)',
    era: 'Harappan Civilization (c. 2600 – 1900 BCE)',
    domain: ['architecture', 'engineering', 'water-management'],
    summary:
      'Harappan cities were planned with strict cardinal orientation, dividing residential wards through wide north-south and east-west thoroughfares. Every residence featured private bathing platforms connected through terracotta pipes to street-level covered brick drainage ditches with inspection traps and sump pits.',
    significance:
      'Represented the pinnacle of ancient public health and civic engineering; no contemporary bronze age civilization (Egypt, Mesopotamia) possessed comparable household wastewater drainage.',
    sourceName: 'UNESCO World Heritage Centre — Archaeological Ruins at Moenjodaro',
    sourceUrl: 'https://whc.unesco.org/en/list/138',
    relatedExperiences: ['bharat-architect', 'engineering-lab'],
    keyQuote:
      '“The brick-paved streets and corbelled subterranean storm drains reflected a municipal authority devoted to sanitation and egalitarian public hygiene.”',
    practicalInsight:
      'Sump pits trapped heavy solid silt before domestic greywater entered primary city drainage channels, preventing underground blockages.'
  },
  {
    id: 'ck-harappan-seals',
    title: 'Steatite Seals & Indus Trade Glyphs',
    subtitle: 'Kalibangan, Rakhigarhi & Mohenjo-daro',
    region: 'Northern India (Indus / Gangetic)',
    era: 'Harappan Civilization (c. 2600 – 1900 BCE)',
    domain: ['language', 'trade', 'heritage'],
    summary:
      'Carved from soft soapstone (steatite) and fired to ivory hardness, Harappan seals feature enigmatic iconography—the Unicorn Bull, Pashupati, Elephants, and Tigers—accompanied by brief inscriptions written right-to-left. Used to stamp wet clay tags (sealings) onto trade cargo bound for overseas markets.',
    significance:
      'Highlights the interconnection between literacy, commodity verification, and maritime merchants across ancient Afro-Eurasian trade routes.',
    sourceName: 'National Museum New Delhi — Harappan Gallery & Inscriptions',
    sourceUrl: 'https://nationalmuseumindia.gov.in',
    relatedExperiences: ['lost-script', 'bharat-bazaar'],
    keyQuote:
      '“Impressions of these seals found in Mesopotamian Ur and Kish confirm regular trading voyages across the Persian Gulf.”',
    practicalInsight:
      'Glyphs were engraved in reverse (intaglio) so that when pressed into soft clay, the emblem and script appeared in raised relief.'
  },
  {
    id: 'ck-murud-janjira',
    title: 'Murud-Janjira & Sindhudurg Island Fortifications',
    subtitle: 'Konkan Coast, Maharashtra',
    region: 'Western India (Maharashtra / Gujarat)',
    era: 'Medieval Fortresses & Trade (c. 1200 – 1700 CE)',
    domain: ['defence', 'engineering', 'architecture'],
    summary:
      'Constructed on bedrock islands in the Arabian Sea, forts like Sindhudurg and Murud-Janjira employed lead-molten stone foundations to resist relentless tidal battering. Sindhudurg’s concealed zig-zag sea-entrance (Dilli Darwaza) remained undetectable from open waters, while 3 freshwater sweet-wells inside the fort provided fresh drinking water despite being surrounded by seawater.',
    significance:
      'A triumph of maritime military architecture that prevented naval landings while safeguarding coastal spice and horse trade routes.',
    sourceName: 'Archaeological Survey of India (ASI) — Mumbai Circle',
    sourceUrl: 'https://asimumbaicircle.gov.in',
    relatedExperiences: ['fort-master', 'bharat-bazaar'],
    keyQuote:
      '“The bastion masonry utilized thousands of maunds of molten lead poured into bedrock joints to anchor ramparts against surging ocean swells.”',
    practicalInsight:
      'Concealing entry portals between overlapping curved bastions prevented enemy vessels from battering gates with direct artillery line-of-sight.'
  },
  {
    id: 'ck-kallanai-dam',
    title: 'Grand Anicut (Kallanai) River Regulator',
    subtitle: 'Kaveri Delta, Tamil Nadu',
    region: 'Southern India (Chola / Deccan)',
    era: 'Classical & Deccan Empires (c. 300 – 1100 CE)',
    domain: ['engineering', 'water-management'],
    summary:
      'Commissioned by King Karikala Chola in the 2nd century CE and expanded over centuries, the Grand Anicut is one of the oldest operating water diversion structures in the world. Built of unhewn stone across the Kaveri, it splits the river flow into the Kollidam branch to prevent delta flooding while feeding hundreds of agricultural irrigation canals.',
    significance:
      'Turned the Kaveri delta into the perennial rice bowl of Southern India and influenced modern British hydraulic engineers (like Sir Arthur Cotton).',
    sourceName: 'Ministry of Jal Shakti / Central Water Commission Historical Monograph',
    sourceUrl: 'https://jalshakti.gov.in',
    relatedExperiences: ['engineering-lab', 'bharat-architect'],
    keyQuote:
      '“A curving dam of stone blocks laid in clay mortar that has stood the torrential seasonal fury of the Kaveri for nearly two millennia.”',
    practicalInsight:
      'Curved weir design dissipates kinetic water momentum, diverting surplus flood crests into relief channels while keeping silt moving.'
  },
  {
    id: 'ck-muziris-papyrus',
    title: 'The Muziris Maritime Network & Indo-Roman Spice Trade',
    subtitle: 'Pattanam, Kodungallur, Kerala',
    region: 'Southern India (Chola / Deccan)',
    era: 'Classical & Deccan Empires (c. 300 – 1100 CE)',
    domain: ['trade', 'heritage'],
    summary:
      'The ancient port of Muziris on the Malabar coast welcomed Roman merchant fleets navigating the monsoon winds (Hippalus wind system) across the Indian Ocean. Ships exchanged gold coins, Italian wine amphorae, and glassware for Malabar black pepper (‘black gold’), Malabathrum, pearls, and fine beryls.',
    significance:
      'Documents that Southern India was an economic superpower whose trade surpluses caused Roman senators like Pliny the Elder to lament the drain of imperial treasury gold into India.',
    sourceName: 'Kerala Council for Historical Research (KCHR) / Archaeological Survey of India',
    sourceUrl: 'https://asi.nic.in/ancient-ports/',
    relatedExperiences: ['bharat-bazaar', 'lost-script'],
    keyQuote:
      '“Not a year passes in which India does not drain from the Roman Empire fifty million sesterces.” — Pliny the Elder, Naturalis Historia',
    practicalInsight:
      'Sailors utilized the South-West monsoon winds from July to September to reach India in 40 days, returning with North-East winter monsoons.'
  },
  {
    id: 'ck-stepwells-gujarat',
    title: 'Subterranean Stepped Architecture (Rani ki Vav & Adalaj)',
    subtitle: 'Patan & Ahmedabad, Gujarat',
    region: 'Western India (Maharashtra / Gujarat)',
    era: 'Medieval Fortresses & Trade (c. 1200 – 1700 CE)',
    domain: ['architecture', 'water-management', 'heritage'],
    summary:
      'Rani ki Vav (Queen’s Stepwell) is a monumental seven-storey inverted temple descending deep into subterranean water tables. Featuring over 500 major sculpted panels depicting the avatars of Vishnu, it combined sacred art, communal caravan shelter, and climate-controlled micro-cool sanctuaries for weary travelers.',
    significance:
      'Elevated utilitarian water cisterns into supreme architectural monuments, demonstrating how Indian culture sanctified water stewardship.',
    sourceName: 'UNESCO World Heritage Centre — Rani-ki-Vav at Patan',
    sourceUrl: 'https://whc.unesco.org/en/list/1317',
    relatedExperiences: ['bharat-architect', 'fort-master', 'heritage-quest'],
    keyQuote:
      '“An inverted temple dedicated to the sanctity of subterranean water, descending through pillared galleries into the cool heart of the earth.”',
    practicalInsight:
      'Multi-tiered pillared pavilions shielded the water column from direct sunlight, drastically reducing evaporation losses in arid plains.'
  },
  {
    id: 'ck-arthashastra-forts',
    title: 'Kautilya’s Durgavidhana: Fort Classification & Planning',
    subtitle: 'Taxila & Pataliputra, Bihar',
    region: 'Northern India (Indus / Gangetic)',
    era: 'Mauryan & Early Historic (c. 320 – 180 BCE)',
    domain: ['defence', 'architecture'],
    summary:
      'The Arthashastra by Chanakya (Kautilya) systematized defensive military geography into four archetypal fort categories: Jala-durga (Water fort), Giri-durga (Hill fort), Vana-durga (Forest fort), and Dhanvana-durga (Desert fort). It dictated strict ratios for granary reserves, underground escape tunnels, fire-fighting reservoirs, and concentric moats (Parikha).',
    significance:
      'The foundational Indian treatise on strategic defense planning, emphasizing that foresight and supply self-reliance matter more than brute numerical force.',
    sourceName: 'Indira Gandhi National Centre for the Arts (IGNCA) — Arthashastra Studies',
    sourceUrl: 'http://ignca.gov.in',
    relatedExperiences: ['fort-master', 'rajya-builder'],
    keyQuote:
      '“A king must ensure that fort granaries contain staples sufficient for years of isolation, with storehouses constructed elevated above moisture.” — Arthashastra, Book II',
    practicalInsight:
      'Concentric moats filled with crocodiles or submerged stakes forced attackers into narrow choke points controlled by elevated archer towers.'
  },
  {
    id: 'ck-tamil-brahmi-keeladi',
    title: 'Keeladi Pottery Inscriptions & Sangam Urban Civilization',
    subtitle: 'Vaigai River Basin, Tamil Nadu',
    region: 'Southern India (Chola / Deccan)',
    era: 'Mauryan & Early Historic (c. 320 – 180 BCE)',
    domain: ['language', 'heritage', 'trade'],
    summary:
      'Excavations at Keeladi by the Tamil Nadu State Department of Archaeology yielded hundreds of potsherds bearing Tamil-Brahmi personal names (such as Aadhan, Udhiran). The site reveals sophisticated brick structures, bead-making furnaces, terracotta ring-wells, and weaving weights dating back to the 6th century BCE.',
    significance:
      'Demonstrates high public literacy across artisanal merchant classes in early historic South India, pushing back the chronology of urban Sangam civilization.',
    sourceName: 'State Department of Archaeology, Tamil Nadu — Keeladi Excavation Report',
    sourceUrl: 'https://archaeology.tn.gov.in',
    relatedExperiences: ['lost-script', 'bharat-bazaar'],
    keyQuote:
      '“The graffito on ordinary drinking vessels reveals that writing in Tamil-Brahmi was practiced by common citizens and potters, not just royal scribes.”',
    practicalInsight:
      'Merchants inscribed their clan names onto storage jars to identify ownership before loading containers onto coastal trading catamarans.'
  }
];

export function getCulturalKnowledgeById(id: string): CulturalKnowledge | undefined {
  return CULTURAL_DATABASE.find(item => item.id === id);
}

export function getKnowledgeByExperience(experienceId: string): CulturalKnowledge[] {
  return CULTURAL_DATABASE.filter(item =>
    item.relatedExperiences.includes(experienceId)
  );
}

export function searchCulturalDatabase(query: string, domain?: string, region?: string): CulturalKnowledge[] {
  const q = query.toLowerCase().trim();
  return CULTURAL_DATABASE.filter(item => {
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.significance.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.era.toLowerCase().includes(q);

    const matchesDomain = !domain || item.domain.includes(domain as any);
    const matchesRegion = !region || item.region === region;

    return matchesQuery && matchesDomain && matchesRegion;
  });
}
