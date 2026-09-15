import React, { useState } from 'react';
import { 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  ExternalLink, 
  Cpu, 
  Flame, 
  Sparkles,
  Layers,
  Code,
  FileArchive
} from 'lucide-react';
import { getPythonScriptContent } from '../utils/pythonScriptGenerator';

interface PythonProgramTabProps {
  onOpenExportZip?: () => void;
}

export const PythonProgramTab: React.FC<PythonProgramTabProps> = ({ onOpenExportZip }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCliCommand, setCopiedCliCommand] = useState(false);
  
  // Interactive CLI command generator states
  const [cliUrl, setCliUrl] = useState('https://www.youtube.com/watch?v=4xDzrJKXOOY');
  const [cliMode, setCliMode] = useState<'video' | 'audio'>('video');
  const [cliRes, setCliRes] = useState('720p');
  const [cliCrabLevel, setCliCrabLevel] = useState(10);
  const [cliIsPlaylist, setCliIsPlaylist] = useState(false);
  const [cliArchiveFormat, setCliArchiveFormat] = useState('zip');
  const [cliUsePassword, setCliUsePassword] = useState(true);

  const pythonScript = getPythonScriptContent();

  const handleDownloadPyFile = () => {
    const blob = new Blob([pythonScript], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'turbocrab.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Build the live CLI command
  const generatedCommand = `python turbocrab.py --url "${cliUrl}"${cliMode === 'audio' ? ' --audio-only' : ` --resolution ${cliRes}`} --crab-level ${cliCrabLevel}${cliIsPlaylist ? ` --playlist --archive ${cliArchiveFormat}${cliUsePassword ? ' --random-password' : ''}` : ''}`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopiedCliCommand(true);
    setTimeout(() => setCopiedCliCommand(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero for the Python Program */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Code className="w-3.5 h-3.5" />
              <span>Cliente Oficial en Python 3</span>
              <span className="text-slate-500">•</span>
              <span>Omega Labs Inc</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              Programa de Python: turbocrab.py
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Descarga videos, pistas y playlists completas directamente desde tu terminal con el motor matemático <strong>CrabCompression</strong>. 100% libre, sin ánimo de lucro y con soporte para <code>yt-dlp</code>, <code>FFmpeg</code> y cifrado de paquetes ZIP.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <button
              type="button"
              id="btn-download-python-script"
              onClick={handleDownloadPyFile}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar turbocrab.py</span>
            </button>

            {onOpenExportZip && (
              <button
                type="button"
                id="btn-export-full-zip-python"
                onClick={onOpenExportZip}
                className="px-4 py-3 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 border border-orange-500/40 text-orange-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                title="Descargar código fuente completo del proyecto"
              >
                <FileArchive className="w-4 h-4 text-orange-400" />
                <span>Exportar Todo (.ZIP)</span>
              </button>
            )}

            <button
              type="button"
              id="btn-copy-python-code"
              onClick={handleCopyScript}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Setup Guide & Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive CLI Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Generador de Comando de Terminal
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL a Descargar:
              </label>
              <input
                type="text"
                value={cliUrl}
                onChange={(e) => setCliUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Modo:
                </label>
                <select
                  value={cliMode}
                  onChange={(e) => setCliMode(e.target.value as 'video' | 'audio')}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="video">Video (MP4)</option>
                  <option value="audio">Audio (MP3/Opus)</option>
                </select>
              </div>

              {cliMode === 'video' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Resolución:
                  </label>
                  <select
                    value={cliRes}
                    onChange={(e) => setCliRes(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="2160p">4K (2160p)</option>
                    <option value="1080p">1080p</option>
                    <option value="720p">720p (Ideal Crab)</option>
                    <option value="480p">480p</option>
                  </select>
                </div>
              )}
            </div>

            {/* Crab Level */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>CrabCompression: Nivel {cliCrabLevel}</span>
                <span className="text-orange-400 font-bold">
                  {cliCrabLevel === 10 ? '50MB ➔ 4/9MB' : `Nivel ${cliCrabLevel}`}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={cliCrabLevel}
                onChange={(e) => setCliCrabLevel(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Playlist options */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-300">Descarga en lote (Playlist):</span>
                <input
                  type="checkbox"
                  checked={cliIsPlaylist}
                  onChange={(e) => setCliIsPlaylist(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
              </label>

              {cliIsPlaylist && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Contraseña aleatoria:</span>
                  <input
                    type="checkbox"
                    checked={cliUsePassword}
                    onChange={(e) => setCliUsePassword(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                  />
                </div>
              )}
            </div>

            {/* Generated Command Display */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Comando Listo para Pegar en Consola:
              </label>
              <div className="p-3 bg-black border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                <code className="text-xs text-amber-300 font-mono break-all">
                  {generatedCommand}
                </code>
                <button
                  type="button"
                  id="btn-copy-cli-command"
                  onClick={handleCopyCommand}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition"
                  title="Copiar comando"
                >
                  {copiedCliCommand ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-orange-400" />
              Instalación y Requisitos Previos
            </h4>

            <div className="space-y-2 text-slate-300">
              <p>1. Instala las dependencias en tu terminal:</p>
              <div className="p-2.5 bg-black rounded-lg font-mono text-emerald-400 border border-slate-800">
                pip install yt-dlp pyzipper rich
              </div>

              <p>2. Asegúrate de tener FFmpeg instalado en tu sistema:</p>
              <div className="p-2.5 bg-black rounded-lg font-mono text-slate-300 border border-slate-800 text-[11px]">
                <span className="text-slate-500"># Ubuntu/Debian:</span> sudo apt install ffmpeg<br />
                <span className="text-slate-500"># macOS:</span> brew install ffmpeg<br />
                <span className="text-slate-500"># Windows:</span> winget install Gyan.FFmpeg
              </div>

              <p>3. Ejecuta el modo interactivo con menú gráfico:</p>
              <div className="p-2.5 bg-black rounded-lg font-mono text-amber-400 border border-slate-800">
                python turbocrab.py
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-t-xl border border-slate-800 border-b-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                turbocrab.py (Código Fuente Completo)
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyScript}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          <div className="bg-black/90 border border-slate-800 rounded-b-xl p-4 font-mono text-xs text-slate-300 max-h-[640px] overflow-y-auto leading-relaxed shadow-inner">
            <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap selection:bg-orange-500 selection:text-black">
              {pythonScript}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
