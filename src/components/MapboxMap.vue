<template>
  <div class="map-container">
    <div id="mapbox-map" />
    <canvas id="deck-canvas" />
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Map, LngLatLike, MapMouseEvent } from 'mapbox-gl'
import { Deck, FlyToInterpolator } from '@deck.gl/core'
import { MapboxLayer } from '@deck.gl/mapbox'
import { ScenegraphLayer } from '@deck.gl/mesh-layers'
import { registerLoaders } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// https://deck.gl/gallery/mapbox-layer

@Component
export default class MapboxMap extends Vue {
  public map!: Map
  public deck!: Deck
  public layers: { [key: string]: ScenegraphLayer } = {}
  public selectedLayers: ScenegraphLayer[] = []

  private INITIAL_VIEW_STATE = {
    latitude: 40.7135,
    longitude: -74.0066,
    zoom: 15.5,
    bearing: -17.6,
    pitch: 45
  };

  created () {
    registerLoaders([GLTFLoader])
  }

  mounted () {
    this.map = new Map({
      accessToken: 'pk.eyJ1IjoiZ29tb25rZXlhbWFuZ28iLCJhIjoiY2tjc2tjd2UxMHZsMzJxcGQ1YjlpMms3eSJ9._EZ2ZSCNrB8tdYqPhSaYSQ',
      container: 'mapbox-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.INITIAL_VIEW_STATE.longitude, this.INITIAL_VIEW_STATE.latitude],
      zoom: this.INITIAL_VIEW_STATE.zoom,
      bearing: this.INITIAL_VIEW_STATE.bearing,
      pitch: this.INITIAL_VIEW_STATE.pitch,
      antialias: true
    })

    this.deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      initialViewState: this.INITIAL_VIEW_STATE,
      controller: true,
      onViewStateChange: ({ viewState }) => {
        this.map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch
        })
      },
      onClick: ($event: Event) => {
        this.onMapClick($event)
      }
    })

    this.map.on('load', this.onMapLoad)
    this.map.on('click', this.onMapClick)
  }

  private onMapLoad () {
    this.addBuildingLayer()

    this.createScenegraphLayer(
      'duckObject',
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      [this.INITIAL_VIEW_STATE.longitude, this.INITIAL_VIEW_STATE.latitude], 30
    )

    this.createScenegraphLayer(
      'duckObject2',
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      [this.INITIAL_VIEW_STATE.longitude, this.INITIAL_VIEW_STATE.latitude], 30
    )

    this.deck.setProps({
      layers: Object.values(this.layers)
    })
  }

  private onMapClick ($event: Event) {
    this.selectedLayers.forEach((layer: ScenegraphLayer) => {
      this.layers[layer.id] = new ScenegraphLayer({
        ...layer.props,
        data: [{ position: $event.coordinate, size: 100 }]
      })
    })

    this.deck.setProps({
      layers: Object.values(this.layers)
    })

    this.selectedLayers = []
  }

  private addBuildingLayer () {
    const firstLabelLayerId = this.map.getStyle().layers.find((layer: MapboxLayer) => layer.type === 'symbol').id

    this.map.addLayer({
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
    }, firstLabelLayerId)
  }

  private createScenegraphLayer (
    layerId: string,
    scenegraphModelUrl: string,
    coordinates: LngLatLike,
    sizeScale: number): void {
    const layer = new ScenegraphLayer({
      id: layerId,
      scenegraph: scenegraphModelUrl,
      data: [{ position: coordinates, size: 100 }],
      // Render Options
      sizeScale,
      _lighting: 'pbr',
      // Data Accessors
      getPosition: d => d.position,
      getOrientation: [0, 330, 90],
      getTranslation: [0, 0, 0],
      getScale: [1, 1, 1],
      // Interactive props
      pickable: true,
      onClick: (layer: MapboxLayer, $event: Event) => {
        console.log('triggered scenegraphLayer click')
        this.selectedLayers = [
          this.layers[layer.layer.id]
        ]

        return true
      }
    })

    this.layers[layerId] = layer
  }
}
</script>

<style scoped lang="scss">
@import url('https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css');

.map-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
