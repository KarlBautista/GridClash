import { createContext, useContext, useState } from "react";

 const PlayerVsPlayerLocalContext = createContext();

export const usePlayerVsPlayerLocalContext = () => useContext(PlayerVsPlayerLocalContext);

export const PlayerVsPlayerLocalProvider = ({ children }) => {
    const [ playerNames, setPlayerNames] = useState({
        playerX: "",
        playerO: "",
    });
 


    const addNames = async (names) => {
        try{
            await setPlayerNames(names);
         
           
        } catch (err){
            console.error(err)
        }
    }

    console.log(playerNames)

    
 const value = {
        playerNames,
        addNames,
    }

    return(
        <PlayerVsPlayerLocalContext.Provider value={value}>
            {children}
        </PlayerVsPlayerLocalContext.Provider>
    )


}