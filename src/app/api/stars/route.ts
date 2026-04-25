import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: stars, error } = await supabase
      .from('stars')
      .select('*')
      .order('magnitude', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data: stars });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
