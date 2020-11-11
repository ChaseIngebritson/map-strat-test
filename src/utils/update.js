import { v4 as uuidv4 } from 'uuid'
import { INVALID_MOVE } from 'boardgame.io/core';
import { toast } from 'react-toastify';

import { includesCoords } from './map'
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
  const isClaimed = G.players.some((player, index) => {
    if (index === parseInt(ctx.currentPlayer)) return false
    return includesCoords(player.claims, coordinates)
  })

  if (isClaimed) {
    toast.error(INVALID_MOVE, {
      position: toast.POSITION.TOP_LEFT
    })
    return INVALID_MOVE
  }

  const currentPlayer = G.players[ctx.currentPlayer]
  
  // If not already owned, add to the list of coordinates owned by the player
  if (!includesCoords(currentPlayer.claims, coordinates)) {
    currentPlayer.claims.push(coordinates)
  }

  // Set the coordinates of the specified unit
  currentPlayer.pieces[unit].coordinates = coordinates

}


export { createPawn, placeUnit, moveUnit }