import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ success: true, data: data.map(f => f.item_id) })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, itemId } = await request.json()

  if (!userId || !itemId) {
    return NextResponse.json({ success: false, error: 'User ID and Item ID are required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .upsert({ user_id: userId, item_id: itemId }, { onConflict: 'user_id,item_id' })
      .select()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { userId, itemId } = await request.json()

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
