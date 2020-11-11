import SfBikeParkingData from './data/sf-bike-parking.json';
import { createPlayer, placeUnit, moveUnit } from './utils'
    
const data = SfBikeParkingData

const Game = {
  setup: (G) => {
    const players = []
    for (let i=0; i < G.numPlayers; i++) {
      players[i] = createPlayer(i)
    }

    return { 
      cells: data,
      players
    }
  },

  turn: {
    moveLimit: 1,
  },

  phases: {
    setup: {
      start: true,
      next: 'play',
      moves: { placeUnit },
      endIf: (G, ctx) => {
        // End the phase if every player has placed a piece
        return G.players.every(player => Object.keys(player.pieces).length > 0)
      }
    },

    play: {
      moves: { moveUnit }
    }
  }
}

export default Game