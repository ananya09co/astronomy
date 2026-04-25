import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('http://api.open-notify.org/astros.json', { timeout: 8000 });
    const issCrewOnly = response.data.people.filter((p: any) => p.craft === 'ISS');
    return NextResponse.json({ 
      success: true, 
      data: { people: issCrewOnly, total: response.data.number }, 
      source: 'open-notify' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: true, 
      data: { 
        people: [
          { name: 'Oleg Kononenko', craft: 'ISS' },
          { name: 'Nikolai Chub', craft: 'ISS' },
          { name: 'Tracy Dyson', craft: 'ISS' },
        ], 
        total: 3 
      }, 
      source: 'fallback' 
    });
  }
}
