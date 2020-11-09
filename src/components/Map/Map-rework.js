import { Component } from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL, { Layer }  from 'react-map-gl';
import { ScenegraphLayer } from '@deck.gl/mesh-layers'
import { GLTFLoader } from '@loaders.gl/gltf';
import { registerLoaders } from '@loaders.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';

import './Map.css';

registerLoaders(GLTFLoader);

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZ29tb25rZXlhbWFuZ28iLCJhIjoiY2tjc2tjd2UxMHZsMzJxcGQ1YjlpMms3eSJ9._EZ2ZSCNrB8tdYqPhSaYSQ'

const INITIAL_VIEW_STATE = {
  latitude: 37.779654,
  longitude: -122.395232,
  zoom: 15.5,
  bearing: -17.6,
  pitch: 45
};

const buildingLayer = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',

    // use an 'interpolate' expression to add a smooth transition effect to the
    // buildings as the user zooms in
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.6
  }
};

class Map extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      buildingLayer,
      hexagonLayer: null,
      pieces: []
    }
  }

  componentDidMount () {
    // Create the game board using cells loaded in the parent
    const hexagonLayer = {
      id: 'hexagon-layer',
      data: this.props.G.cells,
      pickable: true,
      extruded: true,
      radius: 50,
      elevationScale: 0,
      autoHighlight: true,
      opacity: 0.3,
      getPosition: d => d.COORDINATES,
      onClick: (layer, $event) => {
        this.props.moves.clickCell(layer.index);
  
        // Update the placement of pieces
        this.setState(prevState => ({
          pieces: {
            ...prevState.pieces,
            [this.props.ctx.currentPlayer]: layer.object.position
          }
        }))
        
        return true
      }
    };

    // Create the correct amount of pieces based on the number of players
    const PIECE_STATE_INITIAL = {}
    for (let i = 0; i < this.props.ctx.numPlayers; i++) {
      PIECE_STATE_INITIAL[i] = [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude]
    }

    // Convert the pieces to placement data readable by the Scenegraph Layer
    const pieceLayerData = Object.values(PIECE_STATE_INITIAL)
      .map(piece => ({
        position: piece,
        size: 100
      }))

    // Create the layer that will contain the pieces
    const pieceModel = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
    const pieceLayer = {
      id: 'piece-layer',
      scenegraph: pieceModel,
      data: pieceLayerData,
      sizeScale: 30,
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

    this.setState({ 
      pieces: PIECE_STATE_INITIAL,
      pieceLayer, 
      hexagonLayer 
    })
  }

  componentDidUpdate () {
    console.log('componentDidUpdate triggered')
  }

  render () {
    console.log(this.state.pieces)
    console.log(this.state.pieceLayer)
    return (
      <div className="Map">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          debug={true}>
            <ReactMapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
              <Layer {...buildingLayer} />
            </ReactMapGL>
            <HexagonLayer {...this.state.hexagonLayer} />
            <ScenegraphLayer {...this.state.pieceLayer} />
        </DeckGL>
      </div>
    )
  }
}

export default Map;
