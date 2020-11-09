function createScenegraphLayer (
  layerId,
  scenegraphModelUrl,
  coordinates,
  sizeScale
) {
  return {
    id: layerId,
    scenegraph: scenegraphModelUrl,
    data: [{ position: coordinates, size: 100 }],
    sizeScale,
    _lighting: 'pbr',
    getPosition: d => d.position,
    getOrientation: [0, 330, 90],
    getTranslation: [0, 0, 0],
    getScale: [1, 1, 1],
    pickable: true,
    onClick: (layer, $event) => {
      console.log('triggered scenegraphLayer click', layer)
      return true
    }
  }
}

export { createScenegraphLayer }