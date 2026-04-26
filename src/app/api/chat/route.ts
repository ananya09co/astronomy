import { NextResponse } from 'next/server';

const knowledgeBase = [
  { keywords: ['black hole', 'blackhole', 'singularity', 'event horizon'], response: "🌑 **Black Holes** are regions of spacetime where gravity is so strong that nothing — not even light — can escape once it crosses the **event horizon**.\n\nThey form when massive stars (>20 solar masses) collapse at the end of their lives. At the center lies a **singularity** — a point of infinite density. Supermassive black holes, millions to billions of times more massive than the Sun, lurk at the centers of most large galaxies, including our own Milky Way (Sagittarius A*).\n\nInterestingly, near the event horizon, **time slows down** relative to an outside observer — a prediction of Einstein's General Relativity confirmed by observations." },
  { keywords: ['dark matter', 'dark energy'], response: '🔭 **Dark Matter** accounts for ~27% of the universe but cannot be directly observed — we infer its existence from its gravitational effects on visible matter.\n\nGalaxies rotate too fast at their edges to be held together by visible matter alone — dark matter provides the extra gravitational glue. The leading candidates are **WIMPs** (Weakly Interacting Massive Particles) and axions, though none have been directly detected yet.\n\n**Dark Energy** (~68% of the universe) is even more mysterious — it is driving the accelerating expansion of the universe, acting as a repulsive force stretching space itself apart.' },
  { keywords: ['big bang', 'universe origin', 'beginning of universe'], response: "💥 The **Big Bang** was not an explosion in space — it was an explosion *of* space itself, approximately **13.8 billion years ago**.\n\nIn the first fraction of a second, the universe was unimaginably hot and dense. As it expanded and cooled, subatomic particles formed, then hydrogen and helium atoms (~380,000 years later). This released light we can still detect today as the **Cosmic Microwave Background radiation**.\n\nThe first stars formed ~200 million years after the Big Bang. The universe continues expanding — and the expansion is *accelerating* due to dark energy." },
  { keywords: ['neutron star', 'pulsar', 'magnetar'], response: '⭐ **Neutron Stars** are the collapsed cores of massive stars after supernova explosions. They pack 1-2 solar masses into a sphere just ~20 km across.\n\nA teaspoon of neutron star material would weigh **about 10 million tons** on Earth. Their surface gravity is ~200 billion times stronger than Earth\'s.\n\n**Pulsars** are rotating neutron stars that emit beams of electromagnetic radiation — like cosmic lighthouses. **Magnetars** are a rarer type with magnetic fields ~1000 times stronger than ordinary neutron stars, capable of distorting atomic structures.' },
  { keywords: ['milky way', 'galaxy', 'our galaxy'], response: "🌌 The **Milky Way** is a barred spiral galaxy approximately **100,000 light-years** in diameter containing 200–400 billion stars — and our Sun is just one of them.\n\nWe're located in the Orion Arm, about 26,000 light-years from the galactic center. A **supermassive black hole** called Sagittarius A* (4 million solar masses) sits at the center.\n\nThe Milky Way is on a collision course with the **Andromeda Galaxy** — they'll merge in ~4.5 billion years to form a new elliptical galaxy sometimes called 'Milkomeda.'" },
  { keywords: ['exoplanet', 'habitable zone', 'goldilocks zone', 'alien planet'], response: '🪐 **Exoplanets** are planets orbiting stars other than our Sun. As of 2026, we have confirmed over **5,500 exoplanets** — and this is just a tiny fraction of what exists.\n\nThe **Habitable Zone** (or Goldilocks Zone) is the range of distances from a star where liquid water *could* exist on a rocky planet\'s surface. Key candidates include **Proxima Centauri b** (4.24 ly), **TRAPPIST-1e** (39 ly), and **Kepler-442b** (1,200 ly).\n\nDetection methods include the **Transit Method** (watching a star dim as a planet crosses it) and **Radial Velocity** (measuring the star\'s wobble due to the planet\'s gravity).' },
  { keywords: ['constellation', 'zodiac', 'star pattern'], response: "✨ **Constellations** are patterns of stars as seen from Earth — they do not represent physically related stars, just coincidental alignments from our perspective.\n\nThere are **88 officially recognized constellations** defined by the IAU (International Astronomical Union). Ancient civilizations used constellations for navigation, agriculture timing, and storytelling.\n\nThe **Zodiacal constellations** are 12 (plus Ophiuchus) through which the Sun passes during the year. The brightest constellation is **Crux** (Southern Cross) and the largest is **Hydra**." },
  { keywords: ['telescope', 'james webb', 'hubble', 'observation'], response: "🔭 **Modern Telescopes** have revolutionized our understanding of the cosmos. The **Hubble Space Telescope** (launched 1990) operated for over 30 years, capturing iconic images of deep space.\n\nThe **James Webb Space Telescope** (launched 2021) operates in infrared and can see 13.7 billion years back in time — to when the first galaxies were forming. It peers through dust clouds invisible to Hubble.\n\nGround-based observatories like the **Very Large Telescope** (Chile) and the upcoming **Extremely Large Telescope** (39m mirror) push the boundaries further. Radio telescopes like FAST in China study the universe in radio wavelengths." },
  { keywords: ['supernova', 'stellar explosion', 'death of star'], response: "💫 A **Supernova** is one of the most energetic events in the universe — a stellar explosion that briefly outshines entire galaxies.\n\n**Type II supernovae** occur when massive stars (>8 solar masses) exhaust their fuel and their core collapses in milliseconds, releasing energy comparable to what the Sun will emit over its entire 10-billion-year lifetime.\n\n**Type Ia supernovae** occur in binary systems where a white dwarf accretes matter from a companion until it crosses the 1.4 solar mass (Chandrasekhar) limit and explodes — these serve as 'standard candles' to measure cosmic distances.\n\nAll heavy elements beyond iron (gold, uranium, etc.) were forged in supernova explosions — *we are made of stardust.*" },
];

const genericResponses = [
  "🌌 That's a fascinating question about the cosmos! Ask me about **black holes**, **dark matter**, **exoplanets**, **supernovae**, or **constellations**!",
  "⭐ Great question! The universe is ~13.8 billion years old. Ask me about **the Big Bang**, **neutron stars**, **the Milky Way**, or specific **planets**!",
  "🔭 Space is endlessly fascinating! Try asking me about **telescopes**, **cosmic distances**, **stellar evolution**, or **the search for extraterrestrial life**!",
];

export async function POST(request: Request) {
  const { message, userId } = await request.json();

  if (!message || message.trim() === '') {
    return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
  }

  const lower = message.toLowerCase();
  let specificResponse = knowledgeBase.find(entry => 
    entry.keywords.some(kw => lower.includes(kw))
  );

  const reply = specificResponse ? specificResponse.response : genericResponses[Math.floor(Math.random() * genericResponses.length)];

  // Persist to Supabase if userId is provided
  if (userId) {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('chat_messages').insert([
        { user_id: userId, role: 'user', content: message },
        { user_id: userId, role: 'assistant', content: reply }
      ]);
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      message: reply,
      timestamp: new Date().toISOString(),
      type: specificResponse ? 'knowledge' : 'general'
    }
  });
}
