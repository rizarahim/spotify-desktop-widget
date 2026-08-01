import { useEffect, useState } from 'react'
import WindowControls from './components/WindowControls'
import LoginScreen from './components/LoginScreen'
import VinylTheme from './components/VinylTheme'
import BlurTheme from './components/BlurTheme'
import { useNowPlaying } from './hooks/useNowPlaying'

const THEME_SIZES = {
  vinyl: [460, 200],
  blur: [200, 260]
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [theme, setTheme] = useState('vinyl')
  const { nowPlaying, isPlaying, setIsPlaying } = useNowPlaying(loggedIn)

  useEffect(() => {
    window.spotifyAPI.checkSavedLogin().then((already) => {
      if (already) setLoggedIn(true)
    })
  }, [])

  useEffect(() => {
    if (!loggedIn) return
    const [w, h] = THEME_SIZES[theme]
    window.spotifyAPI.resizeWindow(w, h)
  }, [loggedIn, theme])

  function applyTheme(name) {
    localStorage.setItem('widgetTheme', name)
    setTheme(name)
  }

  async function handleLogin() {
    await window.spotifyAPI.login()
    setLoggedIn(true)
  }

  function handlePlayPause() {
    window.spotifyAPI.playPause()
    setIsPlaying((prev) => !prev)
  }

  function handleSeek(positionMs) {
    window.spotifyAPI.seekTo(positionMs)
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const track = nowPlaying?.item ?? null
  const artUrl = track?.album?.images?.[0]?.url ?? null

  return (
    <>
      <WindowControls onThemeSwitch={() => applyTheme(theme === 'vinyl' ? 'blur' : 'vinyl')} />

      {theme === 'vinyl' && (
        <VinylTheme
          track={track}
          artUrl={artUrl}
          isPlaying={isPlaying}
          progressMs={nowPlaying?.progress_ms ?? 0}
          durationMs={track?.duration_ms ?? 0}
          onPlayPause={handlePlayPause}
          onNext={() => window.spotifyAPI.skipNext()}
          onPrev={() => window.spotifyAPI.skipPrevious()}
          onSeek={handleSeek}
        />
      )}

      {theme === 'blur' && (
        <BlurTheme track={track} artUrl={artUrl} isPlaying={isPlaying} onPlayPause={handlePlayPause} />
      )}
    </>
  )
}
