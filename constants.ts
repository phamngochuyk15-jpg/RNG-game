
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

const createArtifacts = (): Artifact[] => {
  const list: Artifact[] = [];
  
  // COMMON (25 items)
  const commonNames = ['Sỏi Mòn', 'Cành Khô', 'Cát Sao', 'Bụi Linh Hồn', 'Lá Thu', 'Đá Cuội', 'Vỏ Ốc Vỡ', 'Mảnh Thủy Tinh', 'Đinh Gỉ', 'Rêu Khô', 'Lông Vũ Cũ', 'Hơi Mây', 'Bùn Đất', 'Quả Thông', 'Tảo Biển', 'Hạt Cườm nứt', 'Tro Tàn', 'Giọt Sương', 'Rễ Cây Hóa Đá', 'Lông Thú Mềm', 'Phấn Xám', 'Kim Cong', 'Cỏ Nhọ Nồi', 'Mảnh Sương', 'Trang Sách Rách'];
  commonNames.forEach((n, i) => list.push({ id: `c${i}`, name: n, chance: 2 + i * 0.5, baseValue: 1 + i, tier: RarityTier.COMMON, color: '#94a3b8' }));

  // UNCOMMON (35 items)
  const uncommonNames = ['Tiền Đồng', 'Nhẫn Sắt', 'Chìa Khóa Đồng', 'Túi Da', 'Hạt Ngọc Bích', 'Mũi Tên Obsidian', 'Dải Lụa', 'Còi Thép', 'Xúc Xắc Xương', 'Nhựa Hổ Phách', 'Siro Phong', 'Sợi Chỉ Bạc', 'Răng Sói', 'Da Rắn', 'Móng Cú', 'Mảnh Thạch Anh', 'Đá Lửa', 'Bao Tải Cũ', 'Bào Tử Sắt', 'Quả Cân Chì', 'Chén Thiếc', 'Bó Len', 'Than Hồng', 'Đồng Hồ Cát', 'Dấu Sáp', 'Lọ Mực', 'Bút Lông', 'Chuông Đồng', 'Tượng Đất Sét', 'Thấu Kính Thủy Tinh', 'Mảnh Gương', 'Bu Lông Sắt', 'Tinh Thể Muối', 'Bụi Lưu Huỳnh', 'Lọ Thủy Ngân'];
  uncommonNames.forEach((n, i) => list.push({ id: `u${i}`, name: n, chance: 20 + i * 5, baseValue: 20 + i * 10, tier: RarityTier.UNCOMMON, color: '#64748b' }));

  // RARE (40 items)
  const rareNames = ['La Bàn Bạc', 'Uất Kim Hương Sáng', 'Gai Thạch Anh Tím', 'Ngọc Trai Biển', 'Vảy Rồng', 'Tro Phượng Hoàng', 'Màn Sương Trăng', 'Hồng Ngọc Sao', 'Lõi Đá Mặt Trời', 'Mắt Mithril', 'Mắt Gorgon', 'Mực Kraken', 'Lá Yggdrasil', 'Mảnh Khiên Aegis', 'Răng Nanh Basilisk', 'Sừng Chimera', 'Câu Đố Nhân Sư', 'Lông Vũ Pegasus', 'Tim Hydra', 'Rìu Minotaur', 'Cung Nhân Mã', 'Nhựa Cây Dryad', 'Nước Mắt Undine', 'Dầu Salamander', 'Hơi Thở Sylph', 'Răng Ma Cà Rồng', 'Móng Vuốt Người Sói', 'Xích Ma Quái', 'Biểu Tượng Cung Hoàng Đạo', 'Bảng Đá Cổ Ngữ', 'Con Mắt Huyền Bí', 'Viên Ngọc Tiên Tri', 'Quả Cầu Pha Lê', 'Hoa Hồng Phù Phép', 'Đèn Thần', 'Lọ Điều Ước', 'Chổi Phù Thủy', 'Mảnh Vạc Cũ', 'Mũ Pháp Sư', 'Trang Sách Phép'];
  rareNames.forEach((n, i) => list.push({ id: `r${i}`, name: n, chance: 200 + i * 50, baseValue: 300 + i * 100, tier: RarityTier.RARE, color: '#a855f7' }));

  // EPIC (35 items)
  const epicNames = ['Huy Hiệu Hiệp Sĩ', 'Grimoire Tinh Tú', 'Lông Vũ Valkyrie', 'Giếng Mana', 'Thánh Kiếm Ánh Sáng', 'Khiên Danh Độ', 'Mũ Giáp Quyền Năng', 'Ủng Tốc Độ', 'Găng Tay Sức Mạnh', 'Nhẫn Trí Tuệ', 'Bùa Hộ Mệnh Sự Sống', 'Áo Choàng Bóng Đêm', 'Thắt Lưng Khổng Lồ', 'Vòng Tay Phòng Thủ', 'Quyền Trượng Nhà Vua', 'Vương Miện Gai', 'Gậy Nguyên Tố', 'Búa Công Lý', 'Cung Sao', 'Dao Độc', 'Thương Thiên Đường', 'Đinh Ba Thủy Triều', 'Đàn Lyre Orpheus', 'Lông Cừu Vàng', 'Hộp Pandora', 'Đôi Cánh Icarus', 'Gậy Caduceus', 'Mảnh Mjolnir', 'Mũi Gungnir', 'Chuôi Excalibur', 'Ấn Ký Cổ Đại', 'Lửa Vĩnh Hằng', 'Băng Thanh Khiết', 'Hơi Thở Rồng', 'Máu Titan'];
  epicNames.forEach((n, i) => list.push({ id: `e${i}`, name: n, chance: 2500 + i * 500, baseValue: 10000 + i * 5000, tier: RarityTier.EPIC, color: '#3b82f6' }));

  // LEGENDARY (30 items)
  const legNames = ['Mảnh Kiếm Excalibur', 'Tinh Hoa Mặt Trời', 'Mắt Đá Mặt Trăng', 'Thiên Hà Sụp Đổ', 'Tim Thần Rồng', 'Cành Cây Thế Giới', 'Đá Triết Gia', 'Chén Thánh', 'Rương Thánh Tích', 'Ngọn Thương Định Mệnh', 'Mắt Thần Horus', 'Ankh Vĩnh Cửu', 'Tia Sét Của Zeus', 'Mũ Tàng Hình Hades', 'Đinh Ba Poseidon', 'Búa Hephaestus', 'Cung Artemis', 'Gương Aphrodite', 'Khiên Athena', 'Huy Hiệu Ares', 'Gậy Hermes', 'Sừng Sung Túc', 'Táo Vàng', 'Lọ Ambrosia', 'Nectar Thần Thánh', 'Bản Vẽ Vạn Vật', 'Lời Thề Kim Cương', 'Máu Của Chaos', 'Sợi Chỉ Định Mệnh', 'Hơi Thở Gaia'];
  legNames.forEach((n, i) => list.push({ id: `l${i}`, name: n, chance: 25000 + i * 5000, baseValue: 100000 + i * 50000, tier: RarityTier.LEGENDARY, color: '#fbbf24' }));

  // MYTHICAL (20 items)
  const mythNames = ['Đèn Lồng Hư Không', 'Lõi Tinh Vân', 'Ấn Ký Omega', 'Tia Sáng Alpha', 'Hạt Giống Lỗ Đen', 'Vang Vọng Siêu Tân Tinh', 'Bụi Vũ Trụ', 'Tia Quasar', 'Nhịp Đập Pulsar', 'Cổng Lỗ Sâu', 'Chân Trời Sự Kiện', 'Vật Chất Tối', 'Cầu Phản Vật Chất', 'Bóng Ma Lượng Tử', 'Lý Thuyết Dây', 'Chìa Khóa Đa Vũ Trụ', 'Nghịch Lý Thời Gian', 'Bẻ Cong Thực Tại', 'Mảnh Tồn Tại', 'Sự Hư Vô Tuyệt Đối'];
  mythNames.forEach((n, i) => list.push({ id: `m${i}`, name: n, chance: 200000 + i * 100000, baseValue: 2000000 + i * 1000000, tier: RarityTier.MYTHICAL, color: '#c084fc' }));

  // CELESTIAL & DIVINE (30 items - TĂNG THÊM 15)
  const celDivineNames = [
    'Vương Miện Aetheria', 'Chỉ Dụ Thần Thánh', 'Tia Sáng Khởi Nguyên', 'Cổng Thiên Đỉnh', 'Ngai Vàng Ê-te', 'Hơi Thở Thần Linh', 'Kẻ Dệt Vận Mệnh', 'Lò Rèn Linh Hồn', 'Ánh Sáng Sáng Thế', 'Bóng Tối Kết Thúc', 'Cân Bằng Vĩnh Cửu', 'Sự Im Lặng Vô Tận', 'Tiếng Thét Nguyên Thủy', 'Lời Thì Thầm Cổ Đại', 'Quy Luật Tự Nhiên',
    'Tinh Hoa Tinh Tú', 'Màn Sương Nebula', 'Hợp Âm Vũ Trụ', 'Mắt Thần Odin', 'Lời Nguyền Titan', 'Phước Lành Olympus', 'Trái Tim Gaia', 'Hơi Thở Rồng Thiêng', 'Suối Nguồn Mana', 'Vảy Rồng Thần', 'Lông Vũ Phượng Hoàng Trắng', 'Giọt Lệ Nữ Thần', 'Ấn Ký Sáng Thế', 'Vòng Xoáy Thiên Hà', 'Tâm Điểm Vạn Vật'
  ];
  celDivineNames.forEach((n, i) => {
    const tier = i < 15 ? RarityTier.CELESTIAL : RarityTier.DIVINE;
    list.push({ id: `cd${i}`, name: n, chance: 1500000 + i * 3000000, baseValue: 20000000 + i * 15000000, tier, color: tier === RarityTier.CELESTIAL ? '#60a5fa' : '#ffffff' });
  });

  // BEYOND, ZENITH, SINGULARITY (25 items - TĂNG THÊM 10)
  const finalNames = [
    'Độ Không Tuyệt Đối', 'Vô Hạn Tối Đa', 'Hư Không Thực Sự', 'Điểm Kết Thời Gian', 'Điểm Đầu Vạn Vật', 'Bản Ngã Duy Nhất', 'Điểm Kỳ Dị', 'Vượt Xa Hoàn Hảo', 'Đỉnh Cao Thiên Đỉnh', 'Thực Tại Cuối Cùng', 'Entropy Toàn Phần', 'Hòa Âm Hoàn Mỹ', 'Mã Nguồn Vũ Trụ', 'Bản Thiết Kế Kiến Trúc Sư', 'Lời Nguyện Cuối Cùng',
    'Nhịp Đập Đa Vũ Trụ', 'Ký Ức Thời Không', 'Sợi Chỉ Thực Tại', 'Vùng Đất Không Tên', 'Sự Tồn Tại Tối Thượng', 'Ý Chí Đấng Tạo Hóa', 'Hơi Thở Hư Vô', 'Sự Sụp Đổ Của Logic', 'Vòng Lặp Vĩnh Cửu', 'Cái Kết Tuyệt Đối'
  ];
  finalNames.forEach((n, i) => {
    let tier = RarityTier.BEYOND;
    if (i >= 8) tier = RarityTier.ZENITH;
    if (i >= 16) tier = RarityTier.SINGULARITY;
    list.push({ id: `f${i}`, name: n, chance: 60000000 + i * 80000000, baseValue: 800000000 + i * 700000000, tier, color: tier === RarityTier.SINGULARITY ? '#ff00ff' : (tier === RarityTier.ZENITH ? '#fbbf24' : '#f43f5e') });
  });

  return list;
};

