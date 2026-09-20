import React, { useState, useMemo } from 'react';
import { WhitelistItem } from '../types';
import { Search, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';

interface MinecraftChestPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: WhitelistItem) => void;
  whitelist: WhitelistItem[];
  targetSlotNumber: number;
  playerPermissions?: string[];
}

const ITEMS_PER_PAGE = 45; // 5 rows x 9 columns

export const MinecraftChestPicker: React.FC<MinecraftChestPickerProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  whitelist,
  targetSlotNumber,
  playerPermissions = ['arcedgeshop.use', 'arcedgeshop.item.totem', 'arcedgeshop.item.netherite']
}) => {
  const [page, setPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredItem, setHoveredItem] = useState<WhitelistItem | null>(null);
  const [deniedItem, setDeniedItem] = useState<{ name: string; permission: string } | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return whitelist;
    return whitelist.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [whitelist, searchFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  if (!isOpen) return null;

  const handleSlotClick = (item: WhitelistItem) => {
    if (item.permission && !playerPermissions.includes(item.permission) && !playerPermissions.includes('arcedgeshop.admin') && !playerPermissions.includes('arcedgeshop.item.*')) {
      setDeniedItem({ name: item.name, permission: item.permission });
      setTimeout(() => setDeniedItem(null), 3000);
      return;
    }
    onSelectItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Minecraft Classic Chest Container (54-slots = 6 rows x 9 cols) */}
      <div 
        id="minecraft-chest-container"
        className="relative w-full max-w-2xl bg-[#c6c6c6] border-4 border-[#373737] rounded-sm p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)] font-['JetBrains_Mono',monospace] text-[#3f3f3f]"
        style={{
          boxShadow: 'inset 4px 4px 0px #ffffff, inset -4px -4px 0px #555555'
        }}
      >
        {/* Fallback Banner Badge */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#8b8b8b]">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-950 border border-amber-400 font-mono">
              FALLBACK: 54-SLOT CHEST GUI (ItemPickerChestGui.java)
            </span>
            <span className="text-xs font-bold text-[#222]">Target: Slot #{targetSlotNumber}</span>
          </div>

          <button
            id="close-minecraft-chest-btn"
            onClick={onClose}
            className="w-6 h-6 rounded bg-[#999] hover:bg-[#777] text-white flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chest Header Title */}
        <div className="flex items-center justify-between px-1 pb-2">
          <h3 className="text-sm font-bold text-[#373737] tracking-wider">
            Chest: Choose Whitelist Item
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                id="chest-search-filter-input"
                type="text"
                placeholder="Quick Filter..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setPage(0);
                }}
                className="w-36 bg-[#8b8b8b] text-[#ffffff] placeholder-[#555] text-xs px-2 py-1 border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Permission Denied Alert in Chest */}
        {deniedItem && (
          <div className="mb-2 p-1.5 rounded bg-rose-700 text-white text-[11px] font-bold flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Denied: You need &quot;{deniedItem.permission}&quot; to list {deniedItem.name}!</span>
          </div>
        )}

        {/* 54-Slot Grid (6 rows x 9 columns) */}
        <div className="p-2 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]">
          {/* Rows 1 to 5: 45 Items */}
          <div className="grid grid-cols-9 gap-1 mb-2">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => {
              const item = currentItems[idx];
              if (!item) {
                // Empty slot in chest
                return (
                  <div
                    key={`empty-${idx}`}
                    className="w-full aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]"
                  />
                );
              }

              const hasPerm = !item.permission || playerPermissions.includes(item.permission) || playerPermissions.includes('arcedgeshop.admin');

              return (
                <button
                  key={item.material}
                  id={`chest-slot-${idx}`}
                  type="button"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleSlotClick(item)}
                  className={`group relative w-full aspect-square flex items-center justify-center text-xl transition-all border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] ${
                    hasPerm ? 'bg-[#8b8b8b] hover:bg-[#a0a0a0] active:bg-[#777]' : 'bg-[#707070] opacity-75'
                  }`}
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {item.iconEmoji || '📦'}
                  </span>
                  {!hasPerm && (
                    <Lock className="w-2.5 h-2.5 text-amber-300 absolute top-0.5 right-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Row 6: Navigation Controls (Slots 45 to 53) */}
          <div className="grid grid-cols-9 gap-1 pt-1 border-t-2 border-[#555]">
            {/* Slot 45: Anvil / Search Info */}
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex items-center justify-center text-base cursor-help" title="Search Filter active">
              🔍
            </div>

            {/* Empty slots 46, 47 */}
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]" />
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]" />

            {/* Slot 48: Previous Page Arrow */}
            <button
              id="chest-prev-page-btn"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className={`aspect-square flex items-center justify-center border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] ${
                page > 0 ? 'bg-[#a0a0a0] hover:bg-[#bfbfbf] active:bg-[#777] text-white' : 'bg-[#666] text-[#444] cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5 font-bold" />
            </button>

            {/* Slot 49: Book: Page X of Y */}
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] flex flex-col items-center justify-center text-[10px] font-bold text-amber-900">
              <span>📖</span>
              <span className="text-[8px] font-mono leading-none">{page + 1}/{totalPages}</span>
            </div>

            {/* Slot 50: Next Page Arrow */}
            <button
              id="chest-next-page-btn"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className={`aspect-square flex items-center justify-center border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff] ${
                page < totalPages - 1 ? 'bg-[#a0a0a0] hover:bg-[#bfbfbf] active:bg-[#777] text-white' : 'bg-[#666] text-[#444] cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5 font-bold" />
            </button>

            {/* Empty slots 51, 52 */}
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]" />
            <div className="aspect-square bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]" />

            {/* Slot 53: Barrier / Close */}
            <button
              id="chest-close-slot-btn"
              onClick={onClose}
              className="aspect-square bg-[#8b8b8b] hover:bg-rose-600 active:bg-rose-800 text-white flex items-center justify-center text-base border-2 border-t-[#373737] border-l-[#373737] border-b-[#ffffff] border-r-[#ffffff]"
              title="Close GUI"
            >
              🚫
            </button>
          </div>
        </div>

        {/* Hovered Item Tooltip (Minecraft authentic dark purple/black tooltip box) */}
        <div className="mt-3 p-2.5 rounded bg-[#100010] border-2 border-[#26006e] text-white text-xs font-mono min-h-[58px] shadow-lg">
          {hoveredItem ? (
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-amber-300 font-bold">{hoveredItem.name}</span>
                <span className="text-[10px] text-slate-400">({hoveredItem.material})</span>
              </div>
              <div className="text-emerald-400 text-xs font-semibold">
                Fixed Price: ${hoveredItem.price.toLocaleString()}
              </div>
              {hoveredItem.permission && (
                <div className="text-cyan-300 text-[10px]">
                  Requires Permission: <code className="bg-black/60 px-1 rounded">{hoveredItem.permission}</code>
                </div>
              )}
              <div className="text-[10px] text-amber-200/70 italic">
                ▶ Click to select this item for Slot #{targetSlotNumber}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-xs italic flex items-center justify-between h-full py-1">
              <span>Hover over any item in the chest to inspect price &amp; permissions.</span>
              <span className="text-[10px] text-slate-500">Page {page + 1} of {totalPages}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
