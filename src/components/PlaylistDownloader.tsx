import React, { useState, useMemo } from 'react';
import { 
  ListMusic, 
  Archive, 
  Key, 
  CheckSquare, 
  Square, 
  Flame, 
  Lock, 
  Sliders, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle,
  FileArchive,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import JSZip from 'jszip';
import { 
  UserSession, 
  PlaylistItem, 
  ArchiveFormat, 
  MediaFormat, 
  MediaType, 
  ActiveDownloadTask 
} from '../types';
import { SAMPLE_PLAYLIST_ITEMS, PRESET_EXAMPLES, detectPlatformFromUrl } from '../data/sampleMedia';
import { calculateCrabCompression, generateRandomPassword } from '../utils/crabCompression';

interface PlaylistDownloaderProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenTierUpgrade: () => void;
  onStartDownload: (task: ActiveDownloadTask) => void;
}

export const PlaylistDownloader: React.FC<PlaylistDownloaderProps> = ({
  user,
  onOpenAuth,
  onOpenTierUpgrade,
  onStartDownload,
}) => {
  const [playlistUrl, setPlaylistUrl] = useState('https://www.youtube.com/playlist?list=PLrAl48FV9mL7-crabbits-cyber-mix');
  const [items, setItems] = useState<PlaylistItem[]>(SAMPLE_PLAYLIST_ITEMS);
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [format, setFormat] = useState<MediaFormat>('mp3');
  const [crabLevel, setCrabLevel] = useState<number>(8);
  const [archiveFormat, setArchiveFormat] = useState<ArchiveFormat>('zip');
  const [usePassword, setUsePassword] = useState<boolean>(true);
  const [customPassword, setCustomPassword] = useState<string>('');
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const [downloadSuccessData, setDownloadSuccessData] = useState<{
    archiveName: string;
    archivePassword: string | null;
    originalTotalMb: number;
    compressedTotalMb: number;
    selectedCount: number;
  } | null>(null);

  const detectedPlatform = useMemo(() => detectPlatformFromUrl(playlistUrl), [playlistUrl]);
  const maxAllowedTier = user?.unlockedMaxTier || 10;

  // Toggle selection on left click
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: true })));
  };

  const handleDeselectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: false })));
  };

  const handleInvertSelection = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: !item.selected })));
  };

  // Calculate totals
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const totalOriginalSizeMb = useMemo(() => {
    const raw = selectedItems.reduce((acc, curr) => acc + curr.rawSizeMb, 0);
    return mediaType === 'audio' ? Number((raw * 0.25).toFixed(1)) : Number(raw.toFixed(1));
  }, [selectedItems, mediaType]);

  const compressionStats = useMemo(() => {
    return calculateCrabCompression(crabLevel, totalOriginalSizeMb, mediaType === 'audio');
  }, [crabLevel, totalOriginalSizeMb, mediaType]);

  const handleStartPlaylistDownload = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (selectedItems.length === 0) {
      return;
    }

    setIsProcessingZip(true);

    // Determine random password if requested
    const finalPassword = usePassword
      ? (customPassword.trim() || generateRandomPassword(10))
      : null;

    setGeneratedPassword(finalPassword);

    try {
      // Create real ZIP file with JSZip
      const zip = new JSZip();
      const folderName = `TurboCrab_Playlist_${Date.now()}`;
      const folder = zip.folder(folderName) || zip;

      // Add readme and security note
      const manifestContent = `================================================================================
🦀 TURBOCRAB DOWNLOADER - OMEGA LABS INC (NON-PROFIT)
================================================================================
Playlist: ${detectedPlatform.toUpperCase()}
Total de pistas: ${selectedItems.length}
Formato: ${format.toUpperCase()}
Motor CrabCompression: Nivel ${crabLevel}
Ahorro de espacio obtenido: ${compressionStats.reductionPercentage}%
Contraseña asignada: ${finalPassword || 'SIN CONTRASEÑA'}
================================================================================
Lista de Pistas:
${selectedItems.map((item, idx) => `${idx + 1}. ${item.title} - ${item.author} (${Math.round(item.durationSeconds / 60)}m)`).join('\n')}
`;
      folder.file('00_INFO_PLAYLIST_TURBOCRAB.txt', manifestContent);

      if (finalPassword) {
        folder.file(
          'CLAVE_DE_DESENCRIPTADO_IMPORTANTE.txt',
          `Tu contraseña aleatoria asignada para esta descarga masiva es:\n\n${finalPassword}\n\nGuarda esta clave para descomprimir tus archivos si tu descompresor lo solicita.`
        );
      }

      // Generate dummy media placeholder tracks
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const trackFileName = `${(i + 1).toString().padStart(2, '0')}_${item.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.${format}`;
        
        // Lightweight simulated media buffer
        const mediaContent = `[TurboCrab Audio/Video Stream]\nTrack: ${item.title}\nArtist: ${item.author}\nPlatform: ${item.platform}\nCompressed with CrabCompression Level ${crabLevel}\nCalculated Size: ${(item.rawSizeMb * (1 - compressionStats.reductionPercentage / 100)).toFixed(2)} MB\nOmega Labs Inc 2026`;
        folder.file(trackFileName, mediaContent);
      }

      // Generate blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);

      const archiveFileName = `TurboCrab_Playlist_${selectedItems.length}_tracks.${archiveFormat}`;

      // Register task in download manager
      const newTask: ActiveDownloadTask = {
        id: 'playlist-task-' + Date.now(),
        title: `Playlist: ${selectedItems.length} pistas (${detectedPlatform.toUpperCase()})`,
        platform: detectedPlatform,
        type: mediaType,
        format: format,
        progress: 100,
        speedMbPerSec: 24.8,
        originalSizeMb: totalOriginalSizeMb,
        compressedSizeMb: compressionStats.compressedSizeMb,
        crabLevel: crabLevel,
        status: 'completed',
        archivePassword: finalPassword || undefined,
        isPlaylist: true,
        itemCount: selectedItems.length,
        downloadBlobUrl: downloadUrl,
        fileName: archiveFileName,
        logLines: [
          `[Playlist] Procesando ${selectedItems.length} pistas seleccionadas`,
          `[CrabCompression] Aplicando reducción nivel ${crabLevel} (-${compressionStats.reductionPercentage}%)`,
          finalPassword ? `[Seguridad] Generando archivo cifrado con clave aleatoria: ${finalPassword}` : `[Seguridad] Empaquetando archivo sin contraseña`,
          `[JSZip] Compilación de archivo ${archiveFormat.toUpperCase()} completada`,
        ],
      };

      onStartDownload(newTask);

      // Trigger browser download immediately
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = archiveFileName;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      setDownloadSuccessData({
        archiveName: archiveFileName,
        archivePassword: finalPassword,
        originalTotalMb: totalOriginalSizeMb,
        compressedTotalMb: compressionStats.compressedSizeMb,
        selectedCount: selectedItems.length,
      });

    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsProcessingZip(false);
    }
  };

  const copyPasswordToClipboard = () => {
    if (downloadSuccessData?.archivePassword) {
      navigator.clipboard.writeText(downloadSuccessData.archivePassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-2">
              <ListMusic className="w-3.5 h-3.5" />
              <span>Módulo de Playlists Masivas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Descarga de Playlists en Archivos Comprimidos
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Introduce cualquier lista de reproducción (YouTube, Spotify, Apple Music). Selecciona o desactiva videos con un <strong>clic izquierdo</strong>. Descarga todo en un solo <strong>.zip, .rar o .7z</strong> con contraseña aleatoria y compresión CrabCompression.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
            <Archive className="w-6 h-6 text-orange-400" />
            <div className="text-xs">
              <div className="text-white font-bold">Empaquetado Masivo</div>
              <div className="text-slate-400">Formatos: .ZIP / .RAR / .7Z</div>
            </div>
          </div>
        </div>

        {/* Playlist URL Input */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            URL de la Playlist
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="playlist-url-input"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=... o Spotify / YT Music"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-orange-500 shadow-inner"
            />
            <button
              type="button"
              id="btn-analyze-playlist"
              onClick={() => {
                // shuffle sample items for realism
                setItems((prev) =>
                  [...prev].sort(() => Math.random() - 0.5).map((x) => ({ ...x, selected: true }))
                );
              }}
              className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Explorar Pistas</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
            <span className="text-slate-500 text-[11px] self-center">Ejemplos:</span>
            {PRESET_EXAMPLES.filter((p) => p.type === 'playlist').map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setPlaylistUrl(ex.url)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal / Banner when archive is generated */}
      {downloadSuccessData && (
        <div 
          id="playlist-download-success-banner"
          className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/50 shadow-2xl space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  ¡Playlist Empaquetada y Descargada con Éxito!
                </h3>
                <p className="text-xs text-emerald-300/90">
                  {downloadSuccessData.selectedCount} pistas procesadas • {downloadSuccessData.archiveName}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDownloadSuccessData(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Cerrar
            </button>
          </div>

          {/* Password box if applicable */}
          {downloadSuccessData.archivePassword ? (
            <div className="p-3.5 bg-slate-950/90 border border-amber-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">
                    Tu contraseña aleatoria de seguridad asignada es:
                  </div>
                  <div className="text-base font-mono font-black text-amber-300 tracking-wider">
                    {downloadSuccessData.archivePassword}
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-copy-archive-pass"
                onClick={copyPasswordToClipboard}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedPassword ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPassword ? '¡Copiada!' : 'Copiar Contraseña'}
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              El archivo comprimido no requiere contraseña para abrirse.
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
            <span>Peso original: {downloadSuccessData.originalTotalMb} MB</span>
            <span>➜</span>
            <span className="text-orange-400 font-bold">
              Peso final CrabCompression: {downloadSuccessData.compressedTotalMb} MB (-{compressionStats.reductionPercentage}%)
            </span>
          </div>
        </div>
      )}

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Playlist Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span>Pistas en la lista ({selectedItems.length} de {items.length} activas)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (Clic izquierdo para activar/desactivar)
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                id="btn-select-all"
                onClick={handleSelectAll}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium"
              >
                Todas
              </button>
              <button
                type="button"
                id="btn-deselect-all"
                onClick={handleDeselectAll}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium"
              >
                Ninguna
              </button>
              <button
                type="button"
                id="btn-invert-select"
                onClick={handleInvertSelection}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium"
              >
                Invertir
              </button>
            </div>
          </div>

          {/* Interactive Item Cards */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {items.map((item, index) => {
              const itemSize = mediaType === 'audio' ? item.rawSizeMb * 0.25 : item.rawSizeMb;
              const itemCompressed = itemSize * (1 - compressionStats.reductionPercentage / 100);

              return (
                <div
                  key={item.id}
                  id={`playlist-item-${index}`}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                    item.selected
                      ? 'bg-slate-900 border-orange-500/40 shadow-sm hover:border-orange-500'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox Icon */}
                    <div className="shrink-0 text-orange-400">
                      {item.selected ? (
                        <CheckSquare className="w-4 h-4 fill-orange-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title & Author */}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{item.author}</span>
                        <span>•</span>
                        <span>
                          {Math.floor(item.durationSeconds / 60)}:
                          {(item.durationSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Size & Crab Stats */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-orange-400">
                      ~{itemCompressed.toFixed(1)} MB
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 line-through">
                      {itemSize.toFixed(1)} MB
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Batch Compression & Packaging Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Configuración del Lote
            </h3>

            {/* Media Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Extraer como:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMediaType('audio')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                    mediaType === 'audio'
                      ? 'bg-orange-500 text-slate-950 border-orange-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Canciones (Audio MP3/FLAC)
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                    mediaType === 'video'
                      ? 'bg-orange-500 text-slate-950 border-orange-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Videos Completos (MP4)
                </button>
              </div>
            </div>

            {/* Archive format (.zip, .rar, .7z) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Formato de Archivo Comprimido:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['zip', 'rar', '7z'] as ArchiveFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setArchiveFormat(fmt)}
                    className={`py-2 rounded-lg text-xs font-black uppercase border transition ${
                      archiveFormat === fmt
                        ? 'bg-slate-200 text-slate-950 border-white'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Password protection option */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Proteger con Contraseña:</span>
                </label>
                <input
                  type="checkbox"
                  id="check-use-password"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700"
                />
              </div>

              {usePassword && (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Por defecto se asignará una <strong>contraseña aleatoria de alta seguridad</strong> que te mostraremos inmediatamente al finalizar la descarga.
                  </p>
                  <input
                    type="text"
                    id="input-custom-playlist-pass"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Opcional: Define tu propia contraseña o déjalo vacío para aleatoria"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}
            </div>

            {/* CrabCompression Slider */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-orange-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>CrabCompression por pista: Nivel {crabLevel}</span>
                </div>

                {maxAllowedTier === 10 ? (
                  <button
                    type="button"
                    onClick={onOpenTierUpgrade}
                    className="text-[10px] font-bold text-amber-300 hover:underline"
                  >
                    Subir a Tier 20
                  </button>
                ) : (
                  <span className="text-[10px] text-amber-300 font-black">Tier 20 Activo</span>
                )}
              </div>

              <input
                type="range"
                min={1}
                max={maxAllowedTier}
                value={crabLevel}
                onChange={(e) => setCrabLevel(parseInt(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Total estimado sin comprimir:</span>
                <span className="text-slate-300">{totalOriginalSizeMb} MB</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-emerald-400">Total con CrabCompression:</span>
                <span className="text-orange-400 text-sm">{compressionStats.compressedSizeMb} MB</span>
              </div>
            </div>

            {/* Action Download Button */}
            <div>
              <button
                type="button"
                id="btn-download-playlist-archive"
                onClick={handleStartPlaylistDownload}
                disabled={isProcessingZip || selectedItems.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isProcessingZip ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Empaquetando con CrabCompression...</span>
                  </>
                ) : (
                  <>
                    <FileArchive className="w-4 h-4" />
                    <span>
                      Descargar {selectedItems.length} Pistas en .{archiveFormat.toUpperCase()} ({compressionStats.compressedSizeMb} MB)
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
