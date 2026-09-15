/**
 * TurboCrab Downloader - Omega Labs Inc
 * High-performance video, audio and playlist downloader with CrabCompression
 */
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SingleDownloader } from './components/SingleDownloader';
import { PlaylistDownloader } from './components/PlaylistDownloader';
import { CrabCompressionInfo } from './components/CrabCompressionInfo';
import { PythonProgramTab } from './components/PythonProgramTab';
import { AuthModal } from './components/AuthModal';
import { TierUpgradeModal } from './components/TierUpgradeModal';
import { DownloadQueueDrawer } from './components/DownloadQueueDrawer';
import { ExportZipModal } from './components/ExportZipModal';
import { UserSession, ActiveDownloadTask } from './types';
import { Heart, Shield, Terminal, Flame, Info, CheckCircle2, FileArchive } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'single' | 'playlist' | 'crab-lab' | 'python'>('single');

  // User state
  const [user, setUser] = useState<UserSession | null>(() => {
    // Default demo session logged in so user can explore right away, or they can re-login
    return {
      email: 'usuario.turbocrab@gmail.com',
      name: 'Piloto Crab',
      authMethod: 'google',
      securityPin: '749201',
      isLoggedIn: true,
      isVerifiedTier20: false,
      unlockedMaxTier: 10,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      downloadsCount: 4,
      totalSavedMegabytes: 184.2,
    };
  });

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTierUpgradeOpen, setIsTierUpgradeOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active tasks
  const [tasks, setTasks] = useState<ActiveDownloadTask[]>([]);

  // Simulation tick for tasks in queue
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        let changed = false;
        const updated = prevTasks.map((task) => {
          if (task.status === 'queued') {
            changed = true;
            return { ...task, status: 'downloading' as const, progress: 15 };
          }
          if (task.status === 'downloading') {
            if (task.progress < 70) {
              changed = true;
              return { ...task, progress: Math.min(70, task.progress + 15) };
            } else {
              changed = true;
              return { ...task, status: 'compressing' as const, progress: 75 };
            }
          }
          if (task.status === 'compressing') {
            if (task.progress < 100) {
              changed = true;
              return { ...task, progress: Math.min(100, task.progress + 12) };
            } else {
              changed = true;
              // Generate sample media blob if not already generated
              let blobUrl = task.downloadBlobUrl;
              if (!blobUrl) {
                const sampleText = `[TurboCrab Downloader - Omega Labs Inc]\nMedia: ${task.title}\nFormat: ${task.format}\nCrabCompression: Nivel ${task.crabLevel}\nOriginal Size: ${task.originalSizeMb} MB\nOptimized Size: ${task.compressedSizeMb} MB\nSaved: ${((task.originalSizeMb - task.compressedSizeMb) / task.originalSizeMb * 100).toFixed(1)}%\nPassword: ${task.archivePassword || 'None'}\nDownloaded: ${new Date().toISOString()}`;
                const blob = new Blob([sampleText], { type: 'application/octet-stream' });
                blobUrl = URL.createObjectURL(blob);
              }
              return { ...task, status: 'completed' as const, progress: 100, downloadBlobUrl: blobUrl };
            }
          }
          return task;
        });

        return changed ? updated : prevTasks;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleStartDownload = (task: ActiveDownloadTask) => {
    setTasks((prev) => [task, ...prev]);
    setIsQueueOpen(true);
    if (user) {
      setUser((u) => u ? {
        ...u,
        downloadsCount: u.downloadsCount + 1,
        totalSavedMegabytes: Number((u.totalSavedMegabytes + (task.originalSizeMb - task.compressedSizeMb)).toFixed(1))
      } : null);
    }
  };

  const handleUpgradeSuccess = () => {
    if (user) {
      setUser({
        ...user,
        isVerifiedTier20: true,
        unlockedMaxTier: 20,
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-orange-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenTierUpgrade={() => setIsTierUpgradeOpen(true)}
        activeTasksCount={tasks.filter((t) => t.status !== 'completed').length}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenExportZip={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'single' && (
          <SingleDownloader
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenTierUpgrade={() => setIsTierUpgradeOpen(true)}
            onStartDownload={handleStartDownload}
          />
        )}

        {activeTab === 'playlist' && (
          <PlaylistDownloader
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenTierUpgrade={() => setIsTierUpgradeOpen(true)}
            onStartDownload={handleStartDownload}
          />
        )}

        {activeTab === 'crab-lab' && (
          <CrabCompressionInfo
            user={user}
            onOpenTierUpgrade={() => setIsTierUpgradeOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'python' && (
          <PythonProgramTab onOpenExportZip={() => setIsExportModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦀</span>
            <div>
              <div className="text-white font-bold text-sm">TurboCrab Downloader</div>
              <div className="text-slate-500">
                Creado por <strong>Omega Labs Inc</strong> • Proyecto Sin Ánimo de Lucro
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 transition"
            >
              <FileArchive className="w-3.5 h-3.5" /> Exportar Código en .ZIP
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" /> 100% Gratuito & Open Source
            </span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('python')}
              className="hover:text-white transition flex items-center gap-1 text-amber-300"
            >
              <Terminal className="w-3.5 h-3.5" /> Cliente turbocrab.py
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('crab-lab')}
              className="hover:text-white transition flex items-center gap-1 text-orange-400"
            >
              <Flame className="w-3.5 h-3.5" /> Algoritmo CrabCompression
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(session) => setUser(session)}
      />

      {user && (
        <TierUpgradeModal
          isOpen={isTierUpgradeOpen}
          onClose={() => setIsTierUpgradeOpen(false)}
          user={user}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

      <DownloadQueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        tasks={tasks}
        onClearCompleted={() => setTasks((prev) => prev.filter((t) => t.status !== 'completed'))}
      />

      <ExportZipModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
