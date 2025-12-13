import React, { useEffect, useState } from 'react'
import "../styles/Tictactoe.css"
import NameInput from './NameInput';
import { usePlayerVsPlayerLocalContext } from '../contexts/PlayerVsPlayerLocalContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const Tictactoe = () => {
    const [ gameState, setGameState ] = useState(Array(9).fill(""));
    const [ currentPlayer, setCurrentPlayer ] = useState("X");
    const [ gameStatus, setGameStatus ] = useState("Player X turn");
    const [ isGameActive, setIsGameActive] = useState(true);
    const { playerNames, clearNames } = usePlayerVsPlayerLocalContext();
    const navigate = useNavigate();
    const [score, setScore] = useState({
        playerX: 0,
        playerO: 0,
    })

    const winPatters = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkIfFull = (newGameState) => {
        return newGameState.every((cell) => cell !== "");
    }


    const checkWin = (newGameState) => {
        return winPatters.some(pattern => 
            pattern.every(index => newGameState[index] === currentPlayer)
        )
    }

    const handleClick = (index) => {
        if(gameState[index] !== "" || !isGameActive) {
            return;
        }
        const newGameState = [...gameState];
        newGameState[index] = currentPlayer;
        setGameState(newGameState);
        console.log(gameState)

        if(checkWin(newGameState)){
            setTimeout(() => {
                Swal.fire({
                    title: `PLAYER ${currentPlayer} Wins!`,
                    text: "Do you guys want to clear the canvas?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes, we want to play again!",
                    cancelButtonText: "No, it's a great time playing"
                    }).then((response) => {
                        if (response.isConfirmed) {
                            resetGame();
                        } else if (response.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire({
                                title: "Are you sure you want to exit the game?",
                                showConfirmButton: true,
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                            }).then((response) => {
                                if (response.isConfirmed) {
                                    backToMainMenu();
                                } else if (response.dismiss === Swal.DismissReason.cancel) {
                                    resetGame();
                                }
                            })
                        }
                    })
             
            }, 100)
          setScore(s => ({ ...s, [`player${currentPlayer}`]: s[`player${currentPlayer}`] + 1 }))

           console.log(score)
           setIsGameActive(false);
           return;
        }

        if(checkIfFull(newGameState)){
            setTimeout(() => {
                Swal.fire({
                    title: "All cells has been filled up, It's a draw",
                    text: "Do you guys want to clear the canvas?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes, we want to play again!",
                    cancelButtonText: "No, it's a great time playing"
                    }).then((response) => {
                        if (response.isConfirmed) {
                            resetGame();
                        } else if (response.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire({
                                title: "Are you sure you want to exit the game?",
                                showConfirmButton: true,
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                            }).then((response) => {
                                if (response.isConfirmed) {
                                    backToMainMenu();
                                } else if (response.dismiss === Swal.DismissReason.cancel) {
                                    resetGame();
                                }
                            })
                        }
                    })
             
            }, 100)
             setIsGameActive(false);
             return;
        }

      
        
        setGameStatus(currentPlayer === "X" ? "Player O turn" : "player X turn");
        setCurrentPlayer( currentPlayer === "X" ? "O" : "X");
       
    }

    const resetGame = () => {
        setGameState(Array(9).fill(""));
        setCurrentPlayer("X");
        setGameStatus("Player X turn");
        setIsGameActive(true)
        
    }
    
    const backToMainMenu = () => {
        clearNames();
        setGameState("");
        setIsGameActive(false);
        navigate("/");
    }

    
  return (
    <div className='player-vs-player-local'> 
        {playerNames.playerX === "" || playerNames.playerO === "" ? (<NameInput />) : (
              <>
              <h1>Player Vs Player (Local)</h1>
              <div className="player-stats-container">
                <div className="player-x">
                      <h3>{`${playerNames.playerX} (player X)`}</h3>
                      <p>{score.playerX}</p>
                </div>
                <div className="player-o">
                       <h3>{`${playerNames.playerO} (player O)`}</h3>
                       <p>{score.playerO}</p>
                </div>
    
             </div>

              <div className="game-status">
                <p>{gameStatus}</p>
            </div>
            <div className="tictactoe-container">

            {gameState?.map((cell, index) => 
                <div key={index} onClick={() => handleClick(index)} className='cell'>{cell}</div>
            )}    
            </div>

           
            <div className="reset-button-container">
                <button onClick={() => resetGame()}>Reset</button>
                <button onClick={() => backToMainMenu()}>Exit</button>
            </div>
              
              
              </>
        )}
      
      
     
         
    </div>
  )
}

export default Tictactoe
