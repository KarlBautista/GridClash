import React, { use, useEffect, useState, useRef } from 'react'

const PlayerVsPlayerOnline = () => {
    const [ ws, setWs ] = useState(null);
    const [ status, setStatus ] = useState("");
    let isConnected = false;

    useEffect(() => {
        if(isConnected) return;
        isConnected = true;
        const socket = new WebSocket("ws://localhost:9090");
       
        if(socket){
             console.log("You are connected");
        }
        
        setWs(socket);

        socket.onopen = () => {
            setStatus("Waiting for opponent");
        }

        console.log(status);

        socket.onmessage = (event) => {
          const e = JSON.parse(event.data)
           if(e.type === "start"){
            console.log(`The game starts you are ${e.symbol}`);
           }
           if(e.type === "end"){
            console.log("A player disconnected, the game ends");
           }
        }

       socket.onerror = (error) => {
        console.error("Websocket error", error);
        setStatus("Connection error, Please refresh the page");
       }

       socket.onclose = () => {
        setStatus("Connection lost. Please refresh the page");
       }
       
    }, []);

    const exit = () => {
        ws.close();
    }

  return (
    <div>
      <button onClick={() => exit()}>Exit Connection</button>
    </div>
  )
}

export default PlayerVsPlayerOnline
