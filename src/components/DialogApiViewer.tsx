import React, { useState } from 'react';
import { WhitelistItem } from '../types';
import { Terminal, Send, Search, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface DialogApiViewerProps {
  whitelist: WhitelistItem[];
}

export const DialogApiViewer: React.FC<DialogApiViewerProps> = ({ whitelist }) => {
  const [activeDialogType, setActiveDialogType] = useState<'pick' | 'buy'>('buy');
  const [dialogSearch, setDialogSearch] = useState<string>('');
  const [dialogAmount, setDialogAmount] = useState<string>('1');
  const [dialogStatusMessage, setDialogStatusMessage] = useState<string>('Dialog session active. Ready for packet interaction.');

  const sampleItem = whitelist.find(i => i.id === 'totem of undying') || whitelist[0];
  const itemPrice = sampleItem.price;
  const parsedAmount = parseInt(dialogAmount, 10) || 1;
  const totalCost = itemPrice * parsedAmount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/30 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                MINECRAFT DIALOG API
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bug-Free & Exploit-Hardened
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2 font-['JetBrains_Mono',monospace]">
              Paper 26.x Native Multi-Action Dialog Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Unlike SkBee dialogs that caused server lag by looping variables on the main thread and allowing client-spoofed command templates, ArcEdgeShopSystem utilizes packet-isolated Dialog sessions with server-authoritative state checks and atomic callbacks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="dialog-view-buy-btn"
              onClick={() => setActiveDialogType('buy')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDialogType === 'buy'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. Purchase Dialog Form
            </button>
            <button
              id="dialog-view-pick-btn"
              onClick={() => setActiveDialogType('pick')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDialogType === 'pick'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2. Item Picker Grid Dialog
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side: Simulated Minecraft Client Dialog Screen vs Server Packet Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Minecraft In-Game Dialog Frame (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0e121a] border-2 border-slate-700 p-6 shadow-2xl relative overflow-hidden">
          {/* Minecraft Dialog Frame Simulation */}
          <div className="bg-[#181c25] rounded-xl border border-slate-600 shadow-inner p-5 space-y-4">
            {/* Dialog Title Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold text-sm font-['JetBrains_Mono',monospace]">
                  {activeDialogType === 'buy' ? `§6Purchase: ${sampleItem.name}` : '§6Choose Shop Item (32 Slots)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Esc to Cancel
              </span>
            </div>

            {/* Dialog Content Area */}
            {activeDialogType === 'buy' ? (
              <div className="space-y-4">
                {/* Item Body Section with preview */}
                <div className="p-4 rounded-lg bg-[#11141c] border border-slate-700/60 flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-3xl shadow-md">
                    {sampleItem.iconEmoji || '🛡️'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">{sampleItem.name}</h4>
                    <p className="text-xs text-slate-400">
                      Unit Price: <span className="text-emerald-400 font-mono font-semibold">${itemPrice.toLocaleString()}</span> each
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">Material: {sampleItem.material}</p>
                  </div>
                </div>

                {/* Text Input Element */}
                <div className="p-3 rounded-lg bg-[#12151e] border border-slate-700/80 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 font-mono block">
                    Input: $(amount) [Max: 2304 items]
                  </label>
                  <div className="relative">
                    <input
                      id="dialog-amount-input"
                      type="number"
                      min="1"
                      max="2304"
                      value={dialogAmount}
                      onChange={(e) => setDialogAmount(e.target.value)}
                      className="w-full bg-[#0a0d13] border border-slate-600 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Calculated total: <strong className="text-amber-400">${totalCost.toLocaleString()}</strong>
                  </span>
                </div>

                {/* Multi-Action Dynamic Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    id="dialog-btn-buy1"
                    onClick={() => {
                      setDialogStatusMessage(`[Packet OK] Executed atomic purchase for 1x ${sampleItem.name} ($${itemPrice.toLocaleString()}).`);
                    }}
                    className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all text-center"
                  >
                    Buy 1x (${itemPrice.toLocaleString()})
                  </button>

                  <button
                    id="dialog-btn-buystack"
                    onClick={() => {
                      setDialogStatusMessage(`[Packet OK] Executed atomic purchase for 64x ${sampleItem.name} ($${(itemPrice * 64).toLocaleString()}).`);
                    }}
                    className="py-2.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all text-center"
                  >
                    Buy Stack 64x (${(itemPrice * 64).toLocaleString()})
                  </button>

                  <button
                    id="dialog-btn-buycustom"
                    onClick={() => {
                      setDialogStatusMessage(`[Packet OK] Executed custom purchase for ${parsedAmount}x ${sampleItem.name} ($${totalCost.toLocaleString()}).`);
                    }}
                    className="py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all text-center col-span-2"
                  >
                    Confirm Custom Amount: {parsedAmount}x (${totalCost.toLocaleString()})
                  </button>
                </div>
              </div>
            ) : (
              /* Item Picker Dialog Grid */
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="dialog-search-filter"
                    type="text"
                    placeholder="Search whitelist (e.g. netherite, crafter)..."
                    value={dialogSearch}
                    onChange={(e) => setDialogSearch(e.target.value)}
                    className="w-full bg-[#0a0d13] border border-slate-600 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {whitelist
                    .filter(i => i.name.toLowerCase().includes(dialogSearch.toLowerCase()))
                    .slice(0, 10)
                    .map((item) => (
                      <button
                        key={item.material}
                        onClick={() => {
                          setDialogStatusMessage(`[Packet OK] Slot assigned to ${item.name} (${item.material}).`);
                        }}
                        className="p-2.5 rounded-lg bg-[#11141c] hover:bg-slate-800 border border-slate-700 text-left text-xs transition-colors flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{item.name}</span>
                          <span className="text-[10px] text-amber-400 font-mono">${item.price.toLocaleString()}</span>
                        </div>
                        <span className="text-lg ml-2">{item.iconEmoji || '📦'}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Dialog Callback Feedback Footer */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-400 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{dialogStatusMessage}</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Spec & Bug-Free Guarantee (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Why SkBee Dialogs Had Bugs vs ArcEdge Fix
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                <span className="text-rose-400 font-bold block mb-1">❌ SkBee Skript Flaw:</span>
                In the Skript, <code className="text-rose-300 font-mono">add dynamic run command action button: /shopbuy $(amount)</code> allowed players to edit the incoming packet or inject un-sanitized values, crashing servers or bypassing quantity limits.
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <span className="text-emerald-400 font-bold block mb-1">✅ ArcEdge Safe Implementation:</span>
                All dialog actions are backed by internal cryptographic callback IDs (<code className="text-emerald-300 font-mono">UUID session tokens</code>). Client arguments are strictly validated against integer bounds, preventing packet spoofing.
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Auto Fallback to Chest GUI
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If a player connects with a client version or bedrock bridge (Geyser/Floodgate) that does not render native Dialog API forms, <code className="text-cyan-300 font-mono">DialogService.java</code> automatically falls back to the responsive 54-slot Chest Inventory GUI without throwing errors or disconnecting players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
