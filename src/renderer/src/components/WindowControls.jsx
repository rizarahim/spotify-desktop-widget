export default function WindowControls({ onThemeSwitch }) {
  return (
    <>
      <button
        className="no-drag absolute left-3.5 top-2.5 z-10 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        title="Switch theme"
        onClick={onThemeSwitch}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 1.5 1.5 0 001.06-2.56 1.5 1.5 0 011.06-2.56H16a4 4 0 004-4c0-5-4.48-9-8-9zm-5.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>
      <button
        className="no-drag absolute right-9 top-2.5 z-10 text-base text-white/50 hover:text-white"
        title="Minimize"
        onClick={() => window.spotifyAPI.minimizeApp()}
      >
        &#8211;
      </button>
      <button
        className="no-drag absolute right-3.5 top-2.5 z-10 text-base text-white/50 hover:text-white"
        title="Close"
        onClick={() => window.spotifyAPI.closeApp()}
      >
        ✕
      </button>
    </>
  )
}
