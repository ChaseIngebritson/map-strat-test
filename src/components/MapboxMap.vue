<template>
  <div id="mapbox-map">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Map, LngLatLike } from 'mapbox-gl'
import { MapboxLayer } from '@deck.gl/mapbox'
import { ScenegraphLayer } from '@deck.gl/mesh-layers'
import { registerLoaders } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// https://deck.gl/gallery/mapbox-layer

@Component
export default class MapboxMap extends Vue {
  @Prop() center!: LngLatLike

  public map!: Map
  public layers: MapboxLayer[] = []

  created () {
    registerLoaders([GLTFLoader])
  }

  mounted () {
    this.map = new Map({
      accessToken: 'pk.eyJ1IjoiZ29tb25rZXlhbWFuZ28iLCJhIjoiY2tjc2tjd2UxMHZsMzJxcGQ1YjlpMms3eSJ9._EZ2ZSCNrB8tdYqPhSaYSQ',
      container: 'mapbox-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    })

    this.map.on('load', this.onMapLoad)
  }

  private onMapLoad () {
    this.addBuildingLayer()

    this.createDeck3dObjectLayer(
      'duckObject',
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      this.center, 30
    )
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

  private createDeck3dObjectLayer (
    layerId: string,
    scenegraphModelUrl: string,
    coordinates: LngLatLike,
    sizeScale: number): void {
    const layer = new MapboxLayer({
      id: layerId,
      type: ScenegraphLayer,
      scenegraph: scenegraphModelUrl,
      data: [{ position: coordinates, size: 100 }],
      getPosition: d => d.position,
      sizeScale,
      getOrientation: [0, 330, 90],
      getTranslation: [0, 0, 0],
      getScale: [1, 1, 1],
      pickable: true,
      _lighting: 'pbr',

      onClick: ($event: Event) => {
        console.log($event)
        alert('Hello! I am a duck and I am guarding my work!!')
      }
    })

    this.map.addLayer(layer)
  }
}
</script>

<style scoped lang="scss">
@import url('https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css');

#mapbox-map {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
