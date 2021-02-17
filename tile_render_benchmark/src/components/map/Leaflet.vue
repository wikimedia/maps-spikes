<template>
  <div id="map"></div>
</template>
<script>
import L from 'leaflet'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl-leaflet'
import Tangram from 'tangram'
import 'leaflet/dist/leaflet.css'
import scene from '../../../public/highways-scene.yaml'

window.mapboxgl = mapboxgl // mapbox-gl-leaflet expects this to be global

const mvtStyle = require('../../../public/osm-bright.json');

export default {
  name: 'Leaflet',
  props: ["source"],
  mounted() {
    console.log(typeof exports)
    this.mainMap = L.map('map')
    this.initMap(3, [19.81, 343.21])
  },
  methods: {
    initMap: function (zoom, center) {
      this.mainMap.setView(center, zoom);
      this.addTileLayer();
    },
    addTileLayer: function () {
      switch (this.source) {
        case 'tangram':
            Tangram.leafletLayer({ scene }).addTo(this.mainMap);
            break;
        case 'mvt':
            L.mapboxGL({
              style: mvtStyle
            }).addTo(this.mainMap);
            break;
        case 'raster':
        default:
            L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png', {}).addTo(this.mainMap);
            break;
      }
    }
  }
}
</script>
<style>
  #map {position: absolute; top: 0; right: 0; bottom: 0; left: 0;}
</style>

