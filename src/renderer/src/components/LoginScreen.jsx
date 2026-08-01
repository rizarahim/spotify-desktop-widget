export default function LoginScreen({ onLogin }) {
  return (
    <div className="flex h-[150px] w-[300px] items-center justify-center rounded-3xl bg-[#121214]">
      <button
        className="no-drag cursor-pointer rounded-full bg-[#1DB954] px-6 py-3 text-sm font-bold text-white hover:bg-[#1ed760]"
        onClick={onLogin}
      >
        Login with Spotify
      </button>
    </div>
  )
}
