import { v4 as uuidv4 } from 'uuid'
import { INVALID_MOVE } from 'boardgame.io/core';

import { UNIT_PAWN } from '../constants/units'

function createPawn (cell) {
  return {
    type: UNIT_PAWN,
    cell: cell
  }
}

function placeUnit (G, ctx, cell) {
  const currentPlayer = G.players[ctx.currentPlayer]
  currentPlayer.pieces[uuidv4()] = createPawn(cell)
}

function moveUnit (G, ctx, unit, cell) {
  if (G.cells[cell].occupied !== null) return INVALID_MOVE

  G.cells[cell].occupied = ctx.currentPlayer;

  const currentPlayer = G.players[ctx.currentPlayer]
  currentPlayer.pieces[unit].cell = cell

}


export { createPawn, placeUnit, moveUnit }