import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544', { timeout: 5000 });
    const d = response.data;
    return NextResponse.json({
      success: true,
      data: {
        latitude: d.latitude,
        longitude: d.longitude,
        altitude_km: d.altitude.toFixed(1),
        velocity_kmh: (d.velocity).toFixed(0),
        timestamp: d.timestamp,
        visibility: d.visibility,
        footprint_km: d.footprint.toFixed(0),
      },
      source: 'wheretheiss.at',
      timestamp: Date.now(),
    });
  } catch (error: any) {
    try {
      const resp = await axios.get('http://api.open-notify.org/iss-now.json', { timeout: 5000 });
      return NextResponse.json({
        success: true,
        data: {
          latitude: parseFloat(resp.data.iss_position.latitude),
          longitude: parseFloat(resp.data.iss_position.longitude),
          altitude_km: '408.0',
          velocity_kmh: '27600',
          timestamp: resp.data.timestamp,
        },
        source: 'open-notify',
      });
    } catch {
      return NextResponse.json({ success: false, error: 'ISS API unavailable' }, { status: 503 });
    }
  }
}
