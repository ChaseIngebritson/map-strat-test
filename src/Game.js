import { INVALID_MOVE } from 'boardgame.io/core';

import SfBikeParkingData from './data/sf-bike-parking.json';

const data = SfBikeParkingData.map(locationIn => {
  const location = locationIn
  location.occupied = null
  return location
})

const Game = {
  setup: () => ({ 
    cells: data
  }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id].occupied !== null) {
        return INVALID_MOVE;
      }

      G.cells[id].occupied = ctx.currentPlayer;
    },
  },
}

export default Game