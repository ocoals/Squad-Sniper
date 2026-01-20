export interface Player {
  id: string;
  name: string;
  role: string;
  shortRole?: string;
  number: number;
  color: string;
  customRole?: string; // For extra players to choose their role
  customMission?: string; // For custom mission text
}

export interface SoundEffect {
  play: () => void;
}
