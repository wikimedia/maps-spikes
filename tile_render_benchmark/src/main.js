import Vue from "vue";
import Router from "vue-router";
import AppMain from "./AppMain";
import Leaflet from "./components/map/Leaflet";
import OpenLayers from "./components/map/OpenLayers";
import Maplibre from "./components/map/Maplibre";

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        { path: "/leaflet/raster", component: Leaflet, props: { source: 'raster' } },
        { path: "/leaflet/mvt", component: Leaflet, props: { source: 'mvt' } },
        { path: "/leaflet/tangram", component: Leaflet, props: { source: 'tangram' } },
        { path: "/ol/mvt", component: OpenLayers, props: { raster: false } },
        { path: "/ol/raster", component: OpenLayers, props: { raster: true } },
        { path: "/maplibre/mvt", component: Maplibre, props: { source: 'mvt' } },
        { path: "/maplibre/raster", component: Maplibre, props: { source: 'raster' } },
    ],
    linkExactActiveClass: "active"
});

new Vue({
    el: "#app",
    render: h => h(AppMain),
    router,
});

