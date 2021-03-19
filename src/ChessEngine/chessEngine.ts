import { BLACK, Chess, Color, Piece, WHITE } from "@lubert/chess.ts";
import { pieceValues } from "./chessConsts";
import { MinMaxNode } from "./minMax";

const maxScore = 1000000;

const getPossibleMoves = (chess: Chess): string[] => {
    return chess.moves();
};

const countPiecePoints = (board: (Piece | null)[][]): number => {
    let score = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = board[i][j];
            if (square) {
                if (square.color === WHITE) {
                    score += pieceValues[square.type];
                } else {
                    score -= pieceValues[square.type];
                }
            }
        }
    }
    return score;
};

const scoreGameFinish = (chess: Chess): number | null => {
    const checkmateScore = chess.turn() === WHITE ? maxScore : -maxScore;
    return chess.inCheckmate()
        ? checkmateScore
        : chess.inStalemate()
        ? 0
        : null;
};

const getBestScoreMoveWithScore = (
    chess: Chess,
    color: Color
): { move: string; score: number } => {
    const moves = chess.moves();
    const fen = chess.fen();

    let bestScore =
        color === WHITE ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    let bestMoves: string[] = [];

    const movesLength = moves.length;

    for (let i = 0; i < movesLength; i++) {
        const move = moves[i];
        const chessWithMove = new Chess(fen);
        chessWithMove.move(move);

        let score = countPiecePoints(chessWithMove.board());

        if (chessWithMove.inStalemate()) {
            score = 0;
        } else if (chessWithMove.inCheckmate()) {
            score =
                color === WHITE
                    ? Number.MAX_SAFE_INTEGER
                    : Number.MIN_SAFE_INTEGER;
        }

        if (score === bestScore) {
            bestMoves.push(move);
        } else if (
            (color === WHITE && score > bestScore) ||
            (color === BLACK && score < bestScore)
        ) {
            bestScore = score;
            bestMoves = [move];
        }
    }

    return { move: selectRandomMove(bestMoves), score: bestScore };
};

const createMinMaxTree = (chess: Chess, maxDepth: number): string => {
    const min = chess.turn() === BLACK;
    const root = new MinMaxNode<string>(min, 0, "");
    const start = new Date().getTime();
    getChildrenPositions(root, chess, maxDepth, 0, min);
    const end = new Date().getTime();
    console.log(end - start);
    const minMaxResult = root.resolve();
    const moveList = minMaxResult.resultArray;

    console.log(minMaxResult.numberOfPositions);

    return moveList[1];
};

const positionScore = (chess: Chess) => {
    const gameFinish = scoreGameFinish(chess);
    if (gameFinish != null) {
        return gameFinish;
    } else {
        const pieces = countPiecePoints(chess.board());
        return pieces;
    }
};

const getChildrenPositions = (
    node: MinMaxNode<string>,
    chess: Chess,
    maxDepth: number,
    depth: number,
    min: boolean
) => {
    const moves = chess.moves();
    if (depth < maxDepth && !chess.gameOver()) {
        const children = [];
        const movesLength = moves.length;

        for (let i = 0; i < movesLength; i++) {
            const move = moves[i];
            const child = new MinMaxNode<string>(!min, depth + 1, move);
            children.push(child);

            const childChess = new Chess(chess.fen());
            childChess.move(move);
            getChildrenPositions(child, childChess, maxDepth, depth + 1, !min);
        }

        node.children = children;
    } else {
        node.score = positionScore(chess);
    }
};

const selectRandomMove = (moves: string[]) => {
    const randomMoveIndex = Math.floor(Math.random() * moves.length);
    const randomMove = moves[randomMoveIndex];

    return randomMove;
};

export const calculateNextMove = (fen: string) => {
    const chess = new Chess(fen);
    const move: string = createMinMaxTree(chess, 3);

    return move;
};
