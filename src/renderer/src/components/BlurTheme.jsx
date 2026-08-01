export default function BlurTheme({ track, artUrl, isPlaying, onPlayPause }) {
  return (
    <div className="relative h-62 w-50 overflow-hidden rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
      <div
        className="absolute -inset-5 scale-115 bg-cover bg-center brightness-70 saturate-130"
        style={{ backgroundImage: artUrl ? `url('${artUrl}')` : undefined }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/75" />
      <div className="relative z-10 flex h-full flex-col justify-end p-4.5 text-white">
        <div className="mb-0.5 text-[15px] [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
          {track ? track.name : '—'}
        </div>
        <div className="mb-4 text-xs opacity-85 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
          {track ? track.artists.map((a) => a.name).join(', ') : '—'}
        </div>

        <div className="flex items-center justify-between rounded-[20px] bg-white/10 p-3.5 backdrop-blur-md">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111]"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            className="flex items-center justify-center text-white/90 hover:text-white"
            title="Share (coming soon)"
            onClick={() => alert('Share-to-Instagram-Story is coming in the next build!')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 100-6 3 3 0 00-3 3c0 .24.04.47.09.7L7.04 9.81A3 3 0 105.04 15c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 105.84 0 2.92 2.92 0 00-2.92-2.92z" />
            </svg>
          </button>
          <button className="flex items-center justify-center text-white/90 hover:text-white" title="More">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
