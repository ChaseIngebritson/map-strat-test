function createScenegraphLayer (
  id,
  scenegraph,
  coordinates,
  sizeScale
) {
  return {
    id,
    scenegraph,
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

function createIconLayer (
  id,
  iconAtlas,
  iconMapping,
  color,
  coordinates
) {
  return {
    id,
    data: [{ coordinates }],
    pickable: true,
    iconAtlas,
    iconMapping,
    getIcon: d => 'marker',
    sizeScale: 15,
    sizeMaxPixels: 50,
    getPixelOffset: d => [0, -40],
    getPosition: d => d.coordinates,
    getSize: d => 5,
    getColor: d => color
  }
}

export { createScenegraphLayer, createIconLayer }