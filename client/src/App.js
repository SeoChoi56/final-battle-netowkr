
import './App.css';
import BetweenRound from './Game/BetweenRounds/BetweenRound';
import Canvas from './Game/Canvas';
import NavBar from './NavBar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PlayerClass from './Game/PlayerClass';
import { useState } from 'react'

function App() {
  const [save, setSave] = useState({
    levelNum: 1,
    player: new PlayerClass(),
    enemiesList: [],
  })


  return (
    <div className="App"  >
      <Router>
        <NavBar />
        <Routes>
          <Route path='/'/>
          <Route path='/save' />
          <Route path='/load' />
          <Route path='/user' />
        </Routes>
      </Router>
      <Canvas 
        savePlayer={save.player} 
        saveLevelNum={save.levelNum}
        saveEnemiesList={save.enemiesList}
      />
    </div>
  );
}

export default App;
