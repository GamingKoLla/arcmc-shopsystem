export interface WhitelistItem {
  id: string; // e.g. "obsidian"
  material: string; // Bukkit Material e.g. "OBSIDIAN"
  name: string; // Formatted name
  price: number;
  category: 'combat' | 'minerals' | 'redstone' | 'building' | 'food' | 'rare' | 'utility';
  iconEmoji?: string;
  permission?: string; // Optional custom permission node (e.g. "arcedgeshop.item.rare")
}

export interface PlayerSlot {
  slotNumber: number; // 1 to 32
  unlocked: boolean;
  permissionRequired: string; // e.g. "shopslot.1"
  item?: WhitelistItem;
}

export interface PluginFile {
  path: string;
  filename: string;
  category: 'core' | 'config' | 'gui' | 'dialog' | 'storage' | 'security' | 'build';
  description: string;
  code: string;
  language: 'java' | 'yaml' | 'xml' | 'kotlin' | 'markdown';
}

export interface SecurityAuditItem {
  id: string;
  title: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  skriptFlaw: string;
  arcedgeFix: string;
  technicalMechanism: string;
}
