import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Video, 
  Music, 
  Settings2, 
  Sliders, 
  FileText, 
  Flame, 
  Check, 
  Share2, 
  Lock, 
  Layers, 
  HardDrive, 
  Terminal, 
  ArrowRight,
  Info,
  Youtube,
  Twitter,
  Instagram,
  Music2,
  Headphones,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { 
  UserSession, 
  Platform, 
  MediaType, 
  MediaFormat, 
  VideoResolution, 
  AudioQuality, 
  SubtitleMode,
  MediaMetadata,
  ActiveDownloadTask
} from '../types';
import { calculateCrabCompression } from '../utils/crabCompression';
import { detectPlatformFromUrl, MOCK_METADATA_DATABASE, PRESET_EXAMPLES } from '../data/sampleMedia';

interface SingleDownloaderProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenTierUpgrade: () => void;
  onStartDownload: (task: ActiveDownloadTask) => void;
}

export const SingleDownloader: React.FC<SingleDownloaderProps> = ({
  user,
  onOpenAuth,
  onOpenTierUpgrade,
  onStartDownload,
}) => {
  // Input URL
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=4xDzrJKXOOY');
  
  // Media Type (Video vs Audio-only)
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [videoFormat, setVideoFormat] = useState<MediaFormat>('mp4');
  const [audioFormat, setAudioFormat] = useState<MediaFormat>('mp3');
  
  // Detailed Configurations
  const [resolution, setResolution] = useState<VideoResolution>('720p');
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('320k');
  const [selectedAudioTrack, setSelectedAudioTrack] = useState('Español (Original)');
  const [subtitleMode, setSubtitleMode] = useState<SubtitleMode>('embedded');
  const [subtitleLang, setSubtitleLang] = useState('Español [Automático]');
  const [embedMetadata, setEmbedMetadata] = useState(true);
  const [embedThumbnail, setEmbedThumbnail] = useState(true);
  
  // CrabCompression level (1-10 or 1-20)
  const [crabLevel, setCrabLevel] = useState<number>(8);
  const [copiedFfmpeg, setCopiedFfmpeg] = useState(false);

  // Platform and Metadata detection
  const detectedPlatform = useMemo(() => detectPlatformFromUrl(url), [url]);

  const currentMetadata: MediaMetadata = useMemo(() => {
    const defaultData = MOCK_METADATA_DATABASE[detectedPlatform] || MOCK_METADATA_DATABASE.generic;
    
    // Calculate raw size based on resolution and duration
    let rawSize = defaultData.rawSizeMb || 50.0;
    if (mediaType === 'audio') {
      rawSize = Math.max(8.0, Number((rawSize * 0.22).toFixed(1)));
    } else {
      if (resolution === '2160p') rawSize = 220.0;
      else if (resolution === '1440p') rawSize = 110.0;
      else if (resolution === '1080p') rawSize = 75.0;
      else if (resolution === '720p') rawSize = 50.0; // The famous 50MB benchmark!
      else if (resolution === '480p') rawSize = 28.0;
    }

    return {
      id: 'media-' + Math.random().toString(36).substring(7),
      url: url,
      title: defaultData.title || 'Contenido Multimedia Ultra HD',
      author: defaultData.author || 'Omega Media Protocol',
      platform: detectedPlatform,
      durationSeconds: defaultData.durationSeconds || 245,
      thumbnail: defaultData.thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      rawSizeMb: rawSize,
      availableResolutions: defaultData.availableResolutions || ['1080p', '720p', '480p'],
      availableAudioTracks: defaultData.availableAudioTracks || ['Pista Original'],
      availableSubtitles: defaultData.availableSubtitles || ['Español', 'English'],
    };
  }, [detectedPlatform, mediaType, resolution, url]);

  // CrabCompression calculations
  const compressionStats = useMemo(() => {
    return calculateCrabCompression(crabLevel, currentMetadata.rawSizeMb, mediaType === 'audio');
  }, [crabLevel, currentMetadata.rawSizeMb, mediaType]);

  const maxAllowedTier = user?.unlockedMaxTier || 10;

  const handleLevelChange = (val: number) => {
    if (val > maxAllowedTier) {
      onOpenTierUpgrade();
      return;
    }
    setCrabLevel(val);
  };

  const handleDownloadClick = () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    // Build the task
    const chosenFormat = mediaType === 'video' ? videoFormat : audioFormat;
    const cleanFileName = `${currentMetadata.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_crabL${crabLevel}.${chosenFormat}`;
    
    const newTask: ActiveDownloadTask = {
      id: 'task-' + Date.now(),
      title: currentMetadata.title,
      platform: detectedPlatform,
      type: mediaType,
      format: chosenFormat,
      progress: 0,
      speedMbPerSec: 14.5 + Math.random() * 8.2,
      originalSizeMb: currentMetadata.rawSizeMb,
      compressedSizeMb: compressionStats.compressedSizeMb,
      crabLevel: crabLevel,
      status: 'queued',
      fileName: cleanFileName,
      logLines: [
        `[TurboCrab] Conectando a ${detectedPlatform.toUpperCase()} via yt-dlp...`,
        `[Omega Engine] Metadata extraída: ${currentMetadata.title}`,
        `[CrabCompression] Iniciando matriz matemática Nivel ${crabLevel}`,
        `[FFmpeg] Aplicando ${compressionStats.videoCodec} CRF ${compressionStats.crfValue} + ${compressionStats.audioCodec}`,
      ],
    };

    onStartDownload(newTask);
  };

  const copyFfmpegCommand = () => {
    navigator.clipboard.writeText(`ffmpeg -i input.mp4 ${compressionStats.ffmpegFlag} output.${mediaType === 'video' ? videoFormat : audioFormat}`);
    setCopiedFfmpeg(true);
    setTimeout(() => setCopiedFfmpeg(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Callout */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
            <span>🦀 Motor CrabCompression v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-slate-400">Omega Labs Inc</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            Descargador Universal de Video, Música y Archivos
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Pega enlaces de <strong>YouTube, Twitter/X, TikTok, Instagram, Facebook, Spotify, Apple Music</strong> y más. Configura resolución, pista de audio, letras y aplica <strong>CrabCompression</strong> para reducir de 50MB a 4-9MB con matemáticas avanzadas.
          </p>
        </div>

        {/* Platform Icons Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Plataformas Soportadas:</span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 text-red-400 border border-slate-700/50 flex items-center gap-1">
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 text-sky-400 border border-slate-700/50 flex items-center gap-1">
            <Twitter className="w-3.5 h-3.5" /> Twitter / X
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 text-emerald-400 border border-slate-700/50 flex items-center gap-1">
            <Music2 className="w-3.5 h-3.5" /> Spotify
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 text-pink-400 border border-slate-700/50 flex items-center gap-1">
            <Instagram className="w-3.5 h-3.5" /> Instagram / TikTok
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 text-indigo-400 border border-slate-700/50 flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5" /> Apple Music
          </span>
        </div>
      </div>

      {/* Main Download Control Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* URL Input Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            URL del Video, Canción o Archivo
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="main-url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega aquí la URL (ej: https://www.youtube.com/watch?v=... o Spotify / TikTok)"
                className="w-full pl-4 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono shadow-inner"
              />
              <span className="absolute right-3 top-3.5 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700 uppercase">
                {detectedPlatform}
              </span>
            </div>

            <button
              type="button"
              id="btn-paste-url"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text) setUrl(text);
                } catch {
                  // fallback
                }
              }}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Pegar
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1">Ejemplos rápidos:</span>
            {PRESET_EXAMPLES.filter(p => p.type === 'single').map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => setUrl(example.url)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-orange-300 border border-slate-800 transition"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Preview & Mode Switcher */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thumbnail & Preview info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
              <img
                src={currentMetadata.thumbnail}
                alt={currentMetadata.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold text-orange-400 uppercase tracking-wide">
                      {detectedPlatform}
                    </span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded">
                      {Math.floor(currentMetadata.durationSeconds / 60)}:
                      {(currentMetadata.durationSeconds % 60).toString().padStart(2, '0')} min
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {currentMetadata.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{currentMetadata.author}</p>
                </div>
              </div>
            </div>

            {/* Mode selection: Video vs Audio */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Tipo de Descarga:</span>
                <span className="text-[11px] text-orange-400 font-normal">
                  {mediaType === 'video' ? 'Video Completo' : 'Extraer Solo Audio'}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="mode-video-btn"
                  onClick={() => setMediaType('video')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                    mediaType === 'video'
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  id="mode-audio-btn"
                  onClick={() => setMediaType('audio')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                    mediaType === 'audio'
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Solo Audio / MP3</span>
                </button>
              </div>

              {/* Format pills */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Contenedor / Formato Destino:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {mediaType === 'video' ? (
                    (['mp4', 'mkv', 'webm'] as MediaFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setVideoFormat(fmt)}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition ${
                          videoFormat === fmt
                            ? 'bg-slate-200 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        .{fmt}
                      </button>
                    ))
                  ) : (
                    (['mp3', 'flac', 'm4a', 'opus', 'wav'] as MediaFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setAudioFormat(fmt)}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition ${
                          audioFormat === fmt
                            ? 'bg-slate-200 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        .{fmt}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Settings Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4" />
                  Configuración a Detalle
                </h4>
                <span className="text-[11px] text-slate-500">
                  Totalmente Personalizable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Resolution (if video) */}
                {mediaType === 'video' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Resolución de Video:
                    </label>
                    <select
                      id="select-resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as VideoResolution)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="2160p">4K UHD (2160p 60fps)</option>
                      <option value="1440p">2K QHD (1440p)</option>
                      <option value="1080p">Full HD (1080p 60fps)</option>
                      <option value="720p">HD (720p - Ideal Crab)</option>
                      <option value="480p">SD (480p)</option>
                      <option value="360p">Bajo Consumo (360p)</option>
                    </select>
                  </div>
                )}

                {/* Audio Quality / Bitrate */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Calidad de Audio:
                  </label>
                  <select
                    id="select-audio-quality"
                    value={audioQuality}
                    onChange={(e) => setAudioQuality(e.target.value as AudioQuality)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="320k">320 kbps (Máxima Fidelidad MP3)</option>
                    <option value="flac_lossless">FLAC Lossless (24-bit Hi-Fi)</option>
                    <option value="256k">256 kbps (AAC Estudio)</option>
                    <option value="192k">192 kbps (Estándar)</option>
                    <option value="128k">128 kbps (Ultra Ligero)</option>
                  </select>
                </div>

                {/* Audio Track */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pista de Audio (Multi-lenguaje):
                  </label>
                  <select
                    id="select-audio-track"
                    value={selectedAudioTrack}
                    onChange={(e) => setSelectedAudioTrack(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    {currentMetadata.availableAudioTracks.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtitles / Lyrics Mode */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Letras / Subtítulos:
                  </label>
                  <select
                    id="select-subtitle-mode"
                    value={subtitleMode}
                    onChange={(e) => setSubtitleMode(e.target.value as SubtitleMode)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="none">Sin subtítulos / letras</option>
                    <option value="embedded">Integrados en el video (Softsub/Hardsub)</option>
                    <option value="separate_srt">Archivo separado (.SRT)</option>
                    <option value="separate_vtt">Archivo separado (.VTT)</option>
                    <option value="lrc_lyrics">Letra sincronizada musical (.LRC)</option>
                  </select>
                </div>

                {/* Subtitles Language */}
                {subtitleMode !== 'none' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Idioma de Letra / Subtítulo:
                    </label>
                    <select
                      id="select-subtitle-lang"
                      value={subtitleLang}
                      onChange={(e) => setSubtitleLang(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Español [Automático]">Español (Auto-detectado)</option>
                      <option value="English [CC]">English (Original / CC)</option>
                      <option value="Japonés">Japonés (Romaji / Kanji)</option>
                      <option value="Français">Français</option>
                      <option value="Multi">Todos los idiomas disponibles</option>
                    </select>
                  </div>
                )}

                {/* Metadata & Tagging */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="check-embed-metadata"
                      checked={embedMetadata}
                      onChange={(e) => setEmbedMetadata(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700 focus:ring-orange-500"
                    />
                    <span className="text-slate-300 text-xs">
                      Incrustar Metadatos (Artista, Álbum, Año, Capítulos)
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="check-embed-thumbnail"
                      checked={embedThumbnail}
                      onChange={(e) => setEmbedThumbnail(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700 focus:ring-orange-500"
                    />
                    <span className="text-slate-300 text-xs">
                      Portada HD Incrustada en el archivo
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* CrabCompression Mathematical Slider Component */}
            <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30 rounded-xl border border-orange-500/40 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-orange-500/20 text-orange-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-1.5">
                      CrabCompression™
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        Nivel {crabLevel} / {maxAllowedTier}
                      </span>
                    </h4>
                  </div>
                </div>

                {maxAllowedTier === 10 ? (
                  <button
                    type="button"
                    onClick={onOpenTierUpgrade}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    ¿Desbloquear Nivel 20?
                  </button>
                ) : (
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    Tier 20 Ultra Habilitado
                  </span>
                )}
              </div>

              {/* Slider bar */}
              <div className="space-y-1.5 py-1">
                <input
                  type="range"
                  id="slider-crab-level"
                  min={1}
                  max={maxAllowedTier}
                  value={crabLevel}
                  onChange={(e) => handleLevelChange(parseInt(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 (Ligero)</span>
                  <span>5 (Equilibrado)</span>
                  <span className="text-orange-400 font-bold">10 (Crab Máx: 50MB ➔ 4-9MB)</span>
                  {maxAllowedTier === 20 && (
                    <span className="text-amber-300 font-bold">20 (Ultra Quantum)</span>
                  )}
                </div>
              </div>

              {/* Live Mathematical Metric Output */}
              <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Peso Original</div>
                  <div className="text-sm font-mono font-bold text-slate-300">
                    {compressionStats.originalSizeMb} MB
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-orange-400 font-medium">CrabCompression</div>
                  <div className="text-base font-mono font-black text-orange-400">
                    {compressionStats.compressedSizeMb} MB
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-emerald-400 font-medium">Ahorro Matemático</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    -{compressionStats.reductionPercentage}%
                  </div>
                </div>
              </div>

              {/* Mathematical explanation */}
              <div className="mt-2.5 p-2 bg-black/40 rounded-lg text-[11px] text-slate-400 flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-slate-300 font-medium">
                    🔬 Matriz: {compressionStats.mathFormulaDescription}
                  </div>
                  <div className="font-mono text-[10px] text-orange-300/80 truncate max-w-sm">
                    {compressionStats.ffmpegFlag}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyFfmpegCommand}
                  className="shrink-0 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copiar comando FFmpeg"
                >
                  {copiedFfmpeg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Listo para procesar: <strong>{currentMetadata.title.substring(0, 40)}...</strong> ({compressionStats.compressedSizeMb} MB con CrabCompression)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!user && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Requiere Iniciar Sesión
              </span>
            )}
            <button
              type="button"
              id="btn-start-download"
              onClick={handleDownloadClick}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/20 transition cursor-pointer"
            >
              <span className="text-lg">🦀</span>
              <span>Descargar con TurboCrab ({compressionStats.compressedSizeMb} MB)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
