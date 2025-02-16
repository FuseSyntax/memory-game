import { CardType } from "../../components/Card";

export interface GameState {
    id: string;
    timestamp: number;
    cards: CardType[];
    moves: number;
    time: number;
    flipped: number[];
    gameOver: boolean;
  }