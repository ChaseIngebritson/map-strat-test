import { Client } from 'boardgame.io/react';

import Game from './Game';
import Map from './components/Map'

import './App.css';

const App = Client({ 
  game: Game,
  board: Map
});

export default App;
