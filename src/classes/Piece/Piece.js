/* eslint-disable react/no-direct-mutation-state */

import React from 'react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers'
import { GLTFLoader } from '@loaders.gl/gltf';
import { registerLoaders } from '@loaders.gl/core';
import { v4 as uuidv4 } from 'uuid'

registerLoaders(GLTFLoader);

class Piece extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      model: props.model,
      coordinates: props.coordinates,
      layer: null
    };

    const uuid = uuidv4()

    this.state.layer = new ScenegraphLayer({
      id: uuid,
      scenegraph: this.state.model,
      data: [{ position: this.state.coordinates, size: 100 }],
      sizeScale: 30,
      _lighting: 'pbr',
      getPosition: d => this.state.coordinates,
      getOrientation: [0, 330, 90],
      getTranslation: [0, 0, 0],
      getScale: [1, 1, 1],
      pickable: true,
      onClick: (layer, $event) => {
        console.log('triggered scenegraphLayer click', layer)
        return true
      }
    })
  }

  setCoordinates (coordinates) {
    // this.setState({ coordinates })
    this.state.coordinates = coordinates

    console.log(this.state.layer)
    this.state.layer.setProps({ data: [{ position: coordinates, size: 100 }] })
  }

  render () {
    return
  }
}

export default Piece;
