import { useEffect, useRef, useState } from 'react'

export function useNowPlaying(active) {
  const [nowPlaying, setNowPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!active) return

    let cancelled = false

    async function poll() {
      const data = await window.spotifyAPI.getNowPlaying()
      if (cancelled) return
      if (data && data.item) {
        setNowPlaying(data)
        setIsPlaying(data.is_playing)
      }
      timeoutRef.current = setTimeout(poll, 3000)
    }

    poll()

    return () => {
      cancelled = true
      clearTimeout(timeoutRef.current)
    }
  }, [active])

  return { nowPlaying, isPlaying, setIsPlaying }
}
