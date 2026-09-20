import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveShopSimulator } from './components/InteractiveShopSimulator';
import { DialogApiViewer } from './components/DialogApiViewer';
import { AdminPriceManager } from './components/AdminPriceManager';
import { LuckPermsConfigurator } from './components/LuckPermsConfigurator';
import { SecurityExploitAudit } from './components/SecurityExploitAudit';
import { CodeExplorer } from './components/CodeExplorer';
import { DEFAULT_WHITELIST } from './data/defaultWhitelist';
import { WhitelistItem } from './types';
import { ShieldCheck, Cpu, CheckCircle2, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'dialog' | 'prices' | 'luckperms' | 'security' | 'code'>('simulator');
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>(DEFAULT_WHITELIST);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} whitelist={whitelist} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Tab Selector for small screens */}
        <div className="flex md:hidden overflow-x-auto pb-2 mb-4 gap-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'simulator' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('dialog')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'dialog' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Dialog API
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'prices' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Fixed Prices ({whitelist.length})
          </button>
          <button
            onClick={() => setActiveTab('luckperms')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'luckperms' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            LuckPerms
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'security' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Security Audit
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'code' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Source Code
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'simulator' && <InteractiveShopSimulator whitelist={whitelist} />}
        {activeTab === 'dialog' && <DialogApiViewer whitelist={whitelist} />}
        {activeTab === 'prices' && <AdminPriceManager whitelist={whitelist} setWhitelist={setWhitelist} />}
        {activeTab === 'luckperms' && <LuckPermsConfigurator />}
        {activeTab === 'security' && <SecurityExploitAudit />}
        {activeTab === 'code' && <CodeExplorer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080a0f] py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-slate-300">arcedgeshopsystem</span>
            <span>•</span>
            <span>Paper 26.x Ready</span>
            <span>•</span>
            <span>Java 21</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Zero Exploits Verified
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>32 LuckPerms Slots (`shopslot.1` to `shopslot.32`)</span>
            <span>•</span>
            <span>Dual Dialog API & Chest GUI</span>
            <span>•</span>
            <span>Vault 1.7+ & LuckPerms 5.4+</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
