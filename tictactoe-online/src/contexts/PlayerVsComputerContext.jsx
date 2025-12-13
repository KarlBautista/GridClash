import { createContext, useContext, useState } from "react";

const PlayerVsComputerContext = createContext();

export const usePlayerVsComputerContext = () => useContext(PlayerVsComputerContext);

export const PlayerVsComputerProvider = ({ children }) => {
    const [ playerName, setPlayerName ] = useState("");

    const addName = (name) => {
        setPlayerName(name);
    }

    const clearName = (name) => {
        setPlayerName("");
    }

    const value = {
        addName,
        playerName,
        clearName
    }

    return (
        <PlayerVsComputerContext.Provider value={value}>
            { children }
        </PlayerVsComputerContext.Provider>
    )
}