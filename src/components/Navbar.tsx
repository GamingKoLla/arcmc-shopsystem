import React, { useState } from 'react';
import { Download, ShieldCheck, Layers, Terminal, Database, Sliders, FileCode, CheckCircle2, Package } from 'lucide-react';
import { generatePluginZip, generatePluginJar, downloadBlob } from '../utils/zipExporter';
import { WhitelistItem } from '../types';

interface NavbarProps {
  activeTab: 'simulator' | 'dialog' | 'code' | 'prices' | 'security' | 'luckperms';
  setActiveTab: (tab: 'simulator' | 'dialog' | 'code' | 'prices' | 'security' | 'luckperms') => void;
  whitelist: WhitelistItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, whitelist }) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingJar, setDownloadingJar] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<'jar' | 'zip' | null>(null);

  const handleDownloadJar = async () => {
    try {
      setDownloadingJar(true);
      const blob = await generatePluginJar(whitelist);
      downloadBlob(blob, 'ArcEdgeShopSystem-2.6.0.jar');
      setDownloadSuccess('jar');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to generate jar:', err);
    } finally {
      setDownloadingJar(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const blob = await generatePluginZip(whitelist);
      downloadBlob(blob, 'ArcEdgeShopSystem-v2.6.0-src.zip');
      setDownloadSuccess('zip');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0c0f14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg border border-cyan-400/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-['JetBrains_Mono',monospace]">
                  arcedgeshopsystem
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Paper 26.x Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">32 Slots • LuckPerms Scaling • Dialog API • Exploit-Proof</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              id="nav-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>32-Slot Shop Simulator</span>
            </button>

            <button
              id="nav-tab-dialog"
              onClick={() => setActiveTab('dialog')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'dialog'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Dialog API Viewer</span>
            </button>

            <button
              id="nav-tab-prices"
              onClick={() => setActiveTab('prices')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'prices'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fixed Prices ({whitelist.length})</span>
            </button>

            <button
              id="nav-tab-luckperms"
              onClick={() => setActiveTab('luckperms')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'luckperms'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LuckPerms Matrix</span>
            </button>

            <button
              id="nav-tab-security"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'security'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Anti-Exploit Audit</span>
            </button>

            <button
              id="nav-tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'code'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Plugin Source</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Primary JAR Download */}
            <button
              id="download-plugin-jar-btn"
              onClick={handleDownloadJar}
              disabled={downloadingJar}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all border border-emerald-300/40 active:scale-95 disabled:opacity-50"
              title="Directly download compiled ArcEdgeShopSystem-2.6.0.jar plugin file for your plugins/ folder"
            >
              {downloadSuccess === 'jar' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>JAR Downloaded!</span>
                </>
              ) : (
                <>
                  <Package className={`w-4 h-4 ${downloadingJar ? 'animate-bounce' : ''}`} />
                  <span>{downloadingJar ? 'Generating JAR...' : 'Download .JAR File'}</span>
                </>
              )}
            </button>

            {/* Source Zip Download */}
            <button
              id="download-plugin-zip-btn"
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 active:scale-95 disabled:opacity-50"
              title="Download full project source code archive with Maven pom.xml"
            >
              {downloadSuccess === 'zip' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Zip Saved</span>
                </>
              ) : (
                <>
                  <Download className={`w-3.5 h-3.5 ${downloadingZip ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">{downloadingZip ? 'Packing...' : 'Source (.zip)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
