import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const NASA_IMG_BASE = 'https://images-api.nasa.gov';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const page = searchParams.get('page') || '1';

  const queries: Record<string, string> = {
    nebula: 'nebula',
    galaxy: 'galaxy',
    solar_system: 'planets',
    telescope: 'webb',
    all: 'space',
  };

  const query = queries[category] || queries.all;

  try {
    const response = await axios.get(`${NASA_IMG_BASE}/search`, {
      params: { q: query, media_type: 'image', page_size: 24, page },
      timeout: 10000,
    });

    const rawItems = response.data?.collection?.items || [];
    
    // If no items found, use fallback
    if (rawItems.length === 0) {
      throw new Error('No items returned from NASA');
    }

    const items = rawItems
      .filter((item: any) => item.links && item.data)
      .map((item: any, i: number) => {
        const meta = item.data[0];
        const thumb = item.links.find((l: any) => l.rel === 'preview')?.href || item.links[0]?.href;
        return {
          id: meta.nasa_id || `nasa_${Math.random()}`,
          title: meta.title || 'NASA Image',
          category: category,
          description: meta.description || meta.title || 'Real NASA image.',
          image_url: thumb,
          hd_url: thumb?.includes('~thumb') ? thumb.replace('~thumb.jpg', '~large.jpg') : thumb,
          source: 'NASA',
          date: meta.date_created?.split('T')[0] || '2024',
          likes: Math.floor(Math.random() * 5000),
        };
      });

    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    const fallback = [
      { id: 'hubble_carina', title: 'Carina Nebula', category: 'nebula', image_url: 'https://imgsrc.hubblesite.org/hvi/uploads/image_file/image_attachment/31034/STSCI-H-p2016a-m-2000x2000.png', description: "Hubble's massive view of the Carina Nebula.", source: 'NASA/Hubble' },
      { id: 'webb_pillar', title: 'Pillars of Creation', category: 'nebula', image_url: 'https://stsci-opo.org/STScI-01GFNQY6FKTK6E3Z6S8JMM5V6F.png', description: 'James Webb Space Telescope view of the Pillars of Creation.', source: 'NASA/Webb' },
      { id: 'andromeda', title: 'Andromeda Galaxy', category: 'galaxy', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/M31_09-01-2011_%288345919830%29.jpg/1200px-M31_09-01-2011_%288345919830%29.jpg', description: 'Our neighboring Andromeda galaxy.', source: 'NASA/Hubble' },
    ];
    return NextResponse.json({ success: true, data: fallback, source: 'fallback' });
  }
}
