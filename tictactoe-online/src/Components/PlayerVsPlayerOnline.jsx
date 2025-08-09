import React, { use, useEffect, useState, useRef } from 'react'

const PlayerVsPlayerOnline = () => {
    const [ ws, setWs ] = useState(null);
    const [ status, setStatus ] = useState("");
 

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:9090");
        if(socket){
             console.log("You are connected");
        }
        
        setWs(socket);

        socket.onopen = () => {
            setStatus("Waiting for opponent");
               
        }

        socket.onmessage = (event) => {
            console.log(event.data)
        }

        return () => {
            socket.close();
        }


       
        
       
    }, []);

    const exit = () => {
        ws.close();
        console.log("Connection Terminated from the client");
    }



    

       

  return (
    <div>
      <button onClick={() => exit()}>Exit Connection</button>
    </div>
  )
}

export default PlayerVsPlayerOnline
