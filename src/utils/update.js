import { v4 as uuidv4 } from 'uuid'
import { INVALID_MOVE } from 'boardgame.io/core';
import { toast } from 'react-toastify';

import { UNIT_PAWN } from '../constants/units'

function createPawn (id, coordinates) {
  return {
    id,
    type: UNIT_PAWN,
    coordinates: coordinates
  }
}

function placeUnit (G, ctx, coordinates) {
  const currentPlayer = G.players[ctx.currentPlayer]
  const id = uuidv4()
  currentPlayer.pieces[id] = createPawn(id, coordinates)
}

function moveUnit (G, ctx, unit, cell, coordinates) {
  if (G.cells[cell].occupied !== null) {
    toast.error(INVALID_MOVE, {
      position: toast.POSITION.TOP_LEFT
    })
    return INVALID_MOVE
  }

  G.cells[cell].occupied = ctx.currentPlayer;

  const currentPlayer = G.players[ctx.currentPlayer]
  currentPlayer.pieces[unit].coordinates = coordinates

}


export { createPawn, placeUnit, moveUnit }