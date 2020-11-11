import { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL, { Layer }  from 'react-map-gl';
import { ScenegraphLayer } from '@deck.gl/mesh-layers'
import { GLTFLoader } from '@loaders.gl/gltf';
import { registerLoaders } from '@loaders.gl/core';
import { IconLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ToastContainer } from 'react-toastify';

import { createScenegraphLayer, createIconLayer } from '../../utils/layer'
import { UNIT_MODEL_MAP, CLAIM_ICON, PLAYER_COLOR_MAP } from '../../constants'

import 'react-toastify/dist/ReactToastify.css';

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

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

function Map (props) {
 const [pieces, setPieces] = useState([])

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
      switch (props.ctx.phase) {
        case 'setup':
          props.moves.placeUnit(layer.object.position)
          break
        case 'play':
          // Replace with active unit functionality
          const activeUnit = Object.keys(props.G.players[props.ctx.currentPlayer].pieces)[0]

          props.moves.moveUnit(activeUnit, layer.index, layer.object.position)
          break
        default:
          console.error('Unknown phase', props.ctx.phase)
      }
      
      return true
    }
  };

  useEffect(() => {
    const tempPieces = []
    props.G.players.forEach(player => {
      Object.values(player.pieces).forEach(piece => {
        tempPieces.push(
          createScenegraphLayer(
            piece.id,
            UNIT_MODEL_MAP[piece.type],
            piece.coordinates, 30
          )
        )
      })
    })
    setPieces(tempPieces)
  }, [props.G.cells, props.G.players])

  return (
    <div className="Map">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        debug={true}>
          <ReactMapGL mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}>
            <Layer {...threeDLayer} />
          </ReactMapGL>
          <HexagonLayer {...hexagonLayer} />

          {props.G.players.map((player, index) => {
            return player.claims.map(claim => {
              const iconLayer = createIconLayer(
                `icon-${claim[0]},${claim[1]}`,
                CLAIM_ICON,
                ICON_MAPPING,
                PLAYER_COLOR_MAP[index],
                claim
              )
              
              return <IconLayer key={`${claim[0]},${claim[1]}`} {...iconLayer} coordinates={claim} />
            })
          })}

          {pieces.map(piece => (
            <ScenegraphLayer key={piece.id} {...piece} coordinates={piece.data[0].coordinates} />
          ))}
        </DeckGL>
        <ToastContainer />
    </div>
  );
}

export default Map;
