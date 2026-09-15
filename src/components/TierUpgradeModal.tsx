import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Flame, Cpu, X, AlertTriangle } from 'lucide-react';
import { UserSession } from '../types';

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  onUpgradeSuccess: () => void;
}

export const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradeSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [selectedCrabIcon, setSelectedCrabIcon] = useState<number | null>(null);
  const [pinVerification, setPinVerification] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStep1 = () => {
    if (pinVerification.trim() !== user.securityPin) {
      setError(`Código de seguridad incorrecto. Pista: tu PIN actual es ${user.securityPin}`);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = () => {
    // Mathematical challenge: "Si 50MB a CRF 32 se reduce un 85%, ¿cuántos MB quedan aprox? (7 o 8)"
    if (captchaAnswer.trim() !== '7' && captchaAnswer.trim() !== '8' && captchaAnswer.trim() !== '7.5') {
      setError('Respuesta matemática incorrecta. Pista: 50 * (1 - 0.85) = 7.5 MB. Escribe 7 u 8');
      return;
    }
    if (selectedCrabIcon !== 2) {
      setError('Selecciona el ícono del Cangrejo de Omega Labs (el central)');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalUnlock = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="tier-upgrade-card"
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden text-slate-100"
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-black/40 rounded-xl backdrop-blur-xs border border-white/20">
                <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight font-['Outfit']">
                    Mejora a Tier 20 Ultra
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/40 text-amber-200 border border-amber-300/40">
                    Nivel Máximo
                  </span>
                </div>
                <p className="text-xs text-orange-100/90">
                  Desbloquea el algoritmo CrabCompression Nivel 11 al 20
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-amber-300' : 'bg-white/30'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-amber-300' : 'bg-white/30'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-amber-300' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Paso 1: Verificación de Identidad y Código de Seguridad
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Para habilitar la compresión ultra pesada nivel 20 (SVT-AV1 multipass), confirmamos que eres el propietario de la cuenta <strong>{user.email}</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ingresa tu Código de Seguridad (PIN Maestro de 4 a 6 dígitos):
                </label>
                <input
                  type="text"
                  id="upgrade-pin-input"
                  value={pinVerification}
                  onChange={(e) => setPinVerification(e.target.value)}
                  placeholder={`Ej: ${user.securityPin}`}
                  className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-lg text-sm text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tu PIN de sesión registrado es: <span className="font-mono text-slate-400">{user.securityPin}</span>
                </p>
              </div>

              <button
                type="button"
                id="upgrade-step1-btn"
                onClick={handleStep1}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                Continuar al Desafío CrabCaptcha
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  Paso 2: CrabCaptcha & Test Matemático Anti-Bot
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Las matemáticas de compresión Nivel 20 son exigentes. Completa este breve reto para prevenir sobrecarga de servidores:
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Selecciona el Cangrejo Auténtico de Omega Labs:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 1, label: '🦐 Camarón', icon: '🦐' },
                    { id: 2, label: '🦀 TurboCrab Real', icon: '🦀' },
                    { id: 3, label: '🦞 Langosta', icon: '🦞' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCrabIcon(item.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${
                        selectedCrabIcon === item.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[11px] font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Pregunta Matemática: Si un video de 50 MB se comprime un 85%, ¿cuántos MB pesará aprox? (Escribe el número, ej: 7 u 8):
                </label>
                <input
                  type="text"
                  id="upgrade-captcha-math"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Escribe 7 u 8"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  id="upgrade-step2-btn"
                  onClick={handleStep2}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  Validar Captcha & Proceder
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/20">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">¡Verificación Exitosa!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tu cuenta ha cumplido con los protocolos de Omega Labs Inc. Ahora puedes activar la compresión matemática hasta el <strong>Nivel 20 Ultra</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>SVT-AV1 Perceptual Entropy Matrix Habilitado</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Reducción de hasta 95% (50MB -&gt; 2.5MB aprox)</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Insignia de Usuario Verificado Tier 20</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-confirm-tier20-unlock"
                onClick={handleFinalUnlock}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Aplicando Credenciales Tier 20...' : '🚀 ¡ACTIVAR NIVEL 20 AHORA!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
