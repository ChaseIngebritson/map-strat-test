import { useState } from 'react';
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

function Map (props) {
  const [model1Coords, setModel1Coords] = useState([INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude]);
  const [model2Coords, setModel2Coords] = useState([INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude]);

  // console.log(props)

  const threeDLayer = {
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

  const hexagonLayer = {
    id: 'hexagon-layer',
    data: props.G.cells,
    pickable: true,
    extruded: true,
    radius: 50,
    elevationScale: 0,
    autoHighlight: true,
    opacity: 0.3,
    getPosition: d => d.COORDINATES,
    onClick: (layer, $event) => {
      console.log('triggered hexagonLayer click', layer)
      props.moves.clickCell(layer.index);

      switch (props.ctx.currentPlayer) {
        case '0':
          setModel1Coords(layer.object.position)
          break
        case '1':
          setModel2Coords(layer.object.position)
          break
        default:
          console.log('invalid player')
          break
      }
      
      return true
    }
  };

  const model1 = createScenegraphLayer(
    'duckObject1',
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    model1Coords, 30
  )

  const model2 = createScenegraphLayer(
    'duckObject2',
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    model2Coords, 30
  )

  return (
    <div className="Map">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        debug={true}>
          <ReactMapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
            <Layer {...threeDLayer} />
          </ReactMapGL>
          <HexagonLayer  {...hexagonLayer} />
          <ScenegraphLayer {...model1} coordinates={model1Coords} />
          <ScenegraphLayer {...model2} coordinates={model2Coords} />
        </DeckGL>
    </div>
  );
}

export default Map;
