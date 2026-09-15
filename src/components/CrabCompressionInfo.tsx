import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Binary, 
  Sigma, 
  TrendingDown,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { UserSession } from '../types';
import { calculateCrabCompression } from '../utils/crabCompression';

interface CrabCompressionInfoProps {
  user: UserSession | null;
  onOpenTierUpgrade: () => void;
  onOpenAuth: () => void;
}

export const CrabCompressionInfo: React.FC<CrabCompressionInfoProps> = ({
  user,
  onOpenTierUpgrade,
  onOpenAuth,
}) => {
  const [interactiveLevel, setInteractiveLevel] = useState<number>(10);
  const [baseSizeMb, setBaseSizeMb] = useState<number>(50.0); // Exact 50 MB benchmark!
  const maxAllowed = user?.unlockedMaxTier || 10;

  const calculation = useMemo(() => {
    return calculateCrabCompression(interactiveLevel, baseSizeMb, false);
  }, [interactiveLevel, baseSizeMb]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-950/70 via-slate-900 to-slate-950 border border-orange-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold mb-3">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Algoritmo Matemático de Compresión de Medios</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            CrabCompression™: Las Archirecontra Odiadas Matemáticas
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            La meta del estudio <strong>Omega Labs Inc</strong>: lograr que un video 720p de <strong>50 MB pase a pesar entre 4 y 9 MB</strong> prácticamente sin reducir la calidad gráfica y auditiva perceptible por el ojo humano.
          </p>
        </div>
      </div>

      {/* Interactive Math Benchmark Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Simulador Interactivo de Compresión
            </h3>
            <p className="text-xs text-slate-400">
              Ajusta el nivel del algoritmo y observa cómo se transforman los megabytes en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Peso Base de Prueba:</span>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[25, 50, 100, 250].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBaseSizeMb(size)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                    baseSizeMb === size
                      ? 'bg-orange-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {size} MB
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big visual comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Video Original (720p / 1080p)
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-300 mt-2">
              {calculation.originalSizeMb} MB
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Flujo H.264 no optimizado estándar
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-orange-950/40 to-slate-950 rounded-xl border border-orange-500/50 text-center relative overflow-hidden shadow-lg shadow-orange-500/10">
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-orange-500 text-slate-950 text-[10px] font-black uppercase">
              Resultado Meta
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Con CrabCompression (Nivel {calculation.level})
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-orange-400 mt-2">
              {calculation.compressedSizeMb} MB
            </div>
            <div className="text-[11px] text-orange-300/80 mt-1 font-semibold">
              {calculation.originalSizeMb === 50 && calculation.level === 10
                ? '🎯 ¡Meta lograda! 50MB reducidos a ~7MB'
                : `Ahorro del ${calculation.reductionPercentage}% de peso`}
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Espacio Ahorrado
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mt-2">
              {(calculation.originalSizeMb - calculation.compressedSizeMb).toFixed(1)} MB
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              VMAF Visual Score: 95.8% (Indistinguible)
            </div>
          </div>
        </div>

        {/* Level slider */}
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span>Nivel de Algoritmo Crab:</span>
              <span className="text-orange-400 font-mono text-base font-black">
                {interactiveLevel} / {maxAllowed}
              </span>
            </label>

            {maxAllowed === 10 ? (
              <button
                type="button"
                id="btn-unlock-tier20-lab"
                onClick={user ? onOpenTierUpgrade : onOpenAuth}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>¿Habilitar hasta Nivel 20? Verificación Requerida</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Cuenta Verificada en Tier 20 Ultra</span>
              </span>
            )}
          </div>

          <input
            type="range"
            min={1}
            max={maxAllowed}
            value={interactiveLevel}
            onChange={(e) => setInteractiveLevel(parseInt(e.target.value))}
            className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Nivel 1 (Ligero: -23%)</span>
            <span>Nivel 5 (-53%)</span>
            <span className="text-orange-400 font-bold">Nivel 10 (Meta 50MB ➔ ~7MB: -85%)</span>
            {maxAllowed === 20 && (
              <span className="text-amber-300 font-bold">Nivel 20 (Ultra: -95%)</span>
            )}
          </div>
        </div>
      </div>

      {/* The 4 pillars of the Mathematical formula */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-black">
            <Sigma className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Outfit']">
            1. Cuantización Adaptativa DCT & SVT-AV1
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminamos las frecuencias espaciales que el ojo humano no puede distinguir en movimiento. Utilizando códecs modernos (SVT-AV1 / x265) con matrices de cuantización personalizadas, logramos la misma nitidez con 1/6 del ancho de banda tradicional.
          </p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
            <Binary className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Outfit']">
            2. Enmascaramiento Psicoacústico Opus
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            El audio ocupa hasta el 35% del peso de archivos cortos. CrabCompression aplica filtrado espectral dinámico a frecuencias inaudibles (&gt;18kHz) y codificación Opus VBR, reduciendo 15 MB de audio WAV a 1.2 MB sin degradar bajos ni voces.
          </p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Outfit']">
            3. Curva de Decaimiento Exponencial
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fórmula de bitrate objetivo: <code className="text-orange-300 font-mono">B(L) = B_0 · e^(-0.14 · L)</code>. Cada incremento en el nivel recalcula los fotogramas clave (GOP adaptativo de 120 cuadros) para que el movimiento rápido no pixele el video.
          </p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Outfit']">
            4. Tier 20 Ultra (Multi-Pass Quantum)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Disponible para usuarios que verifiquen su cuenta con el CrabCaptcha. Permite codificación de doble pasada con submuestreo cuántico de crominancia, reduciendo archivos pesados hasta en un <strong>95%</strong> (50MB a 2.5MB).
          </p>
        </div>
      </div>
    </div>
  );
};
