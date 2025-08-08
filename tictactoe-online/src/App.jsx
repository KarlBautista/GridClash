import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tictactoe from './Components/Tictactoe'
import Menu from './Components/Menu'
import { Outlet } from 'react-router-dom'
import { PVPLocalProvider } from './contexts/pvpLocalContext'
import { PlayerVsComputerProvider } from './contexts/PlayerVsComputerContext'
function App() {


  return (
   <PVPLocalProvider>
    <PlayerVsComputerProvider>
      <main>
        <Outlet />{

        }
      </main>
      </PlayerVsComputerProvider>
 </PVPLocalProvider>
  )
}

export default App
