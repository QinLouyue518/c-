export interface GridState {
  rows: number;
  cols: number;
  data: number[][];
}

export interface SimulationStep {
  highlightHorizontal: { r: number, c: number }[];
  highlightVertical: { r: number, c: number }[];
  finalGrid: number[][];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum TutorialStage {
  INTRO = 'intro',
  DATA_STRUCTURE = 'struct',
  ALGORITHM_LOGIC = 'logic',
  SIMULATION = 'sim',
  CODE_HINTS = 'code'
}
