
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ARTIFACTS, DICES, PETS, MUTATIONS, PET_EGGS } from './constants';
import { Artifact, Dice, Pet, UserStats, InventoryArtifact, RarityTier } from './types';
import { generateAuraLore } from './services/geminiService';

const translations = {
  vi: {
    manifest: 'Khởi Tạo',
    alchemy: 'Giả Kim',
    altar: 'Tế Đàn',
    grimoire: 'Grimoire',
    archives: 'Lưu Trữ',
    bazaar: 'Chợ Đen',
    familiars: 'Linh Thú',
    ascend: 'Thăng Hoa',
    mana: 'Năng Lượng',
    fortune: 'Vận May',
    autoRoll: 'Tự Động',
    burnBelow: 'Hóa Giải Dưới:',
    channeling: 'Đang Triệu Hồi...',
    enrolled: 'ĐÃ KHẢM',
    none: 'Không',
    burn: 'Hóa Giải?',
    sacrifice: 'Hiến Tế',
    summon: 'Triệu Hồi',
    transcend: 'Thăng Hoa',
    repeat: 'Làm Lại',
    claim: 'Tiếp Nhận Thiên Mệnh',
    prestige: 'Đẳng Cấp',
    manaPerSec: 'Mana/giây',
    luck: 'May Mắn',
    stock: 'Kho:',
    cost: 'Chi Phí:',
    rarity: 'Độ Hiếm 1 trên',
    inscribing: 'Đang ghi chép vận mệnh...',
    best: 'Khảm Đồ Tốt Nhất',
    burnCommons: 'Hóa Giải Đồ Thường',
    unknown: 'Cổ Vật Bí Ẩn',
    close: 'Đóng Lại',
    empty: 'Trống',
    restockIn: 'Nhập hàng sau:',
    rebirthBenefits: 'Quyền Lợi Vĩnh Viễn',
    benefitSlot: 'Slot Tế Đàn',
    benefitLuck: 'May Mắn',
    benefitIncome: 'Mana Thu Hoạch',
    rebirthWarn: 'Dữ liệu vật phẩm & nâng cấp sẽ được làm mới.',
    rebirthTitle: 'Vượt Qua Luân Hồi'
  },
  en: {
    manifest: 'Manifest',
    alchemy: 'Alchemy',
    altar: 'Altar',
    grimoire: 'Grimoire',
    archives: 'Archives',
    bazaar: 'Bazaar',
    familiars: 'Familiars',
    ascend: 'Ascend',
    mana: 'Mana Essence',
    fortune: 'Fortune',
    autoRoll: 'Auto Manifest',
    burnBelow: 'Burn Below:',
    channeling: 'Channeling...',
    enrolled: 'ENSHRINED',
    none: 'None',
    burn: 'Burn?',
    sacrifice: 'Sacrifice',
    summon: 'Summon',
    transcend: 'Transcend',
    repeat: 'Repeat',
    claim: 'Claim Destiny',
    prestige: 'Prestige',
    manaPerSec: 'Mana/sec',
    luck: 'Luck',
    stock: 'Stock:',
    cost: 'Cost:',
    rarity: 'Rarity 1 in',
    inscribing: 'Inscribing fate...',
    best: 'Enshrine Best',
    burnCommons: 'Burn Commons',
    unknown: 'Unknown Artifact',
    close: 'Close',
    empty: 'Empty',
    restockIn: 'Restock in:',
    rebirthBenefits: 'Permanent Benefits',
    benefitSlot: 'Altar Slot',
    benefitLuck: 'Luck Boost',
    benefitIncome: 'Mana Multiplier',
    rebirthWarn: 'Items and Upgrades will be reset for a new beginning.',
    rebirthTitle: 'Ascend Beyond'
  }
};

const ManaParticles: React.FC<{ color: string; count?: number; size?: number }> = ({ color, count = 10, size = 3 }) => (
  <div className="sparkle-container">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="sparkle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: color, animationDelay: `${Math.random() * 3}s`, width: `${Math.random() * size + 1}px`, height: `${Math.random() * size + 1}px`, boxShadow: `0 0 12px ${color}` }} />
    ))}
  </div>
);

const getArtifactIcon = (tier: RarityTier) => {
  const mapping: Record<string, string> = {
    [RarityTier.COMMON]: 'fa-gem',
    [RarityTier.UNCOMMON]: 'fa-ring',
    [RarityTier.RARE]: 'fa-scroll',
    [RarityTier.EPIC]: 'fa-ankh',
    [RarityTier.LEGENDARY]: 'fa-crown',
    [RarityTier.MYTHICAL]: 'fa-eye',
    [RarityTier.CELESTIAL]: 'fa-sun',
    [RarityTier.DIVINE]: 'fa-khanda',
    [RarityTier.BEYOND]: 'fa-star-of-david',
    [RarityTier.ZENITH]: 'fa-dharmachakra',
    [RarityTier.SINGULARITY]: 'fa-circle-nodes'
  };
  return mapping[tier] || 'fa-gem';
};

