import { MediaMetadata, PlaylistItem, Platform } from '../types';

export function detectPlatformFromUrl(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    if (u.includes('music.youtube')) return 'ytmusic';
    return 'youtube';
  }
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'facebook';
  if (u.includes('spotify.com')) return 'spotify';
  if (u.includes('music.apple.com')) return 'applemusic';
  return 'generic';
}

export function isPlaylistUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes('playlist') ||
    u.includes('list=') ||
    u.includes('/album/') ||
    u.includes('/sets/')
  );
}

export const PRESET_EXAMPLES = [
  {
    label: 'YouTube: Synthwave Cyber 720p (50 MB)',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    platform: 'youtube' as Platform,
    type: 'single',
  },
  {
    label: 'Spotify: Chill Coding Lo-Fi Playlist (8 tracks)',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    platform: 'spotify' as Platform,
    type: 'playlist',
  },
  {
    label: 'TikTok: Viral Tech Review Clip',
    url: 'https://www.tiktok.com/@techcrabs/video/738291048123',
    platform: 'tiktok' as Platform,
    type: 'single',
  },
  {
    label: 'Twitter / X: Space Rocket Launch 1080p 60fps',
    url: 'https://x.com/spacex/status/178921894012',
    platform: 'twitter' as Platform,
    type: 'single',
  },
  {
    label: 'YouTube Playlist: Ultimate 2026 Gaming Beats (12 items)',
    url: 'https://www.youtube.com/playlist?list=PLrAl48FV9mL7-crabbits-cyber-mix',
    platform: 'youtube' as Platform,
    type: 'playlist',
  },
  {
    label: 'Apple Music: Neon Sunset Retro Electro',
    url: 'https://music.apple.com/us/album/neon-sunset-single/1440857781',
    platform: 'applemusic' as Platform,
    type: 'single',
  },
];

export const MOCK_METADATA_DATABASE: Record<string, Partial<MediaMetadata>> = {
  youtube: {
    title: 'SYNTHWAVE RADIO 24/7 - Retrowave Cyber Chill Beats [720p HD]',
    author: 'Omega Beats Studio',
    durationSeconds: 245,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 50.0, // exactly 50mb to test CrabCompression 50mb -> 4/9mb
    availableResolutions: ['2160p', '1440p', '1080p', '720p', '480p'],
    availableAudioTracks: ['Español (Original)', 'Inglés (Doblaje AI)', 'Pista Instrumental'],
    availableSubtitles: ['Español [Automático]', 'English [CC]', 'Japonés', 'Français'],
  },
  twitter: {
    title: 'Starship Orbital Launch Test Slow-Mo 4K',
    author: '@AstroFlight_X',
    durationSeconds: 62,
    thumbnail: 'https://images.unsplash.com/photo-1517976487507-59a5e18db695?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 42.5,
    availableResolutions: ['1080p', '720p', '480p'],
    availableAudioTracks: ['Sonido de Ambiente Original'],
    availableSubtitles: ['None'],
  },
  tiktok: {
    title: 'Trucos de programación en Python que NO sabías en 2026 #dev #crab',
    author: '@OmegaCodeLabs',
    durationSeconds: 45,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 24.8,
    availableResolutions: ['1080p', '720p'],
    availableAudioTracks: ['Audio Original (Limpio Sin Marca de Agua)'],
    availableSubtitles: ['Español [Subtítulos integrados]', 'English [Auto]'],
  },
  instagram: {
    title: 'Reels: Arquitectura Cyberpunk en Tokio Nocturno',
    author: '@neotokyo_visuals',
    durationSeconds: 30,
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 18.2,
    availableResolutions: ['1080p', '720p'],
    availableAudioTracks: ['Canción Original'],
    availableSubtitles: ['None'],
  },
  facebook: {
    title: 'Documental: El despertar de la computación cuántica',
    author: 'Ciencia Global Hub',
    durationSeconds: 580,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 95.0,
    availableResolutions: ['1080p', '720p', '480p', '360p'],
    availableAudioTracks: ['Español Neutro', 'Inglés Original'],
    availableSubtitles: ['Español', 'English'],
  },
  spotify: {
    title: 'Midnight Crustacean - Electro Crab (Master Audio)',
    author: 'Omega Sound Syndicate',
    durationSeconds: 218,
    thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 35.0,
    availableResolutions: ['1080p'],
    availableAudioTracks: ['Studio Master 320kbps', 'Dolby Atmos Spatial Mix'],
    availableSubtitles: ['Letra sincronizada (.LRC)', 'Letra en Español', 'Lyrics in English'],
  },
  ytmusic: {
    title: 'Neon Odyssey - High Dynamic Range Audio',
    author: 'Cyber Crab Soundlab',
    durationSeconds: 260,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 38.0,
    availableResolutions: ['1080p'],
    availableAudioTracks: ['Lossless 24-bit/48kHz', 'Hi-Res Stereo 320k'],
    availableSubtitles: ['Letra sincronizada (.LRC)'],
  },
  applemusic: {
    title: 'Crab Harmonic Resonance (Lossless ALAC)',
    author: 'Omega Labs Audio Ensemble',
    durationSeconds: 310,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 48.0,
    availableResolutions: ['1080p'],
    availableAudioTracks: ['Apple Lossless Audio Codec (ALAC)', 'Stereo AAC 256k'],
    availableSubtitles: ['Letra sincronizada (.LRC)'],
  },
  generic: {
    title: 'Archivo Multimedia Web Detectado',
    author: 'Fuente Universal',
    durationSeconds: 180,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    rawSizeMb: 50.0,
    availableResolutions: ['1080p', '720p', '480p'],
    availableAudioTracks: ['Pista Original'],
    availableSubtitles: ['Español', 'English'],
  },
};

