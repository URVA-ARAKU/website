/**
 * Robust YouTube video ID parser that handles all known YouTube link formats:
 * - Direct ID: 'aN2sDNVf-Js'
 * - Standard: 'https://www.youtube.com/watch?v=aN2sDNVf-Js'
 * - Query with timestamp/features: 'https://www.youtube.com/watch?feature=shared&v=aN2sDNVf-Js&t=10s'
 * - Shortened: 'https://youtu.be/aN2sDNVf-Js?si=xyz'
 * - Shorts: 'https://www.youtube.com/shorts/aN2sDNVf-Js'
 * - Live: 'https://www.youtube.com/live/aN2sDNVf-Js'
 * - Embed: 'https://www.youtube.com/embed/aN2sDNVf-Js'
 * - Mobile: 'https://m.youtube.com/watch?v=aN2sDNVf-Js'
 */
export function parseYouTubeVideoId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // If already clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for all standard YouTube URL variations
  const urlMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i
  );
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  // Fallback: look for any 11-character alphanumeric token if URL matched youtube
  if (trimmed.includes('youtube') || trimmed.includes('youtu.be')) {
    const fallbackMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
  }

  return trimmed;
}

/**
 * Returns safe embed URL for an iframe
 */
export function getYouTubeEmbedUrl(urlOrId: string, autoplay = false): string {
  const videoId = parseYouTubeVideoId(urlOrId) || 'aN2sDNVf-Js';
  const autoPlayParam = autoplay ? '1' : '0';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayParam}&mute=0&controls=1&rel=0&modestbranding=1`;
}

/**
 * Returns high-quality thumbnail image URL for a YouTube video
 */
export function getYouTubeThumbnailUrl(urlOrId: string, quality: 'maxres' | 'hq' | 'mq' = 'hq'): string {
  const videoId = parseYouTubeVideoId(urlOrId) || 'aN2sDNVf-Js';
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Backward compatibility alias
export const getYouTubeId = parseYouTubeVideoId;
