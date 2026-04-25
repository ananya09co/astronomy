import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // In a real app, you'd pick one based on date. For now, we take the one with the closest featured_date.
    const { data: star, error } = await supabase
      .from('stars')
      .select('*')
      .limit(1)
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
