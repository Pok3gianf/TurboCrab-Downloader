import React from 'react';
import { 
  Download, 
  ListMusic, 
  Flame, 
  Terminal, 
  ShieldCheck, 
  LogOut, 
  User, 
  Sparkles,
  Layers,
  Heart,
  FileArchive
} from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  activeTab: 'single' | 'playlist' | 'crab-lab' | 'python';
  setActiveTab: (tab: 'single' | 'playlist' | 'crab-lab' | 'python') => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTierUpgrade: () => void;
  activeTasksCount: number;
  onOpenQueue: () => void;
  onOpenExportZip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  onOpenTierUpgrade,
  activeTasksCount,
  onOpenQueue,
  onOpenExportZip,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand & Studio */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('single')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
                <span className="text-xl">🦀</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white font-['Outfit']">
                    TurboCrab
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Downloader
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Omega Labs Inc</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 fill-emerald-400" /> Sin Ánimo de Lucro
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              id="nav-tab-single"
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Descargador
            </button>

            <button
              id="nav-tab-playlist"
              onClick={() => setActiveTab('playlist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'playlist'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              Playlists (.zip/.7z)
            </button>

            <button
              id="nav-tab-crab-lab"
              onClick={() => setActiveTab('crab-lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'crab-lab'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              CrabCompression™
            </button>

            <button
              id="nav-tab-python"
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'python'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-300" />
              Programa Python
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Export Project ZIP button */}
            <button
              id="btn-open-export-zip"
              onClick={onOpenExportZip}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-orange-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Exportar Proyecto Completo en .ZIP"
            >
              <FileArchive className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Exportar .ZIP</span>
            </button>

            {/* Queue Button */}
            <button
              id="btn-open-queue"
              onClick={onOpenQueue}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Cola de Descargas"
              aria-label="Abrir cola de descargas"
            >
              <Layers className="w-4 h-4" />
              {activeTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {activeTasksCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.unlockedMaxTier === 10 ? (
                  <button
                    id="btn-upgrade-tier-top"
                    onClick={onOpenTierUpgrade}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subir a Tier 20</span>
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    TIER 20 ULTRA
                  </span>
                )}

                {/* User chip */}
                <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      PIN: {user.securityPin}
                    </div>
                  </div>
                  <button
                    id="btn-logout"
                    onClick={onLogout}
                    className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation subbar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('single')}
            className={`text-xs font-semibold py-1 px-2 rounded ${
              activeTab === 'single' ? 'text-orange-400 font-bold' : 'text-slate-400'
            }`}
          >
            Descargador
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`text-xs font-semibold py-1 px-2 rounded ${
              activeTab === 'playlist' ? 'text-orange-400 font-bold' : 'text-slate-400'
            }`}
          >
            Playlists (.zip)
          </button>
          <button
            onClick={() => setActiveTab('crab-lab')}
            className={`text-xs font-semibold py-1 px-2 rounded ${
              activeTab === 'crab-lab' ? 'text-orange-400 font-bold' : 'text-slate-400'
            }`}
          >
            CrabCompression
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`text-xs font-semibold py-1 px-2 rounded ${
              activeTab === 'python' ? 'text-amber-300 font-bold' : 'text-slate-400'
            }`}
          >
            Python CLI
          </button>
        </div>
      </div>
    </header>
  );
};
