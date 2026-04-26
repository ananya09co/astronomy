'use client'

import { useState, useEffect } from 'react'

export function useUserSession() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check local storage for an existing unique ID
    let storedId = localStorage.getItem('cosmic_atlas_user_id')
    
    if (!storedId) {
      // Create a new unique ID if one doesn't exist
      storedId = 'user_' + Math.random().toString(36).substring(2, 11)
      localStorage.setItem('cosmic_atlas_user_id', storedId)
    }
    
    setUserId(storedId)
  }, [])

  return userId
}
