import { createBrowserRouter } from "react-router-dom"
import Tictactoe from "./Tictactoe"
import Menu from "./Menu"
import React from 'react'
import App from "../App"
import TicTacToeComputer from "./TicTacToeComputer"
import PlayerVsPlayerOnline from "./PlayerVsPlayerOnline"
const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        { path: "/", element: <Menu />},
        { path: "/player-vs-player-local", element: <Tictactoe />},
        { path: "/player-vs-computer", element: <TicTacToeComputer />},
        { path: "/player-vs-player-online", element: <PlayerVsPlayerOnline />}
    ]
}])

export default router
