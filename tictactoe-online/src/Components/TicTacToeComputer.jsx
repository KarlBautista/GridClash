import React, { use, useEffect, useState } from 'react'
import "../styles/TicTacToeComputer.css"
import { usePlayerVsComputerContext } from '../contexts/PlayerVsComputerContext';
import PlayerVsComputerNameInput from './PlayerVsComputerNameInput';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2"
const TicTacToeComputer = () => {
    const [ gameState, setGameState ] = useState(Array(9).fill(""));
    const [ isGameActive, setIsGameActive ] = useState(true);
    const [ gameStatus, setGameStatus ] = useState("Player (X) turn");
    const [ currentPlayer, setCurrentPlayer ] = useState("X");
    const { playerName, clearName } = usePlayerVsComputerContext();
    const navigate = useNavigate();
    const [ score, setScore ] = useState({
        playerX: 0,
        playerO: 0,
    }
)


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

  
    const computerMove = (newGameState) => {
        let randomMove = 0;
        while(newGameState[randomMove] !== ""){
            randomMove = Math.floor(Math.random() * newGameState.length)
        }

        const computerGameState = [...newGameState];
        computerGameState[randomMove] = "O";
        setGameState(computerGameState);
        
  
        if(checkWin(computerGameState)){
            setTimeout(() => {
                Swal.fire({
                    title: "Computer (O) Wins!",
                    text: "Do you want to clear the canvas?",
                    showConfirmButton: true,
                    showCancelButton: true
                })
              
            }, 100);
            setScore(s => ({...s, ["playerO"]: s["playerO"] + 1}))
            setIsGameActive(false);
            return;
        }

   
        if(checkIfFull(computerGameState)){
            setTimeout(() => {
                Swal.fire({
                    title: "All cells are filled, It's a draw",
                    text: "Do you want to clear the canvas?",
                    showConfirmButton: true,
                    showCancelButton: true
                });
            
            }, 100);
            setIsGameActive(false);
            return;
        }

 
        setCurrentPlayer("X");
        setGameStatus("Player (X) turn");
    }




    const checkWin = (newGameState) => {
        return winPatters.some(pattern => {
            const [a, b, c] = pattern;
            return newGameState[a] && 
                   newGameState[a] === newGameState[b] && 
                   newGameState[a] === newGameState[c];
        });
    }

    const checkIfFull = (newGameState) => {
        return newGameState.every(cell => cell !== "");
    }

    const handleClick = (index) => {
        if(gameState[index] !== "" || !isGameActive){
            return;
        }

        const newGameState = [...gameState];
        newGameState[index] = currentPlayer;
        setGameState(newGameState);

        if(checkWin(newGameState)){ 
            setTimeout(() => {
                Swal.fire({
                        title: `Player ${currentPlayer} Wins!`,
                        text: "Do you want to clear the canvas?",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Yes, I want to play again!",
                        cancelButtonText: "No, I'm going back to the Main Menu"
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
             
               
            }, 100);

             
              
            setScore(s => ({...s, ["playerX"]: s["playerX"] + 1}))
            setIsGameActive(false);
            return;
        }

        if(checkIfFull(newGameState)){
            setTimeout(() => {
                alert("All cells are filled, It's a draw");
            }, 100);
            setIsGameActive(false);
            return;
        }

   
        setCurrentPlayer("O");
        setGameStatus("Computer (O) turn");
        setIsGameActive(false);
        setTimeout(() => {
            computerMove(newGameState);
             setIsGameActive(true);
        }, 500);
    }

    const resetGame = () => {
        setGameState(Array(9).fill(""));
        setCurrentPlayer("X");
        setGameStatus("Player X turn");
        setIsGameActive(true)
        
    }

    const backToMainMenu = () => {
        setGameState(null);
        setIsGameActive(false);
        navigate("/");
        clearName();
    }
        

  return (
    <div className='tictactoe-computer'>
        { playerName  === "" ? <PlayerVsComputerNameInput /> : (
            <>
         
            <h1>Player vs Computer</h1>
         <div className="player-stats-container">
                
                <div className="player-x">
                      <h3>{`${playerName} (player X)`}</h3>
                      <p>{score.playerX}</p>
                </div>
                <div className="player-o">
                       <h3>Computer</h3>
                      <p>{score.playerO}</p>
                </div>
    
             </div>
             <div className="game-status">
                <p>{gameStatus}</p>
            </div>
            <div className="tictactoe-container">
                { gameState.map((cell, index) => <div key={index}
                                                className='cell'
                                                onClick={() => handleClick(index)}>{cell}</div>)}
            </div>

           <div className="reset-button-container">
                <button onClick={() => resetGame()}>Reset</button>
                 <button id='player-vs-computer-back'
                 onClick={() => backToMainMenu()}>Exit</button>
            </div>
            </>

        ) }
       
      
      
    </div>
  )
}

export default TicTacToeComputer
