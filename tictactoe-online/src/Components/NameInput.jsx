import React, { useState } from 'react'
import "../styles/NameInput.css"
import { usePVPLocalContext } from '../contexts/pvpLocalContext';
const NameInput = () => {
    const [playerNames, setPlayerNames] = useState({
        playerX: "",
        playerO: "",
    });
    const { addNames } = usePVPLocalContext();
    const handleOnchange = (e) => {
        setPlayerNames(p => ({...p, [e.target.name]: e.target.value}))
    }

    const enterName = async () => {
        if(playerNames.playerX === "" || playerNames.playerO === ""){
            alert("Put name first before playing the game");
            return;
        }
        try{
            await addNames(playerNames);
        } catch(err){
            console.error(err);
        }
    }
  return (
    <div className="name-input-backdrop">
          <div className='name-input-container'>
            <div className="input-group">
                  <p>Enter Player X name</p>
                <input type="text" 
                        onChange={handleOnchange}
                        value={playerNames.playerX}
                        name='playerX'/>
            </div>

               <div className="input-group">
                  <p>Enter Player O name</p>
                <input type="text" 
                        onChange={handleOnchange}
                        value={playerNames.playerO}
                        name='playerO'/>
            </div>

            <button onClick={() => enterName()}>Enter</button>
           
         </div>
    </div>
  
  )
}

export default NameInput
