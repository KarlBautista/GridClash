import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tictactoe from './Components/Tictactoe'
import Menu from './Components/Menu'
import { Outlet } from 'react-router-dom'
import { PlayerVsPlayerLocalProvider } from './contexts/PlayerVsPlayerLocalContext'
import { PlayerVsComputerProvider } from './contexts/PlayerVsComputerContext'
function App() {


  return (
   <PlayerVsPlayerLocalProvider>
    <PlayerVsComputerProvider>
      <main>
        <Outlet />{

        }
      </main>
      </PlayerVsComputerProvider>
 </PlayerVsPlayerLocalProvider>
  )
}

export default App
