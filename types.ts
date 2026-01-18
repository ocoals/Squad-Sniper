export interface Player {
  id: string;
  name: string;
  role: string;
  shortRole?: string;
  number: number;
  color: string;
}

export interface SoundEffect {
  play: () => void;
}
