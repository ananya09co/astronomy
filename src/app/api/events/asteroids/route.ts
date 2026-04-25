import { NextResponse } from 'next/server';
import axios from 'axios';

const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
  try {
    const today = new Date();
    const end = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startDate = today.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
      params: { start_date: startDate, end_date: endDate, api_key: NASA_KEY },
      timeout: 10000,
    });

    const neoData = response.data.near_earth_objects;
    const asteroids: any[] = [];

    for (const [date, neos] of Object.entries(neoData) as [string, any[]][]) {
      for (const neo of neos) {
        const closest = neo.close_approach_data[0];
        asteroids.push({
          id: neo.id,
          name: neo.name.replace('(', '').replace(')', '').trim(),
          date,
          distance_km: parseFloat(closest.miss_distance.kilometers).toFixed(0),
          distance_lunar: parseFloat(closest.miss_distance.lunar).toFixed(2),
          speed_kmh: parseFloat(closest.relative_velocity.kilometers_per_hour).toFixed(0),
          diameter_min: (neo.estimated_diameter.meters.estimated_diameter_min).toFixed(0),
          diameter_max: (neo.estimated_diameter.meters.estimated_diameter_max).toFixed(0),
          is_hazardous: neo.is_potentially_hazardous_asteroid,
          magnitude: neo.absolute_magnitude_h,
          nasa_url: neo.nasa_jpl_url,
        });
      }
    }

    // Sort by date then closest approach
    asteroids.sort((a, b) => a.date.localeCompare(b.date) || parseFloat(a.distance_km) - parseFloat(b.distance_km));

    return NextResponse.json({ success: true, data: asteroids, count: asteroids.length, source: 'nasa_neows' });
  } catch (err: any) {
    console.error('NeoWs error:', err.message);
    return NextResponse.json({ success: false, data: [], error: 'NASA NeoWs API unavailable' }, { status: 500 });
  }
}