export const SAMPLE_PLAYLIST_ITEMS: PlaylistItem[] = [
  {
    id: 'track-1',
    title: '01. TurboCrab Anthem - Cyber Wave Overdrive',
    author: 'Omega Labs Sound',
    durationSeconds: 215,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 48.5,
    selected: true,
    platform: 'youtube',
  },
  {
    id: 'track-2',
    title: '02. Quantum Crustacean - Deep Bass Protocol',
    author: 'Omega Labs Sound',
    durationSeconds: 198,
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 42.0,
    selected: true,
    platform: 'youtube',
  },
  {
    id: 'track-3',
    title: '03. Algorithmic Odyssey - FFmpeg Scent of Speed',
    author: 'Omega Labs Sound',
    durationSeconds: 260,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 52.0,
    selected: true,
    platform: 'youtube',
  },
  {
    id: 'track-4',
    title: '04. Psychoacoustic Dreamland - 432Hz Chillout',
    author: 'Omega Labs Sound',
    durationSeconds: 185,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 36.2,
    selected: true,
    platform: 'spotify',
  },
  {
    id: 'track-5',
    title: '05. High Velocity Claws - Metal Electro Breakbeat',
    author: 'Omega Labs Sound',
    durationSeconds: 240,
    thumbnail: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 55.4,
    selected: true,
    platform: 'spotify',
  },
  {
    id: 'track-6',
    title: '06. Midnight Tokyo Drift - Synthwave Night Drive',
    author: 'NeoCrab Records',
    durationSeconds: 310,
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 61.0,
    selected: true,
    platform: 'youtube',
  },
  {
    id: 'track-7',
    title: '07. Neural Network Beats - Generative Ambient Sound',
    author: 'Omega Labs AI',
    durationSeconds: 175,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 34.8,
    selected: true,
    platform: 'ytmusic',
  },
  {
    id: 'track-8',
    title: '08. Crab Shell Encryption - Final Outro Master',
    author: 'Omega Labs Sound',
    durationSeconds: 290,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&auto=format&fit=crop&q=80',
    rawSizeMb: 58.3,
    selected: true,
    platform: 'applemusic',
  },
];
