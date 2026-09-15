import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileArchive, 
  CheckCircle2, 
  Terminal, 
  FolderTree, 
  ExternalLink, 
  Loader2, 
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { generateProjectZip } from '../utils/exportProjectZip';

interface ExportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportZipModal: React.FC<ExportZipModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      setProgress(10);
      setStatusText('Recopilando archivos de código fuente...');
      setDownloadSuccess(false);

      const blob = await generateProjectZip((percent, current) => {
        setProgress(percent);
        setStatusText(current);
      });

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'turbocrab-full-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setStatusText('¡Archivo turbocrab-full-project.zip descargado con éxito!');
    } catch (error) {
      console.error('Error generating project ZIP:', error);
      setStatusText('Ocurrió un error al compilar el ZIP. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        id="export-zip-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Exportar Proyecto Completo (.ZIP)
              </h3>
              <p className="text-xs text-slate-400">
                Código fuente completo de TurboCrab Downloader listo para modificar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Direct Download Action Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30 border border-orange-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  Paquete 1-Click
                </span>
                <h4 className="text-lg font-bold text-white">turbocrab-full-project.zip</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Incluye todo: React 19, Tailwind CSS v4, componentes, motor CrabCompression, script en Python y dependencias.
                </p>
              </div>

              <button
                type="button"
                id="btn-confirm-export-zip"
                disabled={isExporting}
                onClick={handleExportZip}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Empaquetando ({progress}%)...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>¡Descargado! Repetir</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descargar .ZIP Listo</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress status */}
            {(isExporting || downloadSuccess) && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                  {isExporting && <Loader2 className="w-3 h-3 animate-spin text-orange-400" />}
                  {downloadSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>{statusText}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick instructions how to run locally */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              Cómo ejecutar y modificar en tu máquina local
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-orange-400" />
                  Frontend Web (React + Vite)
                </div>
                <div className="p-2 bg-black rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800/80">
                  npm install<br />
                  npm run dev
                </div>
                <p className="text-[11px] text-slate-400">
                  Abre <span className="text-slate-200">http://localhost:3000</span> para editar cualquier componente con recarga en vivo.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Cliente de Terminal (Python)
                </div>
                <div className="p-2 bg-black rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800/80">
                  pip install yt-dlp pyzipper rich<br />
                  python turbocrab.py
                </div>
                <p className="text-[11px] text-slate-400">
                  Ejecuta el menú interactivo o el descargador por línea de comandos.
                </p>
              </div>
            </div>
          </div>

          {/* File Manifest Preview */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-orange-400" />
                Archivos incluidos en el ZIP
              </span>
              <span className="text-[11px] text-slate-500 font-mono">100% Modificable</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1">
              <div>📄 turbocrab.py</div>
              <div>📄 package.json</div>
              <div>📄 README.md</div>
              <div>📄 vite.config.ts</div>
              <div>📄 tsconfig.json</div>
              <div>📄 index.html</div>
              <div>📁 src/App.tsx</div>
              <div>📁 src/components/*</div>
              <div>📁 src/utils/*</div>
            </div>
          </div>

          {/* Notice about AI Studio native export */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Opción nativa de la plataforma: </span>
              También puedes exportar el proyecto completo en cualquier momento usando el menú superior de <strong>Google AI Studio Build</strong> haciendo clic en los tres puntos / ajustes y seleccionando <strong>Export to GitHub</strong> o <strong>Download ZIP</strong>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
