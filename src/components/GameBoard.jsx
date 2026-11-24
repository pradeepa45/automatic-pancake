import { useState } from 'react';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

export default function GameBoard({ onSquareSelect, gameBoardState }) {
  return (
    <ol id="game-board">
      {gameBoardState.map((row, rowIndex)=> (<li key={rowIndex}>
        <ol>
          {row.map((playerSymbol, colIndex) => (
            <li key={colIndex}>
              <button onClick={()=>onSquareSelect(rowIndex,colIndex)} disabled={playerSymbol!==null}>{playerSymbol}</button>
            </li>
          ))}
        </ol>
      </li>))}
    </ol>
  )
}