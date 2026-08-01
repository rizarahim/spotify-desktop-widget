import { formatTime } from '../utils'

export default function VinylTheme({ track, artUrl, isPlaying, progressMs, durationMs, onPlayPause, onNext, onPrev, onSeek }) {
  function handleSeekClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    onSeek(pct * durationMs)
  }

  const progressPct = durationMs ? (progressMs / durationMs) * 100 : 0

  return (
    <div className="relative flex h-33 w-100 items-center rounded-[50px] border border-white/8 bg-linear-to-br from-[#1f1f24] to-[#121214] p-3 text-white">
      <div className={`flex -ml-5 h-35 w-35 shrink-0 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.6)] vinyl-groove ${isPlaying ? 'playing' : ''}`}>
        {artUrl && (
          <img
            className="h-35 w-35 rounded-full object-cover"
            src={artUrl}
            alt=""
          />
        )}
      </div>

      <div className="min-w-0 flex-1 px-4">

        {/* track name */}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">
          {track ? track.name : '—'}
        </div>

        {/* Artist names */}
        <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white/50">
          {track ? track.artists.map((a) => a.name).join(', ') : '—'}
        </div>

        {/* Progress bar and controls */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="min-w-7.5 text-[10px] text-white/40">{formatTime(progressMs)}</span>
          <div
            className="no-drag h-1 flex-1 cursor-pointer overflow-hidden rounded bg-white/12"
            onClick={handleSeekClick}
          >
            <div
              className="h-full rounded bg-linear-to-r from-[#cdd8dc] to-[#b8c3bc] transition-[width] duration-500 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="min-w-7.5 text-[10px] text-white/40">{formatTime(durationMs)}</span>
        </div>

        {/* Control Buttons */}
        <div className="no-drag h-5 mt-2 flex w-full shrink-0 items-center justify-between gap-2.5 pr-3">
        <button className="flex items-center cursor-pointer justify-center text-white/85 hover:text-white" onClick={onPrev}>
          <svg width="22" height="22" viewBox="0 0 27 27" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          className="flex h-12 w-12 items-center cursor-pointer justify-center rounded-fulltext-white hover:opacity-100"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button className="flex items-center cursor-pointer justify-center text-white/85 hover:text-white" onClick={onNext}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6h2v12h-2zm-2 6L5.5 6v12z" />
          </svg>
        </button>
      </div>
      </div>
    </div>
  )
}