export default function App() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const t = translations[lang];

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('rng_ethereal_v12_stats');
    if (saved) return JSON.parse(saved);
    return {
      money: 1000,
      totalRolls: 0,
      activeArtifactIds: Array(6).fill(null),
      ownedDice: { 'd1': 5 },
      ownedPets: [],
      rebirths: 0,
      discoveredArtifactIds: [],
      lastUpdate: Date.now(),
      upgrades: { luckLevel: 0, speedLevel: 0, moneyLevel: 0 },
      settings: { autoRoll: false, autoBurnTier: null, selectedDiceId: 'd1' }
    };
  });

  const [inventory, setInventory] = useState<InventoryArtifact[]>(() => {
    const saved = localStorage.getItem('rng_ethereal_v12_inv');
    return saved ? JSON.parse(saved) : [];
  });

  const [marketStock, setMarketStock] = useState<Record<string, number>>({});
  const [marketTimer, setMarketTimer] = useState(180);

  const refreshMarket = useCallback(() => {
    const newStock: Record<string, number> = {};
    DICES.forEach(d => {
      if (d.id === 'd1' || d.id === 'd2') {
        newStock[d.id] = Math.floor(Math.random() * 11) + 5;
      } else {
        if (Math.random() < 0.35) {
          newStock[d.id] = Math.floor(Math.random() * 5) + 1;
        } else {
          newStock[d.id] = 0;
        }
      }
    });
    setMarketStock(newStock);
    setMarketTimer(180);
  }, []);

  useEffect(() => { refreshMarket(); }, [refreshMarket]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTimer(prev => {
        if (prev <= 1) { refreshMarket(); return 180; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshMarket]);

  const [isRolling, setIsRolling] = useState(false);
  const [rolledItem, setRolledItem] = useState<InventoryArtifact | null>(null);
  const [showCutscene, setShowCutscene] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'forge' | 'inv' | 'pets' | 'roll' | 'rebirth' | 'index' | 'lab'>('roll');
  const [sortMethod, setSortMethod] = useState<'value' | 'rarity' | 'alpha'>('value');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const autoRollTimerRef = useRef<any>(null);
  const [selectedArtifactForLore, setSelectedArtifactForLore] = useState<Artifact | null>(null);
  const [currentLore, setCurrentLore] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('rng_ethereal_v12_stats', JSON.stringify(stats));
    localStorage.setItem('rng_ethereal_v12_inv', JSON.stringify(inventory));
  }, [stats, inventory]);

  const getLuckMultiplier = useCallback(() => 1 + (stats.upgrades.luckLevel * 0.15), [stats.upgrades.luckLevel]);
  const getRollCooldown = useCallback(() => Math.max(80, 1100 - (stats.upgrades.speedLevel * 100)), [stats.upgrades.speedLevel]);
  const getIncomeMultiplier = useCallback(() => (1 + stats.rebirths * 0.25) * (1 + stats.upgrades.moneyLevel * 0.2), [stats.rebirths, stats.upgrades.moneyLevel]);

  const getIncomePerSec = useCallback(() => {
    let baseIncome = 0;
    stats.activeArtifactIds.forEach(instanceId => {
      if (instanceId) {
        const item = inventory.find(inv => inv.instanceId === instanceId);
        if (item) baseIncome += item.value;
      }
    });
    return baseIncome * getIncomeMultiplier();
  }, [stats.activeArtifactIds, inventory, getIncomeMultiplier]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({ ...prev, money: prev.money + getIncomePerSec() }));
    }, 1000);
    return () => clearInterval(interval);
  }, [getIncomePerSec]);

  const getTotalLuck = useCallback(() => {
    let boost = 1.0;
    const uniqueOwnedPetIds = Array.from(new Set(stats.ownedPets));
    uniqueOwnedPetIds.forEach(id => {
      const pet = PETS.find(p => p.id === id);
      if (pet) boost += pet.luckBoost;
    });
    return boost * (1 + (stats.rebirths * 0.1)) * getLuckMultiplier();
  }, [stats.ownedPets, stats.rebirths, getLuckMultiplier]);

  const sortedInventory = useMemo(() => {
    const sorted = [...inventory];
    if (sortMethod === 'value') return sorted.sort((a, b) => b.value - a.value);
    if (sortMethod === 'rarity') {
      const rarityOrder = Object.values(RarityTier);
      return sorted.sort((a, b) => {
        const artA = ARTIFACTS.find(art => art.id === a.artifactId);
        const artB = ARTIFACTS.find(art => art.id === b.artifactId);
        return rarityOrder.indexOf(artB?.tier || RarityTier.COMMON) - rarityOrder.indexOf(artA?.tier || RarityTier.COMMON);
      });
    }
    if (sortMethod === 'alpha') return sorted.sort((a, b) => (ARTIFACTS.find(art => art.id === a.artifactId)?.name || '').localeCompare(ARTIFACTS.find(art => art.id === b.artifactId)?.name || ''));
    return sorted;
  }, [inventory, sortMethod]);

  const handleRoll = async (diceId: string, isAuto: boolean = false) => {
    const diceCount = stats.ownedDice[diceId] || 0;
    if (isRolling || diceCount <= 0) {
        if (isAuto) setStats(prev => ({ ...prev, settings: { ...prev.settings, autoRoll: false } }));
        return;
    }

    setIsRolling(true);
    if (!isAuto) { setRolledItem(null); setShowCutscene(false); }

    const dice = DICES.find(d => d.id === diceId)!;
    const totalLuck = getTotalLuck() * dice.luckMultiplier;

    setStats(prev => ({
      ...prev,
      ownedDice: { ...prev.ownedDice, [diceId]: Math.max(0, (prev.ownedDice[diceId] || 0) - 1) },
      totalRolls: prev.totalRolls + 1
    }));

    const sorted = [...ARTIFACTS].sort((a, b) => b.chance - a.chance);
    let selected: Artifact = ARTIFACTS[0];
    for (const art of sorted) {
      if (Math.random() <= (1 / (art.chance / totalLuck))) { selected = art; break; }
    }

    let mutation;
    let val = selected.baseValue;
    if (Math.random() < 0.1) {
      mutation = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];
      val *= mutation.multiplier;
    }

    const newItem: InventoryArtifact = {
      instanceId: Math.random().toString(36).substr(2, 9),
      artifactId: selected.id,
      mutationName: mutation?.name,
      value: Math.floor(val)
    };

    const rarityOrder = Object.values(RarityTier);
    const shouldBurn = stats.settings.autoBurnTier !== null && rarityOrder.indexOf(selected.tier) <= rarityOrder.indexOf(stats.settings.autoBurnTier!);

    if (!shouldBurn) setInventory(prev => [newItem, ...prev]);
    else setStats(prev => ({ ...prev, money: prev.money + (newItem.value * 3) }));

    setRolledItem(newItem);
    setStats(prev => {
      if (!prev.discoveredArtifactIds.includes(selected.id)) return { ...prev, discoveredArtifactIds: [...prev.discoveredArtifactIds, selected.id] };
      return prev;
    });

    setTimeout(() => {
        setIsRolling(false);
        if (!isAuto && selected.chance >= 1000) setShowCutscene(true);
    }, isAuto ? 50 : 800);
  };

  useEffect(() => {
    if (stats.settings.autoRoll && !isRolling) {
        const diceId = stats.settings.selectedDiceId;
        if ((stats.ownedDice[diceId] || 0) > 0) {
            autoRollTimerRef.current = setTimeout(() => handleRoll(diceId, true), getRollCooldown());
        } else {
            setStats(prev => ({ ...prev, settings: { ...prev.settings, autoRoll: false } }));
        }
    }
    return () => clearTimeout(autoRollTimerRef.current);
  }, [stats.settings.autoRoll, isRolling, stats.ownedDice, stats.settings.selectedDiceId, getRollCooldown]);

  const equipOrUnequip = useCallback((instanceId: string) => {
    setStats(prev => {
      const newSlots = [...prev.activeArtifactIds];
      const slotIndex = newSlots.indexOf(instanceId);
      if (slotIndex !== -1) newSlots[slotIndex] = null;
      else {
        const emptyIndex = newSlots.indexOf(null);
        if (emptyIndex !== -1) newSlots[emptyIndex] = instanceId;
      }
      return { ...prev, activeArtifactIds: newSlots };
    });
  }, []);

  const confirmDelete = (instanceId: string) => {
    if (deletingId === instanceId) {
      setInventory(prev => prev.filter(item => item.instanceId !== instanceId));
      setDeletingId(null);
    } else {
      setDeletingId(instanceId);
      setTimeout(() => setDeletingId(prev => prev === instanceId ? null : prev), 2500);
    }
  };

  const showLore = async (art: Artifact) => {
    if (!stats.discoveredArtifactIds.includes(art.id)) return;
    setSelectedArtifactForLore(art);
    setCurrentLore(null);
    const lore = await generateAuraLore(art.name, art.chance);
    setCurrentLore(lore);
  };

  const magicRings = useMemo(() => {
    const totalSlots = stats.activeArtifactIds.length;
    const rings = [];
    let currentSlot = 0;
    let ringIdx = 0;
    
    while (currentSlot < totalSlots) {
      const slotsInRing = ringIdx === 0 ? 3 : 5;
      const ringSlots = stats.activeArtifactIds.slice(currentSlot, currentSlot + slotsInRing);
      rings.push({
        radius: 120 + ringIdx * 110,
        slots: ringSlots,
        startIdx: currentSlot,
        isCCW: ringIdx % 2 !== 0
      });
      currentSlot += slotsInRing;
      ringIdx++;
    }
    return rings;
  }, [stats.activeArtifactIds]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden text-[#f8fafc]">
      
      <button onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')} className="fixed top-6 left-1/2 -translate-x-1/2 z-[120] glass px-4 py-1 border border-[#d4af37]/30 text-[10px] heading-font text-[#d4af37] uppercase tracking-widest hover:bg-[#d4af37]/10 transition-all">
        {lang === 'vi' ? 'TIẾNG VIỆT' : 'ENGLISH'}
      </button>

      {showCutscene && rolledItem && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center cutscene-bg ${ARTIFACTS.find(a => a.id === rolledItem.artifactId)!.chance >= 10000 ? 'animate-shake' : ''}`}>
          <div className="flex flex-col items-center animate-aura-float text-center px-6">
            <div className="heading-font text-[#d4af37] text-sm uppercase tracking-[0.5em] mb-4">Divine Prophecy</div>
            <h2 className={`heading-font text-6xl md:text-9xl font-black italic tracking-tighter glow-text mb-4 ${ARTIFACTS.find(a => a.id === rolledItem.artifactId)!.tier === RarityTier.SINGULARITY ? 'rainbow-glow' : ''}`} style={{ color: ARTIFACTS.find(a => a.id === rolledItem.artifactId)?.color }}>
              {rolledItem.mutationName && <span className="text-2xl block mb-2 opacity-70 italic">{rolledItem.mutationName}</span>}
              {ARTIFACTS.find(a => a.id === rolledItem.artifactId)?.name}
            </h2>
            <button onClick={() => setShowCutscene(false)} className="mt-16 px-12 py-3 border border-[#d4af37] text-[#d4af37] heading-font text-xs uppercase tracking-[0.4em] hover:bg-[#d4af37]/10 transition-all">{t.claim}</button>
          </div>
        </div>
      )}

      {selectedArtifactForLore && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedArtifactForLore(null)}>
          <div className="glass max-w-lg w-full p-12 mystic-border flex flex-col items-center text-center gap-6" onClick={e => e.stopPropagation()}>
            <i className={`fas ${getArtifactIcon(selectedArtifactForLore.tier)} text-6xl text-[#d4af37]`}></i>
            <h3 className="heading-font text-4xl text-[#d4af37] uppercase glow-text">{selectedArtifactForLore.name}</h3>
            <p className="italic text-2xl leading-relaxed text-slate-300 font-serif">"{currentLore || t.inscribing}"</p>
            <div className="text-[10px] heading-font uppercase text-[#d4af37]/50 tracking-widest">{t.rarity}: {selectedArtifactForLore.chance.toLocaleString()}</div>
            <button onClick={() => setSelectedArtifactForLore(null)} className="mt-4 px-8 py-3 border border-white/10 text-[10px] uppercase tracking-widest hover:border-white/30">{t.close}</button>
          </div>
        </div>
      )}

      <div className="p-6 glass border-b border-[#d4af37]/20 flex justify-between items-center z-20">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.3)]"><i className="fas fa-moon"></i></div>
          <div>
            <h1 className="heading-font text-3xl font-bold text-white uppercase tracking-wider">Ethereal<span className="text-[#d4af37]">.RNG</span></h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#d4af37]/60">{t.prestige} {stats.rebirths}</p>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <div className="text-right">
            <div className="text-[9px] uppercase text-[#d4af37]/60 tracking-widest mb-1 font-black">{t.mana}</div>
            <div className="text-2xl heading-font text-[#d4af37] flex items-center gap-2">{Math.floor(stats.money).toLocaleString()} <i className="fas fa-coins text-sm opacity-50"></i></div>
            <div className="text-[10px] text-emerald-400/60 font-mono tracking-tighter">+{getIncomePerSec().toLocaleString()} /s</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] uppercase text-[#d4af37]/60 tracking-widest mb-1 font-black">{t.fortune}</div>
            <div className="text-2xl heading-font text-blue-400">{getTotalLuck().toFixed(2)}<span className="text-xs opacity-50 ml-1">x</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 glass border-r border-[#d4af37]/20 flex flex-col items-center py-10 gap-8">
          {[
            { id: 'roll', icon: 'fa-wand-sparkles', label: t.manifest },
            { id: 'lab', icon: 'fa-mortar-pestle', label: t.alchemy },
            { id: 'forge', icon: 'fa-hat-wizard', label: t.altar },
            { id: 'inv', icon: 'fa-book-open', label: t.grimoire },
            { id: 'index', icon: 'fa-scroll', label: t.archives },
            { id: 'shop', icon: 'fa-gem', label: t.bazaar },
            { id: 'pets', icon: 'fa-dragon', label: t.familiars },
            { id: 'rebirth', icon: 'fa-infinity', label: t.ascend },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setRolledItem(null); }} className={`flex flex-col items-center gap-2 transition-all group ${activeTab === tab.id ? 'text-[#d4af37]' : 'text-slate-600 hover:text-slate-400'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-[#d4af37]/10 border border-[#d4af37]/30 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-transparent group-hover:bg-white/5'}`}>
                <i className={`fas ${tab.icon} text-lg`}></i>
              </div>
              <span className="text-[7px] uppercase font-bold tracking-widest font-sans">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
          
          {activeTab === 'roll' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col p-8">
              <div className="mb-10 flex justify-between items-center">
                <h2 className="heading-font text-4xl text-white uppercase italic">{lang === 'vi' ? 'Linh Hồn Vũ Trụ' : 'Celestial Resonance'}</h2>
                <div className="flex gap-4">
                    <button onClick={() => setStats(prev => ({ ...prev, settings: { ...prev.settings, autoRoll: !prev.settings.autoRoll } }))} className={`px-6 py-3 border transition-all flex items-center gap-3 ${stats.settings.autoRoll ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${stats.settings.autoRoll ? 'bg-[#d4af37] animate-ping' : 'bg-slate-700'}`}></div>
                        <span className="heading-font text-[10px] uppercase tracking-widest">{t.autoRoll}</span>
                    </button>
                    <div className="flex items-center glass p-2 border border-[#d4af37]/20">
                        <select value={stats.settings.autoBurnTier || ''} onChange={(e) => setStats(prev => ({ ...prev, settings: { ...prev.settings, autoBurnTier: (e.target.value as RarityTier) || null } }))} className="bg-transparent text-[10px] heading-font text-[#d4af37] outline-none cursor-pointer" >
                            <option value="">{t.burnBelow} {t.none}</option>
                            {Object.values(RarityTier).slice(0, 4).map(t_val => <option key={t_val} value={t_val} className="bg-slate-900">{t_val}</option>)}
                        </select>
                    </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center rounded-none border border-[#d4af37]/10 p-16 relative overflow-hidden">
                {isRolling && !stats.settings.autoRoll ? (
                  <div className="flex flex-col items-center gap-8 animate-pulse">
                    <div className="w-40 h-40 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#d4af37]/30 rounded-full animate-spin"></div>
                        <i className="fas fa-sparkles text-4xl text-[#d4af37]"></i>
                    </div>
                    <div className="heading-font text-2xl text-[#d4af37] tracking-[0.3em] uppercase">{t.channeling}</div>
                  </div>
                ) : rolledItem ? (
                  <div className="flex flex-col items-center animate-aura-float text-center max-w-sm z-10">
                    {(() => {
                      const art = ARTIFACTS.find(a => a.id === rolledItem.artifactId)!;
                      return (
                        <>
                          <ManaParticles color={art.color} count={20} />
                          <i className={`fas ${getArtifactIcon(art.tier)} text-8xl mb-10`} style={{ color: art.color }}></i>
                          <h3 className="heading-font text-5xl font-bold tracking-tight text-white uppercase">{rolledItem.mutationName && <span className="text-xl block mb-2 opacity-60 italic">{rolledItem.mutationName}</span>}{art.name}</h3>
                          <div className="flex gap-4 w-full justify-center mt-12">
                            <button onClick={() => setRolledItem(null)} className="flex-1 px-8 py-5 border border-[#d4af37] text-[#d4af37] heading-font text-[10px] uppercase tracking-widest hover:bg-[#d4af37]/10 transition-all">{t.repeat}</button>
                            <button onClick={() => { equipOrUnequip(rolledItem.instanceId); setRolledItem(null); }} className="flex-1 px-8 py-5 bg-[#d4af37] text-black heading-font text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">{t.sacrifice}</button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-h-[500px] overflow-y-auto p-6 custom-scrollbar z-10">
                    {DICES.map(dice => {
                      const count = stats.ownedDice[dice.id] || 0;
                      if (count <= 0) return null;
                      return (
                        <button key={dice.id} onClick={() => { handleRoll(dice.id); setStats(prev => ({ ...prev, settings: { ...prev.settings, selectedDiceId: dice.id } })) }} className={`group glass p-6 rounded-none border transition-all flex flex-col items-center gap-3 relative ${stats.settings.selectedDiceId === dice.id ? 'border-[#d4af37] bg-[#d4af37]/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-[#d4af37]/10 hover:border-[#d4af37]/30'}`}>
                          <div className="absolute top-2 right-2 heading-font text-[9px] text-[#d4af37]">x{count}</div>
                          <i className="fas fa-dice-d20 text-3xl" style={{ color: dice.color }}></i>
                          <div className="heading-font text-[9px] text-white uppercase truncate w-24">{dice.name}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'forge' && (
            <div className="w-full min-h-full flex flex-col items-center justify-center p-12 overflow-hidden relative">
              <h2 className="heading-font text-5xl text-white uppercase italic mb-8 z-10">{t.altar}</h2>
              <p className="text-[10px] heading-font text-[#d4af37] uppercase tracking-[0.5em] mb-12 opacity-50 z-10">Eternal Resonance Chamber</p>
              
              <div className="relative flex items-center justify-center w-[800px] h-[800px] transition-all duration-1000">
                <div className="absolute w-32 h-32 rounded-full border-4 border-[#d4af37] flex items-center justify-center bg-[#d4af37]/5 z-20 shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-pulse-slow">
                   <i className="fas fa-atom text-4xl text-[#d4af37]"></i>
                </div>

                {magicRings.map((ring, rIdx) => (
                  <div key={rIdx} 
                    className={`absolute rounded-full border border-[#d4af37]/20 flex items-center justify-center transition-all duration-1000 ${ring.isCCW ? 'animate-rotate-ccw' : 'animate-magic-circle'}`}
                    style={{ width: `${ring.radius * 2}px`, height: `${ring.radius * 2}px` }}
                  >
                    {ring.slots.map((instanceId, sIdx) => {
                      const item = inventory.find(inv => inv.instanceId === instanceId);
                      const artifact = item ? ARTIFACTS.find(a => a.id === item.artifactId) : null;
                      const angle = (sIdx / ring.slots.length) * 2 * Math.PI;
                      const x = Math.cos(angle) * ring.radius;
                      const y = Math.sin(angle) * ring.radius;

                      return (
                        <div 
                          key={sIdx}
                          className="absolute flex items-center justify-center group"
                          style={{ 
                            transform: `translate(${x}px, ${y}px) rotate(${ring.isCCW ? '' : '-'}0deg)`, 
                            transition: 'all 0.5s ease'
                          }}
                        >
                          <div 
                            onClick={() => { if (instanceId) equipOrUnequip(instanceId); }}
                            className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-125 hover:z-30 shadow-2xl ${item ? 'bg-black/80' : 'bg-[#d4af37]/5 border-dashed border-[#d4af37]/10'}`}
                            style={{ 
                              borderColor: artifact?.color || 'rgba(212,175,55,0.2)',
                              color: artifact?.color || '#334155',
                              boxShadow: item ? `0 0 25px ${artifact?.color}44` : 'none'
                            }}
                          >
                            {item && artifact ? (
                              <>
                                <i className={`fas ${getArtifactIcon(artifact.tier)} text-2xl mb-1 ${artifact.tier === RarityTier.SINGULARITY ? 'rainbow-glow' : ''}`}></i>
                                <div className="text-[6px] heading-font uppercase text-white truncate px-2 text-center">{artifact.name}</div>
                                <div className="text-[5px] text-emerald-400 mt-1">+{Math.floor(item.value * getIncomeMultiplier())}</div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center opacity-30">
                                <i className="fas fa-plus text-xs mb-1"></i>
                                <span className="text-[5px] heading-font uppercase">{t.empty}</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute w-[200px] h-px bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -z-10 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      );
                    })}
                    <div className="absolute inset-0 border border-[#d4af37]/10 rounded-full scale-[1.05] pointer-events-none"></div>
                  </div>
                ))}
                
                <div className="absolute w-[1000px] h-[1000px] border border-[#d4af37]/5 rounded-full animate-rotate-ccw opacity-10"></div>
                <div className="absolute w-[1200px] h-[1200px] border-2 border-dashed border-[#d4af37]/5 rounded-full animate-magic-circle opacity-5"></div>
              </div>
            </div>
          )}

          {activeTab === 'inv' && (
            <div className="max-w-7xl mx-auto pb-24 p-8">
               <div className="flex flex-col gap-10 mb-14">
                <div className="flex justify-between items-end">
                  <h2 className="heading-font text-5xl text-white uppercase italic tracking-widest">{t.grimoire}</h2>
                  <div className="flex gap-4">
                    <button onClick={() => {
                        const sorted = [...inventory].sort((a, b) => b.value - a.value);
                        const numSlots = stats.activeArtifactIds.length;
                        setStats(prev => ({ ...prev, activeArtifactIds: [...sorted.slice(0, numSlots).map(i => i.instanceId), ...Array(Math.max(0, numSlots - sorted.length)).fill(null)].slice(0, numSlots) }));
                    }} className="px-8 py-4 border border-emerald-500/40 text-emerald-400 heading-font text-[10px] uppercase hover:bg-emerald-500/10 transition-all">{t.best}</button>
                    <button onClick={() => { if (confirm(t.burnCommons)) setInventory(prev => prev.filter(i => {
                        const art = ARTIFACTS.find(a => a.id === i.artifactId)!;
                        return art.tier !== RarityTier.COMMON || stats.activeArtifactIds.includes(i.instanceId);
                    })); }} className="px-8 py-4 border border-[#d4af37]/30 text-[#d4af37]/60 heading-font text-[10px] uppercase hover:text-[#d4af37] transition-all">{t.burnCommons}</button>
                  </div>
                </div>
                <div className="flex items-center gap-6 glass p-2 w-fit border-[#d4af37]/20">
                  {['value', 'rarity', 'alpha'].map(m => (
                    <button key={m} onClick={() => setSortMethod(m as any)} className={`px-6 py-2 heading-font text-[10px] uppercase transition-all ${sortMethod === m ? 'bg-[#d4af37] text-black shadow-lg' : 'text-[#d4af37]/40 hover:text-[#d4af37]'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {sortedInventory.map((item) => {
                  const art = ARTIFACTS.find(a => a.id === item.artifactId);
                  if (!art) return null;
                  const isActive = stats.activeArtifactIds.includes(item.instanceId);
                  const isDeleting = deletingId === item.instanceId;
                  
                  // Tìm màu của Mutation nếu có
                  const mutationColor = item.mutationName ? MUTATIONS.find(m => m.name === item.mutationName)?.color : 'transparent';

                  return (
                    <div key={item.instanceId} className="relative group">
                      <button 
                        onClick={() => equipOrUnequip(item.instanceId)} 
                        className={`w-full glass p-5 rounded-none border transition-all flex flex-col items-center text-center min-h-[220px] ${isActive ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#d4af37]/10 hover:border-[#d4af37]/60'} ${art.chance >= 1000 ? 'rarity-glow shadow-[0_0_20px_rgba(0,0,0,0.4)]' : ''}`}
                        style={{ boxShadow: art.chance >= 1000 ? `0 0 15px ${art.color}44` : 'none' }}
                      >
                        <i className={`fas ${getArtifactIcon(art.tier)} text-4xl mb-6 ${art.tier === RarityTier.SINGULARITY ? 'rainbow-glow' : ''}`} style={{ color: art.color }}></i>
                        
                        <div className="flex-1 flex flex-col justify-center gap-1 w-full">
                          {item.mutationName && (
                            <span className="text-[9px] heading-font uppercase italic opacity-80 tracking-widest" style={{ color: mutationColor }}>
                              {item.mutationName}
                            </span>
                          )}
                          <div className="heading-font text-xs text-white uppercase break-words px-2 leading-tight">
                            {art.name}
                          </div>
                        </div>

                        <div className="mt-4 w-full pt-3 border-t border-white/5">
                          <div className="text-emerald-400 text-[9px] font-mono italic">
                            +{item.value.toLocaleString()} /s
                          </div>
                          {isActive && (
                            <div className="mt-2 heading-font text-[7px] text-[#d4af37] uppercase tracking-[0.3em] animate-pulse">
                              {t.enrolled}
                            </div>
                          )}
                        </div>
                      </button>

                      {!isActive && (
                        <button 
                          onClick={(e) => { e.preventDefault(); confirmDelete(item.instanceId); }} 
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all shadow-xl z-10 ${isDeleting ? 'bg-red-600 text-white border-red-400 scale-125' : 'bg-slate-900/90 text-red-500 border-red-500/30 hover:bg-red-900 hover:text-white'}`}
                        >
                          {isDeleting ? <span className="text-[7px] font-bold">YES</span> : <i className="fas fa-trash-alt text-[10px]"></i>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'rebirth' && (
            <div className="max-w-4xl mx-auto flex flex-col items-center min-h-full justify-center pb-24 pt-10 px-4">
                 <div className="relative mb-10 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-[#d4af37]/20 rounded-full animate-magic-circle w-[12rem] h-[12rem] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"></div>
                    <i className="fas fa-infinity text-[6rem] md:text-[8rem] text-[#d4af37] animate-aura-float glow-text relative z-10"></i>
                 </div>
                 <h2 className="heading-font text-5xl md:text-6xl text-white uppercase italic mb-8 text-center">{t.rebirthTitle}</h2>
                 
                 <div className="glass p-8 md:p-10 border border-[#d4af37]/30 max-w-2xl w-full relative overflow-hidden mystic-border shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
                    
                    <h3 className="heading-font text-[#d4af37] text-lg uppercase tracking-[0.3em] mb-10 text-center border-b border-[#d4af37]/10 pb-4">{t.rebirthBenefits}</h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="flex flex-col items-center gap-3 text-center group">
                            <div className="w-16 h-16 rounded-full border border-[#d4af37]/20 flex items-center justify-center bg-[#d4af37]/5 group-hover:bg-[#d4af37]/10 transition-all shadow-inner">
                                <i className="fas fa-circle-plus text-[#d4af37] text-xl"></i>
                            </div>
                            <div className="flex flex-col min-h-[40px]">
                                <span className="text-[9px] heading-font uppercase text-[#d4af37] mb-1 leading-none">{t.benefitSlot}</span>
                                <span className="text-white text-[10px] opacity-70 leading-tight">+1 Slot</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 text-center group">
                            <div className="w-16 h-16 rounded-full border border-[#d4af37]/20 flex items-center justify-center bg-[#d4af37]/5 group-hover:bg-[#d4af37]/10 transition-all shadow-inner">
                                <i className="fas fa-wand-magic-sparkles text-[#d4af37] text-xl"></i>
                            </div>
                            <div className="flex flex-col min-h-[40px]">
                                <span className="text-[9px] heading-font uppercase text-[#d4af37] mb-1 leading-none">{t.benefitLuck}</span>
                                <span className="text-white text-[10px] opacity-70 leading-tight">+10% Luck</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 text-center group">
                            <div className="w-16 h-16 rounded-full border border-[#d4af37]/20 flex items-center justify-center bg-[#d4af37]/5 group-hover:bg-[#d4af37]/10 transition-all shadow-inner">
                                <i className="fas fa-coins text-[#d4af37] text-xl"></i>
                            </div>
                            <div className="flex flex-col min-h-[40px]">
                                <span className="text-[9px] heading-font uppercase text-[#d4af37] mb-1 leading-none">{t.benefitIncome}</span>
                                <span className="text-white text-[10px] opacity-70 leading-tight">+25% Mana</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-red-400/70 text-[10px] uppercase tracking-[0.2em] font-black text-center pt-6 border-t border-white/5 italic flex items-center justify-center gap-2">
                        <i className="fas fa-triangle-exclamation"></i>
                        <span>{t.rebirthWarn}</span>
                    </p>
                 </div>

                 <div className="mt-12 w-full max-w-md">
                    <button 
                      onClick={() => {
                        const cost = 5000000 * Math.pow(10, stats.rebirths);
                        if (stats.money >= cost) {
                          if (confirm(t.transcend + "?")) {
                            setStats(prev => ({
                              ...prev,
                              money: 1000,
                              rebirths: prev.rebirths + 1,
                              activeArtifactIds: [...prev.activeArtifactIds, null], 
                              upgrades: { luckLevel: 0, speedLevel: 0, moneyLevel: 0 }
                            }));
                            setInventory([]);
                            setActiveTab('roll');
                          }
                        }
                      }} 
                      className={`w-full px-10 py-6 border-2 heading-font text-2xl uppercase transition-all flex flex-col items-center gap-1 ${stats.money >= 5000000 * Math.pow(10, stats.rebirths) ? 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black shadow-[0_0_40px_rgba(212,175,55,0.2)]' : 'border-white/5 text-slate-800 cursor-not-allowed'}`}
                    >
                      <span>{t.transcend}</span>
                      <span className="text-[11px] opacity-60 normal-case tracking-normal">Requires: {(5000000 * Math.pow(10, stats.rebirths)).toLocaleString()} Mana</span>
                    </button>
                 </div>
            </div>
          )}

          {activeTab === 'shop' && (
             <div className="max-w-6xl mx-auto pb-24 p-8">
                <div className="flex justify-between items-end mb-14">
                    <h2 className="heading-font text-5xl text-white uppercase italic tracking-wider">{t.bazaar}</h2>
                    <div className="text-right">
                        <div className="text-[10px] uppercase text-[#d4af37]/60 tracking-widest mb-1">{t.restockIn}</div>
                        <div className="heading-font text-2xl text-[#d4af37]">{Math.floor(marketTimer / 60)}:{String(marketTimer % 60).padStart(2, '0')}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {DICES.map(dice => {
                        const stock = marketStock[dice.id] || 0;
                        return (
                            <div key={dice.id} className="glass p-8 border border-[#d4af37]/10 flex flex-col items-center text-center gap-4 relative hover:border-[#d4af37]/50 transition-all shadow-xl">
                                {stock > 0 && <div className="absolute top-2 right-2 text-[8px] heading-font text-[#d4af37]">{t.stock} {stock}</div>}
                                <i className="fas fa-dice text-4xl" style={{ color: dice.color }}></i>
                                <div className="heading-font text-[11px] text-white uppercase truncate w-full">{dice.name}</div>
                                <button disabled={stock <= 0 || stats.money < dice.cost} onClick={() => { if (stock > 0 && stats.money >= dice.cost) { setMarketStock(prev => ({ ...prev, [dice.id]: prev[dice.id] - 1 })); setStats(prev => ({ ...prev, money: prev.money - dice.cost, ownedDice: { ...prev.ownedDice, [dice.id]: (prev.ownedDice[dice.id] || 0) + 1 } })); } }} className={`w-full py-2 text-[9px] heading-font border transition-all ${stock > 0 && stats.money >= dice.cost ? 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black shadow-lg' : 'border-white/5 text-slate-800 cursor-not-allowed'}`}>
                                    {stock > 0 ? dice.cost.toLocaleString() : 'SOLD OUT'}
                                </button>
                            </div>
                        )
                    })}
                </div>
             </div>
          )}

          {activeTab === 'lab' && (
             <div className="max-w-4xl mx-auto pb-24 p-8">
                <h2 className="heading-font text-5xl text-white uppercase italic text-center mb-16">{t.alchemy}</h2>
                <div className="space-y-8">
                    {[
                        { type: 'luck', icon: 'fa-star-and-crescent', label: t.luck, level: stats.upgrades.luckLevel },
                        { type: 'speed', icon: 'fa-wind', label: 'Tốc Độ', level: stats.upgrades.speedLevel },
                        { type: 'money', icon: 'fa-scroll', label: 'Hiệu Suất', level: stats.upgrades.moneyLevel }
                    ].map(upgrade => {
                        const cost = 1000 * Math.pow(2.5, upgrade.level);
                        const canAfford = stats.money >= cost;
                        return (
                            <div key={upgrade.type} className="glass p-8 border border-[#d4af37]/10 flex items-center justify-between group hover:border-[#d4af37]/30 transition-all shadow-lg">
                                <div className="flex items-center gap-6">
                                    <i className={`fas ${upgrade.icon} text-3xl text-[#d4af37] shadow-inner`}></i>
                                    <div>
                                        <h4 className="heading-font text-xl text-white">{upgrade.label} (Rank {upgrade.level})</h4>
                                        <p className="text-xs text-slate-500 italic mt-1">Nâng tầm sức mạnh tâm linh vĩnh cửu.</p>
                                    </div>
                                </div>
                                <button onClick={() => { if (canAfford) setStats(prev => ({ ...prev, money: prev.money - cost, upgrades: { ...prev.upgrades, [`${upgrade.type}Level`]: upgrade.level + 1 } })); }} disabled={!canAfford} className={`px-8 py-3 heading-font text-[10px] uppercase border transition-all ${canAfford ? 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black' : 'border-white/5 text-slate-800'}`}>Pay {Math.floor(cost).toLocaleString()}</button>
                            </div>
                        )
                    })}
                </div>
             </div>
          )}

          {activeTab === 'index' && (
            <div className="max-w-7xl mx-auto pb-24 p-8">
              <h2 className="heading-font text-5xl text-white uppercase italic text-center mb-16 tracking-widest">{t.archives}</h2>
              {Object.values(RarityTier).map(tier => {
                  const items = ARTIFACTS.filter(a => a.tier === tier);
                  if (items.length === 0) return null;
                  return (
                    <div key={tier} className="mb-14">
                      <h3 className="heading-font text-[11px] uppercase tracking-[0.5em] text-[#d4af37]/50 mb-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/20"></div>
                        {tier}
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/20"></div>
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 px-2">
                        {items.map(art => {
                          const isDiscovered = stats.discoveredArtifactIds.includes(art.id);
                          return (
                            <div key={art.id} onClick={() => showLore(art)} className={`glass p-4 border transition-all flex flex-col items-center text-center cursor-pointer ${isDiscovered ? 'border-[#d4af37]/30 hover:scale-110 shadow-lg' : 'border-white/5 opacity-20 hover:opacity-40'}`}>
                              <i className={`fas ${getArtifactIcon(art.tier)} text-lg mb-2`} style={{ color: isDiscovered ? art.color : '#334155' }}></i>
                              <div className="heading-font text-[7px] text-white uppercase truncate w-full">{isDiscovered ? art.name : '???'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
              })}
            </div>
          )}

          {activeTab === 'pets' && (
             <div className="max-w-7xl mx-auto pb-24 text-center p-8">
                <h2 className="heading-font text-5xl text-white uppercase italic mb-16">{t.familiars}</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-20 px-4">
                    {PET_EGGS.map(egg => (
                        <button key={egg.id} onClick={() => { if (stats.money >= egg.cost) { const randomPetId = egg.pets[Math.floor(Math.random() * egg.pets.length)]; setStats(prev => ({ ...prev, money: prev.money - egg.cost, ownedPets: [...prev.ownedPets, randomPetId] })); } }} className="glass p-8 border border-[#d4af37]/10 flex flex-col items-center gap-4 hover:border-[#d4af37] transition-all shadow-md hover:shadow-2xl"><i className="fas fa-dragon text-4xl text-white"></i><div className="heading-font text-[10px] text-[#d4af37]">{egg.name}</div><div className="text-[9px] text-white opacity-50">{egg.cost.toLocaleString()}</div></button>
                    ))}
                </div>
                <div className="grid grid-cols-4 md:grid-cols-10 gap-4 px-4">
                    {Array.from(new Set(stats.ownedPets)).map((petId, idx) => {
                        const pet = PETS.find(p => p.id === petId)!;
                        const count = stats.ownedPets.filter(id => id === petId).length;
                        return (<div key={idx} className="glass p-4 border border-white/5 flex flex-col items-center gap-2 relative transition-all hover:scale-110 shadow-sm"><span className="absolute top-1 right-1 text-[8px] text-[#d4af37] font-black">x{count}</span><i className="fas fa-paw text-xl" style={{ color: pet.color }}></i><span className="text-[8px] uppercase heading-font truncate w-full">{pet.name}</span></div>);
                    })}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
