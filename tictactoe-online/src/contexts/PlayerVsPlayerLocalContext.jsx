import { createContext, useContext, useState } from "react";

 const PlayerVsPlayerLocalContext = createContext();

export const usePlayerVsPlayerLocalContext = () => useContext(PlayerVsPlayerLocalContext);

export const PlayerVsPlayerLocalProvider = ({ children }) => {
    const [ playerNames, setPlayerNames] = useState({
        playerX: "",
        playerO: "",
    });
 


    const addNames =  (names) => {
        try{
           setPlayerNames(names);
         
           
        } catch (err){
            console.error(err)
        }
    }

    const clearNames = () => {
        setPlayerNames({ playerX: "", playerO: "" });
    }

    
 const value = {
        playerNames,
        addNames,
        clearNames
    }

    return(
        <PlayerVsPlayerLocalContext.Provider value={value}>
            {children}
        </PlayerVsPlayerLocalContext.Provider>
    )


}