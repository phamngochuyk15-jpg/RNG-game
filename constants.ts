
import { Artifact, RarityTier, Dice, Pet, Mutation } from './types';

export const MUTATIONS: Mutation[] = [
  { name: 'Polished', multiplier: 1.3, color: '#94a3b8' },
  { name: 'Radiant', multiplier: 1.8, color: '#fde047' },
  { name: 'Gilded', multiplier: 2, color: '#fbbf24' },
  { name: 'Shiny', multiplier: 1.5, color: '#60a5fa' },
  { name: 'Corrupted', multiplier: 3.5, color: '#7f1d1d' },
  { name: 'Frozen', multiplier: 4.0, color: '#93c5fd' },
  { name: 'Stellar', multiplier: 6.0, color: '#c084fc' },
  { name: 'Eternal', multiplier: 12, color: '#ffffff' },
  { name: 'Transcendent', multiplier: 25, color: '#ff00ff' },
];

export const ARTIFACTS: Artifact[] = [
  // --- COMMON (1 in 2 to 10) ---
  { id: 'a1', name: 'Worn Pebble', chance: 2, baseValue: 1, tier: RarityTier.COMMON, color: '#94a3b8' },
  { id: 'a2', name: 'Elder Twig', chance: 2.5, baseValue: 2, tier: RarityTier.COMMON, color: '#78350f' },
  { id: 'a3', name: 'Star Sand', chance: 3, baseValue: 2, tier: RarityTier.COMMON, color: '#fde047' },
  { id: 'a4', name: 'Spirit Mote', chance: 3.5, baseValue: 3, tier: RarityTier.COMMON, color: '#cbd5e1' },
  { id: 'a5', name: 'Autumn Leaf', chance: 4, baseValue: 4, tier: RarityTier.COMMON, color: '#a16207' },
  { id: 'a6', name: 'River Stone', chance: 5, baseValue: 5, tier: RarityTier.COMMON, color: '#64748b' },
  { id: 'a7', name: 'Broken Shell', chance: 7, baseValue: 6, tier: RarityTier.COMMON, color: '#fed7aa' },
  { id: 'a8', name: 'Glass Shard', chance: 10, baseValue: 10, tier: RarityTier.COMMON, color: '#93c5fd' },

  // --- UNCOMMON (1 in 11 to 100) ---
  { id: 'a12', name: 'Bronze Coin', chance: 15, baseValue: 20, tier: RarityTier.UNCOMMON, color: '#d97706' },
  { id: 'a13', name: 'Iron Ring', chance: 25, baseValue: 35, tier: RarityTier.UNCOMMON, color: '#64748b' },
  { id: 'a14', name: 'Copper Key', chance: 40, baseValue: 50, tier: RarityTier.UNCOMMON, color: '#b45309' },
  { id: 'a15', name: 'Leather Pouch', chance: 60, baseValue: 80, tier: RarityTier.UNCOMMON, color: '#78350f' },
  { id: 'a16', name: 'Jade Bead', chance: 80, baseValue: 110, tier: RarityTier.UNCOMMON, color: '#10b981' },
  { id: 'a17', name: 'Obsidian Arrow', chance: 100, baseValue: 150, tier: RarityTier.UNCOMMON, color: '#1e293b' },

  // --- RARE (1 in 101 to 1,000) ---
  { id: 'a26', name: 'Silver Compass', chance: 150, baseValue: 350, tier: RarityTier.RARE, color: '#e2e8f0' },
  { id: 'a27', name: 'Glow Tulip', chance: 300, baseValue: 600, tier: RarityTier.RARE, color: '#4ade80' },
  { id: 'a28', name: 'Amethyst Spike', chance: 500, baseValue: 1200, tier: RarityTier.RARE, color: '#a855f7' },
  { id: 'a29', name: 'Ocean Pearl', chance: 750, baseValue: 2500, tier: RarityTier.RARE, color: '#60a5fa' },
  { id: 'a30', name: 'Dragon Scale', chance: 1000, baseValue: 5000, tier: RarityTier.RARE, color: '#f97316' },

  // --- EPIC (1 in 1,001 to 10,000) ---
  { id: 'a40', name: 'Templar Crest', chance: 2500, baseValue: 15000, tier: RarityTier.EPIC, color: '#ef4444' },
  { id: 'a41', name: 'Astral Grimoire', chance: 5000, baseValue: 35000, tier: RarityTier.EPIC, color: '#6366f1' },
  { id: 'a42', name: 'Valkyrie Feather', chance: 7500, baseValue: 70000, tier: RarityTier.EPIC, color: '#fef3c7' },
  { id: 'a43', name: 'Mana Well', chance: 10000, baseValue: 120000, tier: RarityTier.EPIC, color: '#3b82f6' },

  // --- LEGENDARY (1 in 10,001 to 100,000) ---
  { id: 'a50', name: 'Shard of Excalibur', chance: 25000, baseValue: 500000, tier: RarityTier.LEGENDARY, color: '#fbbf24' },
  { id: 'a51', name: 'Essence of Sun', chance: 50000, baseValue: 1200000, tier: RarityTier.LEGENDARY, color: '#f59e0b' },
  { id: 'a52', name: 'Moonstone Eye', chance: 75000, baseValue: 2500000, tier: RarityTier.LEGENDARY, color: '#e2e8f0' },
  { id: 'a53', name: 'Fallen Galaxy', chance: 100000, baseValue: 5000000, tier: RarityTier.LEGENDARY, color: '#ffffff' },

  // --- MYTHICAL (1 in 100,001 to 1M) ---
  { id: 'a60', name: 'Void Lantern', chance: 250000, baseValue: 15000000, tier: RarityTier.MYTHICAL, color: '#4c1d95' },
  { id: 'a61', name: 'Nebula Core', chance: 500000, baseValue: 40000000, tier: RarityTier.MYTHICAL, color: '#c084fc' },
  { id: 'a62', name: 'Omega Sigil', chance: 1000000, baseValue: 100000000, tier: RarityTier.MYTHICAL, color: '#ef4444' },

  // --- CELESTIAL & DIVINE (1 in 1M+) ---
  { id: 'a70', name: 'Aetheria Crown', chance: 5000000, baseValue: 500000000, tier: RarityTier.CELESTIAL, color: '#60a5fa' },
  { id: 'a80', name: 'Divine Mandate', chance: 10000000, baseValue: 2000000000, tier: RarityTier.DIVINE, color: '#ffffff' },
  { id: 'a90', name: 'Origin Spark', chance: 50000000, baseValue: 10000000000, tier: RarityTier.BEYOND, color: '#f43f5e' },
  { id: 'a91', name: 'Zenith Gate', chance: 100000000, baseValue: 50000000000, tier: RarityTier.ZENITH, color: '#fbbf24' },
  { id: 'a92', name: 'Ultimate Singularity', chance: 500000000, baseValue: 1000000000000, tier: RarityTier.SINGULARITY, color: '#ff00ff' },
];

