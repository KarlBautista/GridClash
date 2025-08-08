import { createBrowserRouter } from "react-router-dom"
import Tictactoe from "./Tictactoe"
import Menu from "./Menu"
import React from 'react'
import App from "../App"
import TicTacToeComputer from "./TicTacToeComputer"
const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        { path: "/", element: <Menu />},
        { path: "/player-vs-player-local", element: <Tictactoe />},
        { path: "/player-vs-computer", element: <TicTacToeComputer />}
    ]
}])

export default router
