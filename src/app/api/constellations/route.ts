import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hemisphere = searchParams.get('hemisphere');
  const month = searchParams.get('month');

  try {
    let query = supabase.from('constellations').select('*');

    if (hemisphere) {
      query = query.ilike('hemisphere', `%${hemisphere}%`);
    }
    if (month) {
      query = query.ilike('best_month', `%${month}%`);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