export const DICES: Dice[] = [
  { id: 'd1', name: 'Spirit Branch', luckMultiplier: 1.0, cost: 200, color: '#8b4513', description: 'Cành cây khô chứa chút linh lực.' },
  { id: 'd2', name: 'Iron Talisman', luckMultiplier: 2.0, cost: 1500, color: '#94a3b8', description: 'Lá bùa sắt đúc thủ công.' },
  { id: 'd3', name: 'Silver Compass', luckMultiplier: 3.5, cost: 8000, color: '#e2e8f0', description: 'La bàn bạc chỉ hướng vận may.' },
  { id: 'd4', name: 'Jade Totem', luckMultiplier: 6.0, cost: 35000, color: '#10b981', description: 'Vật phẩm thờ phụng của bộ lạc.' },
  { id: 'd5', name: 'Obsidian Mirror', luckMultiplier: 10.0, cost: 120000, color: '#1e293b', description: 'Gương đen phản chiếu chân lý.' },
  { id: 'd6', name: 'Dragon Bone', luckMultiplier: 18.0, cost: 500000, color: '#fef3c7', description: 'Mảnh xương rồng cổ đại.' },
  { id: 'd7', name: 'Aether Lens', luckMultiplier: 30.0, cost: 2000000, color: '#60a5fa', description: 'Thấu kính nhìn thấu thực tại.' },
  { id: 'd8', name: 'Void Candle', luckMultiplier: 55.0, cost: 10000000, color: '#4c1d95', description: 'Ngọn nến cháy bằng hư không.' },
  { id: 'd9', name: 'Star-Fall Core', luckMultiplier: 100.0, cost: 50000000, color: '#c084fc', description: 'Lõi thiên thạch rơi từ trời cao.' },
  { id: 'd10', name: 'Phoenix Heart', luckMultiplier: 250.0, cost: 250000000, color: '#f43f5e', description: 'Trái tim rực cháy sự sống.' },
  { id: 'd11', name: 'Sun Shard', luckMultiplier: 600.0, cost: 1500000000, color: '#fbbf24', description: 'Mảnh vỡ tinh tú nguyên thủy.' },
  { id: 'd12', name: 'Chronos Crystal', luckMultiplier: 1500.0, cost: 10000000000, color: '#ffffff', description: 'Pha lê kiểm soát dòng thời gian.' },
];

