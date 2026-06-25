/**
 * Format seconds into human-readable duration
 * e.g. 3661 -> "1 giờ 1 phút 1 giây"
 */
export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return '0 phút';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds} giây`);
  return parts.join(' ') || '0 phút';
}

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
