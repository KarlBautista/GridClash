import React, { useEffect, useState, useRef } from 'react'
import "../styles/PlayerVsPlayerOnline.css"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Loading from '../assets/loading.gif'
const PlayerVsPlayerOnline = () => {
    const [ ws, setWs ] = useState(null);
    const [ gameState, setGameState ] = useState(Array(9).fill(""));
    const [ status, setStatus ] = useState("");
    const [ currentPlayer, setCurrentPlayer ] = useState("X");
    const [ gameStarted, setGameStarted ] = useState(false);
    const [ symbol, setSymbol ] = useState(null);
    const [ score, setScore ] = useState({ X: 0, O: 0 });
    const [ searchLoading, setSearchLoading ] = useState(true);
    const isConnected = useRef(false);
    const wsRef = useRef(null); 
    const navigate = useNavigate();

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

    useEffect(() => {
        if(isConnected.current) return;
        isConnected.current = true;
        const socket = new WebSocket("wss://gridclash.onrender.com/");
        wsRef.current = socket;
        setWs(socket);

        socket.onopen = () => {
            setStatus("Searching for an opponent...");
            if (searchLoading) {
              Swal.fire({
              theme: "auto",
              title: "Searching for an opponent...",
              showConfirmButton: false,
              imageUrl: Loading,
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
            }
        
        }

  

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
           if(data.type === "start"){
            setGameStarted(true);
            setSymbol(data.symbol);
            console.log(`The game starts you are ${data.symbol}`);
            setStatus(`The game starts, you are ${data.symbol}`);
            setSearchLoading(false);
            
            
           }
           if(data.type === "update"){
            setGameState(data.board);
            setCurrentPlayer(data.currentPlayer);

            if(checkIfDraw(data.board)){
              setStatus("Its a draw");
              setGameStarted(false);
            
              return
            }

            const winner = checkIfWinner(data.board);
            if(winner){
              setStatus(`The winner is ${winner}!`);
              setGameStarted(false);
              setScore(s => ({...s, [winner]: s[winner] + 1}))
  
              return;
            }
           }

        if (data.type === "reset") {
        setGameState([...data.board]); 
        setCurrentPlayer(data.currentPlayer);
        setGameStarted(true);
        setStatus(`Game reset! ${data.currentPlayer} starts first.`);
}


        if (data.type === "reset_confirmation") {
      console.log("Reset confirmation received from:", data.requestedBy);

      const sendResponse = (approved) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "reset_response", approved }));
        } else {
          console.warn("WebSocket not available when trying to send reset_response");
        }
      };

      const confirmReset = () => {
        const confirmed = window.confirm("Opponent wants to reset...");
        sendResponse(confirmed);
      };

      if (document.visibilityState !== "visible") {
        const onVisible = () => {
          confirmReset();
          document.removeEventListener("visibilitychange", onVisible);
        };
        document.addEventListener("visibilitychange", onVisible);
      } else {
        confirmReset();
      }
}


           if(data.type === "reset_pending"){
            console.log("Reset pending message received:", data.message);
            setStatus(data.message);
           }

           if(data.type === "reset_denied"){
            console.log("Reset denied message received:", data.message);
            setStatus(data.message);
           }

           if(data.type === "end"){
            console.log("A player disconnected, the game ends");
             setStatus("Your opponent disconnected.")
           }


        }

       socket.onerror = (error) => {
        console.error("Websocket error", error);
        setStatus("Connection error, Please refresh the page");
       }

       socket.onclose = () => {
        setStatus("You disconnected");
       }

  

       return () => {
        if(socket === WebSocket.CONNECTING){
          socket.close();
        }
       }
       
    }, [symbol]);

    const exit = () => {
        ws.close();
        console.log("You disconnected");
    }

    
       const checkIfDraw = (gameState) => {
        return gameState.every(cell => cell !== "");
       }

       const checkIfWinner = (gameState) => {
 
        for (const player of ["X", "O"]) {
            const hasWon = winPatters.some((pattern) => 
                pattern.every(index => gameState[index] === player)
            );
            if (hasWon) {
                return player; 
            }
        }
        return null; 
       }
       

    const handleClick = (index) => {
      console.log("Click attempted:", {
        index,
        gameStarted,
        cellEmpty: gameState[index] === "",
        currentPlayer,
        symbol,
        isMyTurn: currentPlayer === symbol
      });
      
      if(!gameStarted || gameState[index] !== "" || currentPlayer !== symbol) {
        console.log("Move blocked - reasons:", {
          gameNotStarted: !gameStarted,
          cellNotEmpty: gameState[index] !== "",
          notMyTurn: currentPlayer !== symbol
        });
        return;
      }

      if(ws && ws.readyState === WebSocket.OPEN) {
        console.log("Sending move to server");
        ws.send(JSON.stringify({ type: "move", index}));
       
      }
    }

    const handleReset = () => {
      console.log("Reset button clicked by:", symbol);
      if(ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "reset_request" }));
        setStatus("Requesting game reset...");
        console.log("Reset request sent to server");
         
      } else {
        console.error("WebSocket not ready for reset request");
      }
    }

  return (
    <div className="game-container">
      <h1>Player vs Player (Online)</h1>
      
      <div className="game-info">
        <div className="status">{status}</div>
        {symbol && <div className="player-info">{`You are: ${symbol}`}</div>}
        <div className="score-display">Scores - X: {score.X} | O: {score.O}</div>
      </div>

      <div className='tictactoe-container2'>
        {gameState.map((cell, index) => (
          <div key={index}
               className='cell'
               onClick={() => handleClick(index)}
                >{cell}</div>
        ))}
      </div>

      <div className="button-container">
        <button onClick={() => handleReset()}>RESET</button>
        <button onClick={() => exit()}>Exit</button>
      </div>
    </div>
  )
}

export default PlayerVsPlayerOnline
