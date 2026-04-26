import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total count to determine rotation
    const { count } = await supabase.from('stars').select('*', { count: 'exact', head: true });
    
    // Use day of year to pick a star
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const offset = count ? dayOfYear % count : 0;

    const { data: star, error } = await supabase
      .from('stars')
      .select('*')
      .range(offset, offset)
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: star });
  } catch (error: any) {
    // Fallback if DB is empty or disconnected
    return NextResponse.json({ 
      success: true, 
      data: {
        name: 'Sirius',
        type: 'Main Sequence',
        distance: '8.6 ly',
        constellation: 'Canis Major',
        description: 'The brightest star in the night sky.',
        magnitude: -1.46,
        image_url: 'https://images.unsplash.com/photo-1477894775174-c83cc87ebe83?w=800'
      } 
    });
  }
}
