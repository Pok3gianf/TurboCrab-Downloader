import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Flame, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  FileArchive, 
  RefreshCw,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { ActiveDownloadTask } from '../types';

interface DownloadQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: ActiveDownloadTask[];
  onClearCompleted: () => void;
}

export const DownloadQueueDrawer: React.FC<DownloadQueueDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  onClearCompleted,
}) => {
  const [copiedPassId, setCopiedPassId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPass = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassId(id);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  const handleTriggerDownload = (task: ActiveDownloadTask) => {
    if (task.downloadBlobUrl) {
      const a = document.createElement('a');
      a.href = task.downloadBlobUrl;
      a.download = task.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a fallback sample file
      const dummyContent = `TurboCrab Downloader - Omega Labs Inc\nArchivo: ${task.title}\nFormato: ${task.format}\nCrabCompression Nivel: ${task.crabLevel}\nTamaño optimizado: ${task.compressedSizeMb} MB\nAhorro: ${((task.originalSizeMb - task.compressedSizeMb) / task.originalSizeMb * 100).toFixed(1)}%\nDescargado con éxito en ${new Date().toLocaleString()}`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = task.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        id="download-queue-panel"
        className="w-full max-w-md sm:max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Cola de Descargas TurboCrab
              </h3>
              <p className="text-xs text-slate-400">
                {tasks.length} tarea{tasks.length === 1 ? '' : 's'} en el registro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tasks.some((t) => t.status === 'completed') && (
              <button
                type="button"
                onClick={onClearCompleted}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition"
              >
                Limpiar completadas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-center text-slate-400">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-300">No hay descargas activas</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Pega un enlace de video, audio o playlist y presiona descargar con CrabCompression.
                </p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-orange-400 mb-0.5">
                      <span className="uppercase tracking-wider font-mono">
                        {task.platform}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 uppercase">.{task.format}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Flame className="w-3 h-3 text-orange-400" />
                        Crab L{task.crabLevel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate max-w-xs">
                      {task.title}
                    </h4>
                  </div>

                  <div className="shrink-0 text-right">
                    {task.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Listo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {Math.round(task.progress)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>
                      {task.status === 'completed'
                        ? `${task.compressedSizeMb} MB guardados`
                        : `${(task.compressedSizeMb * (task.progress / 100)).toFixed(1)} / ${task.compressedSizeMb} MB`}
                    </span>
                    <span>{task.speedMbPerSec.toFixed(1)} MB/s</span>
                  </div>
                </div>

                {/* Savings pill */}
                <div className="flex items-center justify-between text-[11px] bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Original: {task.originalSizeMb} MB</span>
                  <span className="text-emerald-400 font-bold">
                    Ahorro: -{((task.originalSizeMb - task.compressedSizeMb) / task.originalSizeMb * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Password if playlist */}
                {task.archivePassword && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Key className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono font-bold">{task.archivePassword}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyPass(task.id, task.archivePassword!)}
                      className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                    >
                      {copiedPassId === task.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedPassId === task.id ? 'Copiada' : 'Copiar Clave'}
                    </button>
                  </div>
                )}

                {/* Download button once completed */}
                {task.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleTriggerDownload(task)}
                    className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Guardar Archivo ({task.fileName})</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
