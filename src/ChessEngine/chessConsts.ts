import { PieceSymbol } from '@lubert/chess.ts'

export const pieceValues: Record<PieceSymbol, number> = {
    'p': 100,
    'n': 270,
    'b': 300,
    'r': 500,
    'q': 900,
    'k': 0
}