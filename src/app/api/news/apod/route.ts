import { NextResponse } from 'next/server';
import axios from 'axios';

const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_KEY }
    });
    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'NASA APOD unavailable' }, { status: 503 });
  }
}
