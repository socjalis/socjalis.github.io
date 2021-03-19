import Chessboard, { Piece } from 'chessboardjsx'
import { useState } from 'react'
import { calculateNextMove } from '../ChessEngine/chessEngine';
import { Chess } from '@lubert/chess.ts'
import { PartialMove, Square } from '@lubert/chess.ts/dist/types';

export interface CustomChessboardProps {

}

export const CustomChessboard = (props: CustomChessboardProps) => {
    const [position, setPosition] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [thinking, setThinking] = useState<boolean>(false);
    const [lastMove, setLastMove] = useState<PartialMove | null>(null);
    const [end, setEnd] = useState<boolean>(false);

    // const start =  new Date().getTime();
    // const x = new Chess(position);
    // x.move('e4');
    // x.inCheckmate();
    // x.inDraw();
    // x.inStalemate();
    // x.moves()
    // x.moves()

    // const end = new Date().getTime();
    // console.log(end - start)

    const onDrop = (event: { sourceSquare: Square, targetSquare: Square, piece: Piece }) => {
        const chess = new Chess(position);
        const isMoveLegal = !!chess.move({ from: event.sourceSquare, to: event.targetSquare });
        if (isMoveLegal) {
            setPosition(chess.fen());
            setLastMove({ from: event.sourceSquare, to: event.targetSquare });
            if (!chess.gameOver()) {
                setThinking(true);
                setTimeout(() => {
                    const nextMove = calculateNextMove(chess.fen());
                    chess.move(nextMove);
                    setPosition(chess.fen());
                    setLastMove({ from: event.sourceSquare, to: event.targetSquare });
                    setThinking(false);
                }, 10);
            }
        }
    }

    return <>
        <div className="chessboard">

            <Chessboard
                position={position}
                onDrop={onDrop}
                // squareStyles={lastMove ? {
                //     [lastMove.from]: {
                //         backgroundColor: '#5abb5f'
                //     },
                //     [lastMove.to]: {
                //         backgroundColor: '#5abb5f'
                //     }
                // } : undefined}
            />
        </div>
        <div className="chessboard" style={{ fontSize: '2rem' }}>
            {thinking ? 'Daj mi pomyslec do hxuja...' : 'Super silnik kurwa'}
            {end && 'NO I CHUJ'}
        </div>
    </>
}