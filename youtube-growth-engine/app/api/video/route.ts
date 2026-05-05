import { NextResponse } from 'next/server';

const CATEGORY_NAMES: Record<string, string> = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '18': 'Short Movies',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '21': 'Videoblogging',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  '29': 'Nonprofits & Activism',
  '30': 'Movies',
  '31': 'Anime/Animation',
  '32': 'Action/Adventure',
  '33': 'Classics',
  '34': 'Comedy',
  '35': 'Documentary',
  '36': 'Drama',
  '37': 'Family',
  '38': 'Foreign',
  '39': 'Horror',
  '40': 'Sci-Fi/Fantasy',
  '41': 'Thriller',
  '42': 'Shorts',
  '43': 'Shows',
  '44': 'Trailers',
};

const parseIsoDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatDurationText = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY is not set in environment' }, { status: 500 });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: 'YouTube Data API request failed', details: errorText }, { status: response.status });
  }

  const data = await response.json();
  const item = Array.isArray(data.items) ? data.items[0] : null;

  if (!item) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  const snippet = item.snippet || {};
  const statistics = item.statistics || {};
  const contentDetails = item.contentDetails || {};
  const duration = String(contentDetails.duration || '');
  const durationSeconds = parseIsoDuration(duration);

  return NextResponse.json({
    title: snippet.title || '',
    viewCount: Number(statistics.viewCount || 0),
    publishDate: snippet.publishedAt || '',
    categoryId: snippet.categoryId || '',
    categoryName: CATEGORY_NAMES[snippet.categoryId] || 'Other',
    duration,
    durationSeconds,
    durationText: formatDurationText(durationSeconds),
  });
}
