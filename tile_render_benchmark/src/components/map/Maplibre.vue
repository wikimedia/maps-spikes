<template>
  <div id="map"></div>
</template>
<script>
import maplibre from 'maplibre-gl'
import 'maplibre-gl/dist/mapbox-gl.css'
import Tangram from "tangram";
import scene from "../../../public/highways-scene.yaml";
import L from "leaflet";

const style = require('../../../public/osm-bright.json');

export default {
  name: 'Maplibre',
  props: ["source"],
  data() {
    return {
      rasterStyle: {
        'version': 8,
        'sources': {
          'raster-tiles': {
            'type': 'raster',
            'tiles': [
              'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png'
            ],
            'tileSize': 512,
            'attribution':
                'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
          }
        },
        'layers': [
          {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles',
            'minzoom': 0,
            'maxzoom': 22
          }
        ]
      }

    }
  },
  mounted() {
    this.initMap(2, [343.21, 19.81])
  },
  methods: {
    initMap: function (zoom, center) {
      this.mainMap = new maplibre.Map({
        container: "map",
        style: this.getStyle(),
        center,
        zoom
      })

      this.mainMap.addControl(
          new maplibre.GeolocateControl()
      )
    },
    getStyle: function () {
      switch (this.source) {
        case 'mvt':
          return style;
        case 'raster':
        default:
          return this.rasterStyle
          break;
      }
    }
  }
}
</script>
<style>
  #map {position: absolute; top: 0; right: 0; bottom: 0; left: 0;}
</style>

