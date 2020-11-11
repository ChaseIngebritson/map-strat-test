function loadData (url) {
  
}

function createPlayer (id) {
  return {
    id,
    pieces: {},
    claims: [], 
    moveCount: 0
  }
}

export { createPlayer, loadData }