import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Terminal, Users, Sparkles } from 'lucide-react';

export const LuckPermsConfigurator: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('vip');
  const [copied, setCopied] = useState(false);

  // Group definitions
  const groups: { [key: string]: { name: string; slots: number; description: string; color: string } } = {
    default: {
      name: 'Default Player',
      slots: 5,
      description: 'Starter tier: unlocks shopslot.1 through shopslot.5',
      color: 'text-slate-300'
    },
    vip: {
      name: 'VIP Rank',
      slots: 12,
      description: 'Intermediate tier: unlocks shopslot.1 through shopslot.12',
      color: 'text-emerald-400'
    },
    mvp: {
      name: 'MVP Rank',
      slots: 22,
      description: 'Advanced tier: unlocks shopslot.1 through shopslot.22',
      color: 'text-cyan-400'
    },
    elite: {
      name: 'Elite / Sponsor',
      slots: 32,
      description: 'Max tier: unlocks all 32 shop slots (shopslot.1 - shopslot.32)',
      color: 'text-amber-400'
    }
  };

  const currentGroup = groups[selectedGroup];

  // Generate LP Commands
  const generateLpCommands = () => {
    const cmds: string[] = [];
    cmds.push(`# Setup LuckPerms group permissions for '${selectedGroup}':`);
    cmds.push(`/lp group ${selectedGroup} permission set arcedge.use true`);
    for (let i = 1; i <= currentGroup.slots; i++) {
      cmds.push(`/lp group ${selectedGroup} permission set shopslot.${i} true`);
    }
    return cmds.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLpCommands());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#10141e] border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['JetBrains_Mono',monospace]">
              LuckPerms Slot Progression Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Configure tiered shop capacity from 1 to 32 slots using standard LuckPerms commands.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Selector (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Select Server Rank
          </h3>
          <div className="space-y-2">
            {Object.entries(groups).map(([key, grp]) => (
              <button
                key={key}
                id={`lp-group-${key}`}
                onClick={() => setSelectedGroup(key)}
                className={`w-full p-4 rounded-xl text-left border transition-all ${
                  selectedGroup === key
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${grp.color}`}>{grp.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                    {grp.slots} / 32 Slots
                  </span>
                </div>
                <p className="text-xs text-slate-400">{grp.description}</p>
              </button>
            ))}
          </div>

          {/* Quick Wildcard Tip */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <span className="text-amber-400 font-bold block">💡 Wildcard Tip:</span>
            <p>
              To grant all 32 slots immediately to a staff role or admin:
            </p>
            <code className="text-cyan-300 font-mono block bg-slate-950 p-2 rounded border border-slate-800">
              /lp group admin permission set shopslot.* true
            </code>
          </div>
        </div>

        {/* Command Output Terminal (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090c12] border border-slate-800 p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-300">
                  LuckPerms Command Script ({currentGroup.slots} Slots)
                </span>
              </div>
              <button
                id="copy-lp-commands-btn"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Commands</span>
                  </>
                )}
              </button>
            </div>

            <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-96 p-2 rounded bg-black/40 border border-slate-900">
              {generateLpCommands()}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Runs in Minecraft server console or in-game chat</span>
            <span className="text-emerald-400 font-mono">No Server Restart Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
