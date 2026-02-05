
export enum RarityTier {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  MYTHICAL = 'Mythical',
  CELESTIAL = 'Celestial',
  DIVINE = 'Divine',
  BEYOND = 'Beyond',
  ZENITH = 'Zenith',
  SINGULARITY = 'Singularity'
}

export interface Mutation {
  name: string;
  multiplier: number;
  color: string;
}

export interface Artifact {
  id: string;
  name: string;
  chance: number; // 1 in X
  baseValue: number; // Money per second
  tier: RarityTier;
  color: string;
  mutation?: Mutation;
}

export interface Dice {
  id: string;
  name: string;
  luckMultiplier: number;
  cost: number;
  color: string;
  description: string;
}

export interface Pet {
  id: string;
  name: string;
  luckBoost: number;
  rarity: RarityTier;
  color: string;
}

export interface UserStats {
  money: number;
  totalRolls: number;
  activeArtifactIds: (string | null)[]; 
  ownedDice: Record<string, number>;
  ownedPets: string[];
  rebirths: number;
  discoveredArtifactIds: string[];
  lastUpdate: number;
  upgrades: {
    luckLevel: number;
    speedLevel: number;
    moneyLevel: number;
  };
  settings: {
    autoRoll: boolean;
    autoBurnTier: RarityTier | null;
    selectedDiceId: string;
  };
}

export interface InventoryArtifact {
  instanceId: string;
  artifactId: string;
  mutationName?: string;
  value: number;
}
