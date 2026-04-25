import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    let query = supabase.from('news').select('*').order('date', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: news, error } = await query.range((page - 1) * 10, page * 10 - 1);

    if (error) throw error;
    return NextResponse.json({ success: true, data: news });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