export const PET_EGGS = [
  { id: 'e0', name: 'Astral Egg', cost: 5000, pets: ['p1', 'p2'] },
  { id: 'e1', name: 'Deep Sea Egg', cost: 50000, pets: ['p3', 'p4'] },
  { id: 'e2', name: 'Volcanic Egg', cost: 500000, pets: ['p5', 'p6'] },
  { id: 'e3', name: 'Sky Egg', cost: 5000000, pets: ['p7', 'p8'] },
  { id: 'e4', name: 'Void Egg', cost: 100000000, pets: ['p9', 'p10'] },
  { id: 'e5', name: 'Divine Egg', cost: 2000000000, pets: ['p11', 'p12'] },
];

export const PETS: Pet[] = [
  { id: 'p1', name: 'Mana Slime', luckBoost: 0.05, rarity: RarityTier.COMMON, color: '#4ade80' },
  { id: 'p2', name: 'Star Moth', luckBoost: 0.12, rarity: RarityTier.UNCOMMON, color: '#cbd5e1' },
  { id: 'p3', name: 'Coral Crab', luckBoost: 0.25, rarity: RarityTier.UNCOMMON, color: '#f87171' },
  { id: 'p4', name: 'Abyss Eel', luckBoost: 0.55, rarity: RarityTier.RARE, color: '#3b82f6' },
  { id: 'p5', name: 'Magma Pup', luckBoost: 1.1, rarity: RarityTier.RARE, color: '#f97316' },
  { id: 'p6', name: 'Flame Phoenix', luckBoost: 2.5, rarity: RarityTier.EPIC, color: '#ef4444' },
  { id: 'p7', name: 'Wind Hawk', luckBoost: 5.0, rarity: RarityTier.EPIC, color: '#60a5fa' },
  { id: 'p8', name: 'Storm Gryphon', luckBoost: 12.0, rarity: RarityTier.LEGENDARY, color: '#fbbf24' },
  { id: 'p9', name: 'Shadow Stalker', luckBoost: 25.0, rarity: RarityTier.LEGENDARY, color: '#1e1b4b' },
  { id: 'p10', name: 'Void Devourer', luckBoost: 60.0, rarity: RarityTier.MYTHICAL, color: '#c084fc' },
  { id: 'p11', name: 'Celestial Kirin', luckBoost: 150.0, rarity: RarityTier.DIVINE, color: '#ffffff' },
  { id: 'p12', name: 'Elder Dragon', luckBoost: 500.0, rarity: RarityTier.BEYOND, color: '#d4af37' },
];
