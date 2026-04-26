import { supabase } from './supabase';

export const serverData = {
  getStarOfDay: async () => {
    try {
      const { count } = await supabase.from('stars').select('*', { count: 'exact', head: true });
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const offset = count ? dayOfYear % count : 0;

      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .range(offset, offset)
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch {
      return { 
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
      };
    }
  },

  getUpcomingEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(5);
      if (error) throw error;
      return { success: true, data };
    } catch {
      return { success: true, data: [] };
    }
  },

  getTodayApod: async () => {
    const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    try {
      // Revalidate every 4 hours to ensure we catch the new APOD regardless of build time
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`, {
        next: { revalidate: 14400 } 
      });
      const data = await res.json();
      return { success: true, data };
    } catch {
      return { success: false, data: null };
    }
  },

  getMarsRoverPhotos: async (rover = 'perseverance') => {
    const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    try {
      const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${NASA_API_KEY}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      return { success: true, data: data.latest_photos || [] };
    } catch {
      return { success: false, data: [] };
    }
  }
};
