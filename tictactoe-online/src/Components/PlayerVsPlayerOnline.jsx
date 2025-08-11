import React, { use, useEffect, useState, useRef } from 'react'

const PlayerVsPlayerOnline = () => {
    const [ ws, setWs ] = useState(null);
    const [ gameState, setGameState ] = useState(Array(9).fill(""));
    const [ status, setStatus ] = useState("");
    const [ currentPlayer, setCurrentPlayer ] = useState("X");
    const [ gameStarted, setGameStarted ] = useState(false);
    const [ symbol, setSymbol ] = useState(null);
    let isConnected = false;

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
        if(isConnected) return;
        isConnected = true;
        const socket = new WebSocket("ws://localhost:9090");
      
        
        setWs(socket);

        socket.onopen = () => {
            setStatus("Waiting for opponent");
            console.log("You are connected");
        }

        console.log(status);

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
           if(data.type === "start"){
            setGameStarted(true);
            setSymbol(data.symbol);
            console.log(`The game starts you are ${data.symbol}`);
            setStatus(`The game starts, you are ${data.symbol}`)
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
              return;
            }
           }

           if(data.type === "reset"){
            setGameState(data.board);
            setCurrentPlayer(data.currentPlayer);
            setGameStarted(true);
            setStatus(`Game reset! ${data.currentPlayer} starts first.`);
           }

           if(data.type === "reset_confirmation"){
            console.log("Reset confirmation received from:", data.requestedBy);
            
            // Use setTimeout to ensure the UI is ready for the dialog
            setTimeout(() => {
              const confirmed = window.confirm(`Player ${data.requestedBy} wants to reset the game. Do you agree?`);
              console.log("User response:", confirmed);
              
              if(ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "reset_response",
                  approved: confirmed
                }));
                console.log("Response sent to server");
              } else {
                console.error("WebSocket not ready when sending response");
              }
            }, 100);
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
      if(!gameStarted || gameState[index] !== "" || currentPlayer !== symbol) return;

      if(ws && ws.readyState === WebSocket.OPEN) {
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
    <div>
      <h1>TicTacToe Online</h1>
      <div>{status}</div>
      {symbol && <div>{`You are: ${symbol}`}</div>}

      <div className='tictactoe-container'>
        {gameState.map((cell, index) => (
          <div key={index}
               className='cell'
               onClick={() => handleClick(index)}
                >{cell}</div>
        ))}
      </div>




        <button onClick={() => handleReset()}>RESET</button>
      <button onClick={() => exit()}>Exit Connection</button>
    </div>
  )
}

export default PlayerVsPlayerOnline
