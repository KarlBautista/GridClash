import React, { useState } from 'react'
import { usePlayerVsComputerContext } from '../contexts/PlayerVsComputerContext';
const PlayerVsComputerNameInput = () => {
    const { addName } = usePlayerVsComputerContext();
    const [ name, setName ] = useState("");

    const enterName = async () => {
        try{
            await addName(name);
        } catch(err){
            console.error(err);
        }
    }


  return (
    <div className="name-input-backdrop">
          <div className='name-input-container'>
                 <div className="input-group">
                  <p>Enter Your Name</p>
                     <input type    ="text" 
                        onChange={((e) => setName(e.target.value))}
                        value={name}
                        name='player'/>
            </div>
         <button onClick={() => enterName()}>Enter</button>

      
        </div>
    </div>
  
  )
}

export default PlayerVsComputerNameInput
