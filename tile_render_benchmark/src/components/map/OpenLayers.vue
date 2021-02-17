<template>
  <div id="map"></div>
</template>
<script>
import Map from "ol/Map";
import View from "ol/View";
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import {apply} from "ol-mapbox-style";
import 'ol/ol.css';
const mvtStyle = require('../../../public/osm-bright.json');

export default {
  name: 'OpenLayers',

  props: ["raster"],
  mounted() {
    this.initMap(3, [19.81, 343.21])
  },
  methods: {
    initMap: function (zoom, center) {
      this.mainMap =  new Map({
        target: 'map',
        view: new View({
          constrainResolution: true,
          center: center,
          zoom: zoom
        })
      });
      this.addTileLayer();
    },
    tileUrlFunction: function(coordinate) {
      return 'https://maps.wikimedia.org/osm-intl/' + coordinate[0] + '/' +
          coordinate[1] + '/' + coordinate[2] + '@2x.png';
    },
    addTileLayer: function () {
      if (this.raster) {
        this.mainMap.addLayer(new TileLayer({
          source: new XYZ({
            tileUrlFunction: this.tileUrlFunction
          })
        }))
      } else {
        apply(this.mainMap, mvtStyle);
      }
    }
  }
}
</script>
