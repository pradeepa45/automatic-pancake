import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import { useEffect, useRef, useState } from 'react';
import Log from './components/Log.jsx';
import { WINNING_COMBINATIONS } from './winning-combinations.js';
import GameOver from './components/GameOver.jsx';
import { DLogger } from './components/datadog/logInit.jsx';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]
const INITIAL_PLAYERS = {
  X:"Player 1",
  O: "Player 2"
}

function deriveActivePlayer(gameTurns, players){
  let activePlayer = 'X'
  if(gameTurns.length>0 && gameTurns[0].player==='X') {
    activePlayer = 'O'
  }
  return activePlayer;
}

function deriveWinner(gameBoard,players, gameTurns) {
  let winner, hasDraw
  for(const combo of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combo[0].rowIndex][combo[0].colIndex];
    const secondSquareSymbol = gameBoard[combo[1].rowIndex][combo[1].colIndex];
    const thirdSquareSymbol = gameBoard[combo[2].rowIndex][combo[2].colIndex];
    if(firstSquareSymbol && (firstSquareSymbol === secondSquareSymbol) && (firstSquareSymbol === thirdSquareSymbol)){
      winner = players[firstSquareSymbol]
    }
    hasDraw = gameTurns.length === 9 && !winner;
  }
  return {winner, hasDraw}
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...initialGameBoard.map(initialRows => [...initialRows])];
  for (const turn of gameTurns) {
    const {square, player} = turn
    const {rowIndex, colIndex} = square
    gameBoard[rowIndex][colIndex] = player
  }
  return gameBoard
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const handlePlayerNameChange=(symbol, player) => {
    DLogger.info('Player name updated', {
      event: 'player_name_updated',
      playerSymbol: symbol,
    });
    setPlayers({
      ...players,
      [symbol]:player
    })
  }

  const activePlayer=deriveActivePlayer(gameTurns);
  
  const gameBoard = deriveGameBoard(gameTurns);

  const {winner, hasDraw} = deriveWinner(gameBoard, players, gameTurns)
  const gameOverLogged = useRef(false);

  useEffect(() => {
    if (winner || hasDraw) {
      if (!gameOverLogged.current) {
        const winningSymbol = Object.keys(players).find(symbol => players[symbol] === winner);
        DLogger.info('Game finished', {
          event: 'game_finished',
          result: winner ? 'win' : 'draw',
          winningSymbol,
          moveCount: gameTurns.length,
        });
        gameOverLogged.current = true;
      }
    } else {
      gameOverLogged.current = false;
    }
  }, [gameTurns.length, hasDraw, players, winner]);
  
  const handleRematch = () => {
    DLogger.info('Game rematch started', {
      event: 'game_rematch',
      previousMoveCount: gameTurns.length,
    });
    setGameTurns([])
  }
  
  const handleSelectSquare = (rowIndex, colIndex) => {
    DLogger.info('Game move selected', {
      event: 'game_move',
      playerSymbol: activePlayer,
      position: { rowIndex, colIndex },
      moveNumber: gameTurns.length + 1,
    });
    setGameTurns(prevState => {
      let currentPlayer = deriveActivePlayer(prevState);
      if(prevState.length>0 && prevState[0].player==='X') {
        currentPlayer = 'O'
      }
      const updatedTurns = [{
        square: {
          rowIndex,
         colIndex
        },
        player: currentPlayer
      },
        ...prevState];
      return updatedTurns
    })
  }
    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player name={players.X} symbol="X" isActive={activePlayer==='X'} handlePlayerChange={handlePlayerNameChange}/>
                    <Player name={players.O} symbol="O" isActive={activePlayer==='O'} handlePlayerChange={handlePlayerNameChange}/>
                </ol>
              {winner ? <GameOver winner={winner} hasDraw={hasDraw} handleRematch={handleRematch} /> : null}
              {hasDraw ? <GameOver hasDraw={hasDraw} handleRematch={handleRematch} /> : null}
              
                <GameBoard onSquareSelect={handleSelectSquare} gameBoardState={gameBoard}/>
            </div>
            <Log turns={gameTurns} />
        </main>
    )
}

export default App