export const ARTIFACTS: Artifact[] = createArtifacts();

export const DICES: Dice[] = [
  { id: 'd1', name: 'Spirit Branch', luckMultiplier: 1.0, cost: 200, color: '#8b4513', description: 'Cành cây chứa chút linh lực.' },
  { id: 'd2', name: 'Iron Talisman', luckMultiplier: 2.0, cost: 1500, color: '#94a3b8', description: 'Lá bùa sắt đúc thủ công.' },
  { id: 'd3', name: 'Silver Compass', luckMultiplier: 3.5, cost: 8000, color: '#e2e8f0', description: 'La bàn bạc chỉ hướng vận may.' },
  { id: 'd4', name: 'Jade Totem', luckMultiplier: 6.0, cost: 35000, color: '#10b981', description: 'Vật phẩm thờ phụng cổ.' },
  { id: 'd5', name: 'Obsidian Mirror', luckMultiplier: 10.0, cost: 120000, color: '#1e293b', description: 'Gương đen phản chiếu chân lý.' },
  { id: 'd6', name: 'Dragon Bone', luckMultiplier: 18.0, cost: 500000, color: '#fef3c7', description: 'Mảnh xương rồng cổ đại.' },
  { id: 'd7', name: 'Aether Lens', luckMultiplier: 30.0, cost: 2000000, color: '#60a5fa', description: 'Thấu kính nhìn thấu thực tại.' },
  { id: 'd8', name: 'Void Candle', luckMultiplier: 55.0, cost: 10000000, color: '#4c1d95', description: 'Ngọn nến cháy bằng hư không.' },
  { id: 'd9', name: 'Star-Fall Core', luckMultiplier: 100.0, cost: 50000000, color: '#c084fc', description: 'Lõi thiên thạch rơi từ trời cao.' },
  { id: 'd10', name: 'Phoenix Heart', luckMultiplier: 250.0, cost: 250000000, color: '#f43f5e', description: 'Trái tim rực cháy sự sống.' },
  { id: 'd11', name: 'Sun Shard', luckMultiplier: 600.0, cost: 1500000000, color: '#fbbf24', description: 'Mảnh vỡ tinh tú nguyên thủy.' },
  { id: 'd12', name: 'Chronos Crystal', luckMultiplier: 1500.0, cost: 10000000000, color: '#ffffff', description: 'Pha lê kiểm soát thời gian.' },
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
