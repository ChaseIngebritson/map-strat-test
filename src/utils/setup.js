function loadData (url) {
  
}

function createPlayer (id) {
  return {
    id,
    pieces: {},
    moveCount: 0
  }
}

export { createPlayer, loadData }