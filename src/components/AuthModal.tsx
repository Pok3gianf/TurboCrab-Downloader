import React, { useState } from 'react';
import { Shield, Key, Mail, User, CheckCircle2, Lock, Sparkles, X, Chrome } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  initialMode?: 'login' | 'upgrade';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setError('');
    // Simulated Google OAuth Flow
    setTimeout(() => {
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      const session: UserSession = {
        name: 'Usuario Google Crab',
        email: 'usuario.turbocrab@gmail.com',
        authMethod: 'google',
        securityPin: generatedPin,
        isLoggedIn: true,
        isVerifiedTier20: false,
        unlockedMaxTier: 10,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        downloadsCount: 3,
        totalSavedMegabytes: 142.5,
      };
      setIsSubmitting(false);
      onLoginSuccess(session);
      onClose();
    }, 800);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (!password || password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (!securityPin || securityPin.length < 4) {
      setError('Introduce un código de seguridad de 4 a 6 dígitos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const session: UserSession = {
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        authMethod: 'email',
        securityPin: securityPin.trim(),
        isLoggedIn: true,
        isVerifiedTier20: false,
        unlockedMaxTier: 10,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        downloadsCount: 0,
        totalSavedMegabytes: 0,
      };
      setIsSubmitting(false);
      onLoginSuccess(session);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 p-6 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-black/30 rounded-xl backdrop-blur-xs">
                <Shield className="w-6 h-6 text-orange-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                  Acceso TurboCrab
                </h2>
                <p className="text-xs text-orange-100/90">
                  Omega Labs Inc • Sin Ánimo de Lucro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="auth-close-btn"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-orange-100 mt-3 leading-relaxed">
            Inicia sesión para autorizar descargas masivas de playlists, retención de configuraciones avanzadas y el motor matemático <strong>CrabCompression</strong>.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
          <button
            type="button"
            id="tab-google-auth"
            onClick={() => setTab('google')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              tab === 'google'
                ? 'bg-slate-800 text-orange-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Chrome className="w-4 h-4" />
            Google OAuth
          </button>
          <button
            type="button"
            id="tab-email-auth"
            onClick={() => setTab('email')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              tab === 'email'
                ? 'bg-slate-800 text-orange-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            Correo + PIN Seguro
          </button>
        </div>

        {/* Body content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'google' ? (
            <div className="space-y-4 text-center py-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-orange-400 shadow-inner">
                <Key className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Autenticación Rápida con Google</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Conexión directa y cifrada. Se generará automáticamente un Código de Seguridad maestro para tus descargas en lote.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-left space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sin publicidad ni venta de datos</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Habilita descargas ilimitadas de Playlists</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Compatible con CrabCompression 1-10</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-confirm-google-oauth"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isSubmitting ? 'Verificando con Google...' : 'Continuar con Google'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre o Alias (Opcional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="input-auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Alex Crab"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="input-auth-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    id="input-auth-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    Código de Seguridad (PIN) <span className="text-orange-400">*</span>
                  </label>
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Requerido para descarga masiva
                  </span>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-orange-400" />
                  <input
                    type="text"
                    id="input-auth-pin"
                    required
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\\D/g, ''))}
                    placeholder="6 dígitos (ej: 849201)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-orange-500/50 rounded-lg text-xs text-orange-300 font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Este código sirve como llave de seguridad para autorizar empaquetados masivos y descargas encriptadas.
                </p>
              </div>

              <button
                type="submit"
                id="btn-submit-email-auth"
                disabled={isSubmitting}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión & Activar Descargas'}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500">
              Desarrollado con rigor por <strong>Omega Labs Inc</strong> • 100% Sin Fines de Lucro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
