import { Client } from 'boardgame.io/react';
import { Debug } from 'boardgame.io/debug';

import Game from './Game';
import Map from './components/Map'

import './App.css';

const App = Client({ 
  game: Game,
  board: Map,
  numPlayers: 2,
  debug: { impl: Debug }
});

export default App;
