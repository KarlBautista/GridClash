import { createContext, useContext, useState } from "react";

 const PVPLocalContext = createContext();

export const usePVPLocalContext = () => useContext(PVPLocalContext);

export const PVPLocalProvider = ({ children }) => {
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
        <PVPLocalContext.Provider value={value}>
            {children}
        </PVPLocalContext.Provider>
    )


}