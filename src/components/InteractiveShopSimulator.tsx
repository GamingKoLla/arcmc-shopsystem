import React, { useState } from 'react';
import { WhitelistItem, PlayerSlot } from '../types';
import { Lock, Unlock, ShoppingCart, Search, RefreshCw, Plus, Trash2, Coins, Backpack, AlertTriangle, ShieldCheck, Check, Sparkles, SlidersHorizontal, Terminal } from 'lucide-react';
import { MinecraftDialogPicker } from './MinecraftDialogPicker';
import { MinecraftChestPicker } from './MinecraftChestPicker';

interface InteractiveShopSimulatorProps {
  whitelist: WhitelistItem[];
}

export const InteractiveShopSimulator: React.FC<InteractiveShopSimulatorProps> = ({ whitelist }) => {
  // 32 slots state
  const [unlockedSlotsCount, setUnlockedSlotsCount] = useState<number>(10);
  const [playerSlots, setPlayerSlots] = useState<{ [slot: number]: WhitelistItem | null }>({
    1: whitelist.find(i => i.id === 'obsidian') || null,
    2: whitelist.find(i => i.id === 'end crystal') || null,
    3: whitelist.find(i => i.id === 'totem of undying') || null,
    4: whitelist.find(i => i.id === 'golden apple') || null,
    5: whitelist.find(i => i.id === 'diamond') || null,
    6: whitelist.find(i => i.id === 'netherite upgrade smithing template') || null,
    7: whitelist.find(i => i.id === 'crafter') || null,
    8: whitelist.find(i => i.id === 'beacon') || null,
    9: whitelist.find(i => i.id === 'ender pearl') || null,
    10: whitelist.find(i => i.id === 'elytra') || null,
  });

  // Client UI Mode: Modern Dialog API vs Fallback 54-Slot Chest GUI
  const [clientInterfaceMode, setClientInterfaceMode] = useState<'DIALOG_API' | 'CHEST_GUI'>('DIALOG_API');

  // Simulated player active LuckPerms permissions
  const [playerPermissions, setPlayerPermissions] = useState<string[]>([
    'arcedgeshop.use',
    'arcedgeshop.item.totem',
    'arcedgeshop.item.netherite'
  ]);

  // Simulated player economy & inventory
  const [balance, setBalance] = useState<number>(250000);
  const [inventoryItems, setInventoryItems] = useState<{ material: string; count: number; name: string }[]>([
    { material: 'IRON_SWORD', count: 1, name: 'Iron Sword' },
    { material: 'COOKED_BEEF', count: 32, name: 'Steak' }
  ]);

  // Active modals
  const [activeSlotTarget, setActiveSlotTarget] = useState<number | null>(null);
  const [showItemPicker, setShowItemPicker] = useState<boolean>(false);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customBuyAmount, setCustomBuyAmount] = useState<string>('1');

  // Logs & status
  const [actionLog, setActionLog] = useState<{ text: string; type: 'success' | 'warn' | 'error' | 'info'; time: string }[]>([
    { text: 'ArcEdgeShopSystem v2.6.0 initialized with 32 LuckPerms slots.', type: 'info', time: '00:00:01' },
    { text: 'Hooked Vault Economy: $250,000.00 registered.', type: 'info', time: '00:00:01' },
    { text: 'LuckPerms user has permissions shopslot.1 through shopslot.10.', type: 'info', time: '00:00:02' },
    { text: 'Dialog API capability detected: 4-Column "Choose Item" form enabled.', type: 'info', time: '00:00:02' }
  ]);

  const addLog = (text: string, type: 'success' | 'warn' | 'error' | 'info') => {
    const time = new Date().toLocaleTimeString();
    setActionLog(prev => [{ text, type, time }, ...prev.slice(0, 19)]);
  };

  const togglePermission = (perm: string) => {
    setPlayerPermissions(prev => {
      const exists = prev.includes(perm);
      const next = exists ? prev.filter(p => p !== perm) : [...prev, perm];
      addLog(exists ? `[LuckPerms] Revoked permission node: ${perm}` : `[LuckPerms] Granted permission node: ${perm}`, 'info');
      return next;
    });
  };

  // Check if slot has permission
  const isSlotUnlocked = (slotNum: number) => slotNum <= unlockedSlotsCount;

  // Filter whitelist items
  const filteredItems = whitelist.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Slot click handler
  const handleSlotClick = (slotNum: number) => {
    if (!isSlotUnlocked(slotNum)) {
      addLog(`[LOCKED] Slot #${slotNum} requires permission node: shopslot.${slotNum}`, 'warn');
      return;
    }

    setActiveSlotTarget(slotNum);
    const existingItem = playerSlots[slotNum];
    if (existingItem) {
      setShowBuyModal(true);
      setCustomBuyAmount('1');
    } else {
      setShowItemPicker(true);
    }
  };

  // Assign item to slot with permission verification
  const handleSelectItem = (item: WhitelistItem) => {
    if (activeSlotTarget === null) return;

    // Check item permission
    if (item.permission && !playerPermissions.includes(item.permission) && !playerPermissions.includes('arcedgeshop.admin')) {
      addLog(`[PERMISSION DENIED] You need permission "${item.permission}" to list ${item.name}!`, 'error');
      return;
    }

    setPlayerSlots(prev => ({
      ...prev,
      [activeSlotTarget]: item
    }));
    addLog(`Slot #${activeSlotTarget} configured to sell ${item.name} at $${item.price.toLocaleString()} each (Fixed Price Enforced).`, 'success');
    setShowItemPicker(false);
    setActiveSlotTarget(null);
  };

  // Clear slot
  const handleClearSlot = (slotNum: number) => {
    setPlayerSlots(prev => {
      const next = { ...prev };
      delete next[slotNum];
      return next;
    });
    addLog(`Slot #${slotNum} cleared.`, 'info');
    setShowBuyModal(false);
    setActiveSlotTarget(null);
  };

  // Execute purchase with full anti-exploit validations
  const handleExecutePurchase = (amount: number) => {
    if (activeSlotTarget === null) return;
    const item = playerSlots[activeSlotTarget];
    if (!item) return;

    if (amount <= 0 || isNaN(amount)) {
      addLog('Anti-Exploit: Purchase quantity must be at least 1.', 'error');
      return;
    }

    const totalCost = item.price * amount;

    // 1. Balance verification
    if (balance < totalCost) {
      addLog(`Insufficient Funds: Need $${totalCost.toLocaleString()}, but only have $${balance.toLocaleString()}.`, 'error');
      return;
    }

    // 2. Inventory space pre-check
    const maxCapacity = 36 * 64;
    const currentTotalItems = inventoryItems.reduce((acc, curr) => acc + curr.count, 0);
    if (currentTotalItems + amount > maxCapacity) {
      addLog(`Inventory Full Exploit Blocked: Cannot fit ${amount}x ${item.name}. Transaction aborted; 0 money charged.`, 'warn');
      return;
    }

    // 3. Atomic transaction execution
    setBalance(prev => prev - totalCost);
    setInventoryItems(prev => {
      const existing = prev.find(i => i.material === item.material);
      if (existing) {
        return prev.map(i => i.material === item.material ? { ...i, count: i.count + amount } : i);
      } else {
        return [...prev, { material: item.material, count: amount, name: item.name }];
      }
    });

    addLog(`[Vault] Transaction Success: Bought ${amount}x ${item.name} for $${totalCost.toLocaleString()}.`, 'success');
    setShowBuyModal(false);
    setActiveSlotTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* LuckPerms Tier Controller */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">LuckPerms Slot Scale</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {unlockedSlotsCount} / 32 Slots Unlocked
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Simulate LuckPerms permission nodes (e.g. <code className="text-cyan-300 font-mono">shopslot.1</code> through <code className="text-cyan-300 font-mono">shopslot.{unlockedSlotsCount}</code>).
          </p>

          <div className="space-y-3">
            <input
              id="luckperms-slot-slider"
              type="range"
              min="1"
              max="32"
              value={unlockedSlotsCount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setUnlockedSlotsCount(val);
                addLog(`LuckPerms permissions updated: granted shopslot.1 to shopslot.${val}`, 'info');
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Default (5)</span>
              <span>VIP (12)</span>
              <span>MVP (20)</span>
              <span>Elite (32 Max)</span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[5, 10, 16, 24, 32].map((cnt) => (
                <button
                  key={cnt}
                  id={`preset-slots-${cnt}`}
                  onClick={() => {
                    setUnlockedSlotsCount(cnt);
                    addLog(`Applied rank preset: ${cnt} slots unlocked via LuckPerms.`, 'info');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    unlockedSlotsCount === cnt
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cnt === 32 ? 'All 32 Slots' : `${cnt} Slots`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vault Economy Balance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vault Economy</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" /> Active
              </span>
            </div>
            <p className="text-2xl font-black text-amber-300 font-mono tracking-tight">
              ${balance.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">Simulated player wallet</p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              id="economy-add-10k-btn"
              onClick={() => {
                setBalance(b => b + 25000);
                addLog('Added $25,000 to player Vault balance.', 'info');
              }}
              className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
            >
              +$25k
            </button>
            <button
              id="economy-add-100k-btn"
              onClick={() => {
                setBalance(b => b + 100000);
                addLog('Added $100,000 to player Vault balance.', 'info');
              }}
              className="flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
            >
              +$100k
            </button>
          </div>
        </div>

        {/* Player Inventory Bag Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Backpack className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Player Bag Space</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {inventoryItems.reduce((acc, curr) => acc + curr.count, 0)} items
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Anti-exploit engine prevents transactions if bag overflows.
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
              {inventoryItems.map((item, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                  {item.count}x {item.name}
                </span>
              ))}
            </div>
          </div>

          <button
            id="clear-bag-btn"
            onClick={() => {
              setInventoryItems([]);
              addLog('Simulated player bag cleared.', 'info');
            }}
            className="w-full mt-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Clear Inventory Bag
          </button>
        </div>
      </div>

      {/* Main 32-Slot Shop GUI Grid */}
      <div className="p-6 rounded-2xl bg-[#10141d] border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                /shop
              </span>
              <h2 className="text-lg font-bold text-white font-['JetBrains_Mono',monospace]">
                Personal Shop GUI <span className="text-slate-500">(32 Slots)</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Left-click an unlocked slot to buy or assign. Right-click to clear. Red slots represent locked slots requiring LuckPerms permission.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/80"></div>
              <span className="text-slate-400">Filled</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded bg-slate-700/40 border border-slate-600"></div>
              <span className="text-slate-400">Empty</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500/60"></div>
              <span className="text-slate-400">Locked (Requires Perm)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Client UI Mode Switcher & Permission Tester Bar */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              Client Protocol Mode:
            </span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                id="toggle-mode-dialog-btn"
                type="button"
                onClick={() => {
                  setClientInterfaceMode('DIALOG_API');
                  addLog('Switched to Modern Minecraft Dialog API mode (4-Column Form).', 'info');
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  clientInterfaceMode === 'DIALOG_API'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌐 Dialog API (4-Columns)
              </button>
              <button
                id="toggle-mode-chest-btn"
                type="button"
                onClick={() => {
                  setClientInterfaceMode('CHEST_GUI');
                  addLog('Switched to Fallback 54-Slot Chest GUI mode (ItemPickerChestGui.java).', 'warn');
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  clientInterfaceMode === 'CHEST_GUI'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📦 54-Slot Chest GUI Fallback
              </button>
            </div>
          </div>

          {/* LuckPerms Whitelist Item Permissions Live Tester */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 shrink-0">Test Permissions:</span>
            {[
              { id: 'arcedgeshop.item.beacon', label: 'Beacon' },
              { id: 'arcedgeshop.item.ancient_debris', label: 'Ancient Debris' },
              { id: 'arcedgeshop.item.dragon_egg', label: 'Dragon Egg' },
              { id: 'arcedgeshop.admin', label: 'Admin (All)' }
            ].map(perm => {
              const active = playerPermissions.includes(perm.id);
              return (
                <button
                  key={perm.id}
                  id={`perm-toggle-${perm.label.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => togglePermission(perm.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    active
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-semibold'
                      : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Toggle permission node ${perm.id}`}
                >
                  {active ? '✓' : '+'} {perm.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 32-Slot Grid (4 rows of 8 slots = 32 slots) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {Array.from({ length: 32 }).map((_, index) => {
            const slotNum = index + 1;
            const unlocked = isSlotUnlocked(slotNum);
            const item = playerSlots[slotNum];

            if (!unlocked) {
              return (
                <div
                  key={slotNum}
                  id={`shop-slot-${slotNum}`}
                  onClick={() => handleSlotClick(slotNum)}
                  className="group relative h-28 rounded-xl bg-gradient-to-b from-rose-950/20 to-slate-900/60 border border-rose-900/40 hover:border-rose-600/70 p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:shadow-lg hover:shadow-rose-950/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-400/80">#{slotNum}</span>
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-xs font-semibold text-rose-300 block">LOCKED</span>
                    <span className="text-[10px] font-mono text-rose-400/80 block mt-0.5 truncate">
                      shopslot.{slotNum}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center">Requires Rank</div>
                </div>
              );
            }

            if (item) {
              return (
                <div
                  key={slotNum}
                  id={`shop-slot-${slotNum}`}
                  onClick={() => handleSlotClick(slotNum)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleClearSlot(slotNum);
                  }}
                  className="group relative h-28 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-950/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">#{slotNum}</span>
                    <span className="text-xs">{item.iconEmoji || '📦'}</span>
                  </div>
                  <div className="text-center my-auto">
                    <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs font-mono font-semibold text-amber-400 mt-0.5">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span className="text-cyan-400 font-medium">Click to Buy</span>
                    <span className="text-slate-500">R: Clear</span>
                  </div>
                </div>
              );
            }

            // Unlocked but empty slot
            return (
              <div
                key={slotNum}
                id={`shop-slot-${slotNum}`}
                onClick={() => handleSlotClick(slotNum)}
                className="group relative h-28 rounded-xl bg-slate-900/40 border border-dashed border-slate-700/80 hover:border-cyan-500/80 p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:bg-cyan-950/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-cyan-400">#{slotNum}</span>
                  <Unlock className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
                </div>
                <div className="text-center my-auto">
                  <Plus className="w-5 h-5 mx-auto text-slate-600 group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 mt-1 block">
                    Empty Slot
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 text-center group-hover:text-cyan-400/80">
                  Click to Assign
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Transaction / Exploit Audit Log */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Real-Time Security & Transaction Engine Log
            </h3>
          </div>
          <button
            id="clear-logs-btn"
            onClick={() => setActionLog([])}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Clear Log
          </button>
        </div>

        <div className="bg-[#090c10] rounded-xl p-3 border border-slate-800/80 font-mono text-xs max-h-40 overflow-y-auto space-y-1.5">
          {actionLog.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2 leading-relaxed">
              <span className="text-slate-500 select-none">[{log.time}]</span>
              <span
                className={
                  log.type === 'success'
                    ? 'text-emerald-400'
                    : log.type === 'error'
                    ? 'text-rose-400 font-semibold'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : 'text-cyan-300'
                }
              >
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Choose Item Picker (Dual Mode: Minecraft Dialog API vs 54-Slot Chest GUI) */}
      {clientInterfaceMode === 'DIALOG_API' ? (
        <MinecraftDialogPicker
          isOpen={showItemPicker && activeSlotTarget !== null}
          onClose={() => {
            setShowItemPicker(false);
            setActiveSlotTarget(null);
          }}
          onSelectItem={handleSelectItem}
          whitelist={whitelist}
          targetSlotNumber={activeSlotTarget || 1}
          playerPermissions={playerPermissions}
        />
      ) : (
        <MinecraftChestPicker
          isOpen={showItemPicker && activeSlotTarget !== null}
          onClose={() => {
            setShowItemPicker(false);
            setActiveSlotTarget(null);
          }}
          onSelectItem={handleSelectItem}
          whitelist={whitelist}
          targetSlotNumber={activeSlotTarget || 1}
          playerPermissions={playerPermissions}
        />
      )}

      {/* MODAL 2: Buy Dialog (Multi-Action Dialog with real-time preview) */}
      {showBuyModal && activeSlotTarget && playerSlots[activeSlotTarget] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12161f] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {(() => {
              const item = playerSlots[activeSlotTarget]!;
              const customQty = parseInt(customBuyAmount, 10) || 1;
              const totalCost = item.price * customQty;

              return (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{item.iconEmoji || '📦'}</span>
                      <div>
                        <span className="text-xs font-mono text-cyan-400">Slot #{activeSlotTarget}</span>
                        <h3 className="text-base font-bold text-white font-['JetBrains_Mono',monospace]">
                          Buy {item.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      id="close-buy-modal-btn"
                      onClick={() => {
                        setShowBuyModal(false);
                        setActiveSlotTarget(null);
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Pricing Info */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Unit Price (Fixed Admin):</span>
                      <span className="text-amber-400 font-mono font-bold">${item.price.toLocaleString()} each</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Your Vault Balance:</span>
                      <span className="text-emerald-400 font-mono font-bold">${balance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Multi-Action Buttons (matching modern Minecraft Dialog format) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="buy-1-btn"
                      onClick={() => handleExecutePurchase(1)}
                      className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 text-left transition-all"
                    >
                      <div className="text-[11px] opacity-80">Buy Single</div>
                      <div className="text-sm font-black">+1 Item</div>
                      <div className="text-[11px] font-mono mt-1 text-emerald-100">${item.price.toLocaleString()}</div>
                    </button>

                    <button
                      id="buy-stack-btn"
                      onClick={() => handleExecutePurchase(64)}
                      className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 text-left transition-all"
                    >
                      <div className="text-[11px] opacity-80">Buy Stack</div>
                      <div className="text-sm font-black">+64 Items</div>
                      <div className="text-[11px] font-mono mt-1 text-cyan-100">${(item.price * 64).toLocaleString()}</div>
                    </button>
                  </div>

                  {/* Custom Amount Form */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <label className="text-xs text-slate-400 font-medium block">Custom Amount:</label>
                    <div className="flex space-x-2">
                      <input
                        id="custom-buy-amount-input"
                        type="number"
                        min="1"
                        max="2304"
                        value={customBuyAmount}
                        onChange={(e) => setCustomBuyAmount(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        id="buy-custom-amount-btn"
                        onClick={() => handleExecutePurchase(customQty)}
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                      >
                        Buy {customQty}x (${totalCost.toLocaleString()})
                      </button>
                    </div>
                  </div>

                  {/* Slot Admin Controls */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <button
                      id="change-slot-item-btn"
                      onClick={() => {
                        setShowBuyModal(false);
                        setShowItemPicker(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Change Whitelist Item
                    </button>
                    <button
                      id="clear-slot-item-btn"
                      onClick={() => handleClearSlot(activeSlotTarget)}
                      className="text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Slot</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
