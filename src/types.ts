export type Platform =
  | 'youtube'
  | 'twitter'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'spotify'
  | 'ytmusic'
  | 'applemusic'
  | 'generic';

export interface UserSession {
  email: string;
  name: string;
  authMethod: 'google' | 'email';
  securityPin: string;
  isLoggedIn: boolean;
  isVerifiedTier20: boolean;
  unlockedMaxTier: 10 | 20;
  avatarUrl: string;
  downloadsCount: number;
  totalSavedMegabytes: number;
}

export type MediaFormat = 'mp4' | 'mkv' | 'webm' | 'mp3' | 'm4a' | 'flac' | 'opus' | 'wav';
export type MediaType = 'video' | 'audio';
export type VideoResolution = '2160p' | '1440p' | '1080p' | '720p' | '480p' | '360p';
export type AudioQuality = '320k' | '256k' | '192k' | '128k' | 'flac_lossless';
export type SubtitleMode = 'none' | 'embedded' | 'separate_srt' | 'separate_vtt' | 'lrc_lyrics';
export type ArchiveFormat = 'zip' | 'rar' | '7z';

export interface MediaMetadata {
  id: string;
  url: string;
  title: string;
  author: string;
  platform: Platform;
  durationSeconds: number;
  thumbnail: string;
  rawSizeMb: number;
  availableResolutions: VideoResolution[];
  availableAudioTracks: string[];
  availableSubtitles: string[];
}

export interface PlaylistItem {
  id: string;
  title: string;
  author: string;
  durationSeconds: number;
  thumbnail: string;
  rawSizeMb: number;
  selected: boolean;
  platform: Platform;
}

export interface CompressionCalculation {
  level: number;
  originalSizeMb: number;
  compressedSizeMb: number;
  reductionPercentage: number;
  videoCodec: string;
  audioCodec: string;
  crfValue: number;
  preset: string;
  ffmpegFlag: string;
  mathFormulaDescription: string;
}

export interface ActiveDownloadTask {
  id: string;
  title: string;
  platform: Platform;
  type: MediaType;
  format: MediaFormat;
  progress: number; // 0 to 100
  speedMbPerSec: number;
  originalSizeMb: number;
  compressedSizeMb: number;
  crabLevel: number;
  status: 'queued' | 'downloading' | 'compressing' | 'completed' | 'error';
  archivePassword?: string;
  isPlaylist?: boolean;
  itemCount?: number;
  downloadBlobUrl?: string;
  fileName: string;
  logLines: string[];
}
