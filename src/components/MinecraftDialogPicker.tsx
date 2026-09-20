import React, { useState, useMemo } from 'react';
import { WhitelistItem } from '../types';
import { AlertTriangle, Lock, Search as SearchIcon, X, Check } from 'lucide-react';

interface MinecraftDialogPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: WhitelistItem) => void;
  whitelist: WhitelistItem[];
  targetSlotNumber: number;
  playerPermissions?: string[]; // e.g. ["arcedgeshop.item.totem"]
}

export const MinecraftDialogPicker: React.FC<MinecraftDialogPickerProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  whitelist,
  targetSlotNumber,
  playerPermissions = ['arcedgeshop.use', 'arcedgeshop.item.totem', 'arcedgeshop.item.netherite']
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] = useState('');
  const [deniedItem, setDeniedItem] = useState<{ name: string; permission: string } | null>(null);

  const filteredItems = useMemo(() => {
    const q = activeSearchFilter.trim().toLowerCase();
    if (!q) return whitelist;
    return whitelist.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [whitelist, activeSearchFilter]);

  if (!isOpen) return null;

  const handleItemClick = (item: WhitelistItem) => {
    // Check permission if item requires one
    if (item.permission && !playerPermissions.includes(item.permission) && !playerPermissions.includes('arcedgeshop.admin') && !playerPermissions.includes('arcedgeshop.item.*')) {
      setDeniedItem({ name: item.name, permission: item.permission });
      setTimeout(() => setDeniedItem(null), 3500);
      return;
    }
    onSelectItem(item);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearchFilter(searchQuery);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Minecraft Dialog Frame: exact dark slate/iron container with 2px bevel border */}
      <div 
        id="minecraft-dialog-container"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#1e232d] border-2 border-[#485366] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.85)] font-['JetBrains_Mono',monospace]"
        style={{
          boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.12), inset -2px -2px 0px rgba(0,0,0,0.6)'
        }}
      >
        {/* Top Header Bar: "Choose Item" centered, with yellow caution icon [⚠️] */}
        <div className="relative flex items-center justify-between px-5 py-3.5 bg-[#171b23] border-b-2 border-[#2b3342]">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono font-bold tracking-wider">
              MINECRAFT DIALOG API (4-COLUMNS)
            </span>
            <span className="text-xs text-slate-400">Target: Slot #{targetSlotNumber}</span>
          </div>

          {/* Centered Title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-[#e6e6e6] tracking-wide drop-shadow-[1px_1px_0px_#000000]">
              Choose Item
            </h2>
            {/* Caution/Warning Badge as shown in screenshot */}
            <div className="w-6 h-6 rounded bg-[#111317] border border-[#3f4756] flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            </div>
          </div>

          <button
            id="close-minecraft-dialog-btn"
            onClick={onClose}
            className="w-7 h-7 rounded bg-[#2a303c] hover:bg-[#384050] text-slate-300 hover:text-white border border-[#444e61] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-header: Search Label and Input */}
        <div className="px-5 pt-4 pb-2 bg-[#1b2029]">
          <label className="block text-xs font-bold text-[#a0abbd] mb-1.5 uppercase tracking-wider">
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="minecraft-dialog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type item name or material (e.g. acacia, debris, axolotl)..."
                className="w-full bg-[#0c0e13] text-[#f0f0f0] text-xs sm:text-sm px-3 py-2 border-2 border-[#394254] rounded focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchFilter('');
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Permission Denied Alert Popup if clicked locked item */}
        {deniedItem && (
          <div className="mx-5 my-2 p-2.5 rounded bg-rose-950/80 border border-rose-600/80 flex items-center space-x-2 text-rose-200 text-xs animate-in slide-in-from-top-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Permission Denied:</strong> You require <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300 font-mono">{deniedItem.permission}</code> to list {deniedItem.name}!
            </span>
          </div>
        )}

        {/* 4-Columns Button Grid (Exactly as seen in the user's Minecraft Dialog screenshot) */}
        <div className="flex-1 px-5 py-3 overflow-y-auto min-h-[300px] max-h-[58vh] bg-[#161a22] custom-mc-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {/* Slot (1, 1): The [Search] Button as in the screenshot */}
            <button
              id="mc-dialog-search-submit-btn"
              type="button"
              onClick={() => handleSearchSubmit()}
              className="group relative flex items-center justify-center space-x-2 px-3 py-2.5 min-h-[46px] rounded bg-[#484f5e] hover:bg-[#5b6477] active:bg-[#383d4a] border-2 border-t-[#6f7a90] border-l-[#6f7a90] border-b-[#262a32] border-r-[#262a32] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:translate-y-[1px]"
            >
              <SearchIcon className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              <span className="drop-shadow-[1px_1px_0px_#000000]">Search</span>
            </button>

            {/* Whitelist Item Buttons */}
            {filteredItems.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 p-8 text-center text-slate-400 text-xs">
                No whitelisted items matching &quot;{activeSearchFilter}&quot;.
              </div>
            ) : (
              filteredItems.map((item) => {
                const hasPerm = !item.permission || playerPermissions.includes(item.permission) || playerPermissions.includes('arcedgeshop.admin');

                return (
                  <button
                    key={item.id + item.material}
                    id={`mc-dialog-item-${item.material.toLowerCase()}`}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`group relative flex items-center space-x-2 px-2.5 py-2 min-h-[46px] rounded text-left transition-all active:translate-y-[1px] ${
                      hasPerm
                        ? 'bg-[#3b4250] hover:bg-[#4a5365] active:bg-[#2c313c] border-2 border-t-[#5a6479] border-l-[#5a6479] border-b-[#1c2027] border-r-[#1c2027] text-[#e0e5ed]'
                        : 'bg-[#292e38] hover:bg-[#343a46] border-2 border-t-[#424b5a] border-l-[#424b5a] border-b-[#15181e] border-r-[#15181e] text-slate-400 opacity-90'
                    }`}
                  >
                    {/* Item Icon */}
                    <span className="text-xl sm:text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {item.iconEmoji || '📦'}
                    </span>

                    {/* Text block */}
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-white truncate drop-shadow-[1px_1px_0px_#000000]">
                          {item.name}
                        </span>
                        {!hasPerm && (
                          <Lock className="w-3 h-3 text-amber-400 shrink-0 inline" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-0.5 font-mono">
                        <span className="text-amber-400 font-bold drop-shadow-[1px_1px_0px_#000000]">
                          ${item.price.toLocaleString()}
                        </span>
                        {item.permission && (
                          <span className="text-[9px] text-cyan-300/80 truncate max-w-[85px]" title={item.permission}>
                            {item.permission.replace('arcedgeshop.item.', '')}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-[#14171e] border-t-2 border-[#262c37] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span className="text-slate-300">
              Total Whitelisted: <strong className="text-cyan-400">{filteredItems.length}</strong> items
            </span>
            <span>•</span>
            <span className="text-amber-400/90">Server Fixed Prices Enforced</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-[#2c3340] hover:bg-[#384152] border border-[#434e62] text-xs text-slate-200 font-medium"
            >
              Cancel (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
