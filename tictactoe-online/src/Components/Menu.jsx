import React from 'react'
import "../styles/Menu.css"
import { useNavigate } from 'react-router-dom'
const Menu = () => {
    const navigate = useNavigate();
    const handleNavigate = (address) => {
        try{
            navigate(`/${address}`);
        } catch(err){
            console.error(err);
        }
    }
  return (
    <div className='menu-container'>
        <h1>GRIDCLASH</h1>

        <div className="button-container">
            <button onClick={() => handleNavigate("player-vs-computer")}>Player VS Computer</button>
            <button onClick={() => handleNavigate("player-vs-player-local")}>Player VS Player (Local)</button>
            <button onClick={() => handleNavigate("player-vs-player-online")}>Player VS Player (Online)</button>
        </div>
      
    </div>
  )
}

export default Menu
