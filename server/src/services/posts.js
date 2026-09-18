/**
 * Social post helpers: parse post URLs (YouTube / Instagram), fetch metadata
 * for manual posts, and sync the NGO's YouTube channel into the posts store.
 */

export const DEFAULT_CHANNEL_ID = 'UCtDooLADLvqTO82z6UWlvng'; // youtube.com/@dpsngo

/** Extract the video/shortcode from a YouTube or Instagram URL. */
export function parsePostUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl).trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  const path = url.pathname.replace(/\/+$/, '');

  if (host === 'youtu.be') {
    const id = path.split('/')[1];
    return id && /^[A-Za-z0-9_-]{6,20}$/.test(id)
      ? { platform: 'youtube', kind: 'video', externalId: id, canonicalUrl: `https://www.youtube.com/watch?v=${id}` }
      : null;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    const v = url.searchParams.get('v');
    if (v && /^[A-Za-z0-9_-]{6,20}$/.test(v)) {
      return { platform: 'youtube', kind: 'video', externalId: v, canonicalUrl: `https://www.youtube.com/watch?v=${v}` };
    }
    const m = path.match(/^\/(shorts|embed|live|v)\/([A-Za-z0-9_-]{6,20})/);
    if (m) {
      return {
        platform: 'youtube',
        kind: m[1] === 'shorts' ? 'short' : 'video',
        externalId: m[2],
        canonicalUrl: `https://www.youtube.com/watch?v=${m[2]}`,
      };
    }
    return null;
  }

  if (host === 'instagram.com' || host === 'www.instagram.com' || host === 'm.instagram.com') {
    const m = path.match(/^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,20})/);
    if (m) {
      const kind = m[1] === 'p' || m[1] === 'tv' ? 'post' : 'reel';
      return {
        platform: 'instagram',
        kind,
        externalId: m[2],
        canonicalUrl: `https://www.instagram.com/${kind === 'post' ? 'p' : 'reel'}/${m[2]}/`,
      };
    }
    return null;
  }

  return null;
}

export function youtubeThumb(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

async function fetchJson(url, timeoutMs = 5000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Title/author for a YouTube video via the public oEmbed endpoint (no API key). */
export async function fetchYouTubeMeta(videoId) {
  try {
    const data = await fetchJson(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
    );
    return { title: data.title || '', author: data.author_name || '' };
  } catch {
    return null; // Video private/deleted, or network hiccup — a post is still creatable.
  }
}

/** Latest public videos of a channel from its RSS feed (no API key). */
export async function fetchChannelVideos(channelId) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`YouTube feed returned HTTP ${res.status}`);
  const xml = await res.text();

  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries
    .map((entry) => {
      const videoId = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
      const title = (entry.match(/<title>([^<]+)<\/title>/) || [])[1];
      const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1];
      if (!videoId) return null;
      return {
        videoId,
        title: title ? decodeXmlEntities(title) : '',
        published: published || null,
      };
    })
    .filter(Boolean);
}

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Upsert every feed video into the store (source: 'auto'). Safe to run
 * concurrently: duplicates are prevented by the {source, externalId} index and
 * the store's upsert implementation.
 * Returns the number of newly added videos.
 */
export async function syncChannelVideos(store, channelId = process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID) {
  const videos = await fetchChannelVideos(channelId);
  let added = 0;
  for (const video of videos) {
    const created = await store.upsertAutoPost({
      platform: 'youtube',
      kind: 'video',
      externalId: video.videoId,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
      title: video.title,
      thumbnailUrl: youtubeThumb(video.videoId),
      publishedAt: video.published ? new Date(video.published) : null,
    });
    if (created) added += 1;
  }
  return added;
}
