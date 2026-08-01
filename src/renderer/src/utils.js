export function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  return `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, '0')}`
}
