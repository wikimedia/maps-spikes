# Tile render benchmark

App to benchmark differenc UI map framework with all available renderers for raster and vector-tile

## Setup

### Api Keys

To test tangram you need to create an API key at https://developers.nextzen.org/

Make sure to replace `MAPTILER_API_KEY` in `highways-scene.yaml` with your key

To test tangram you need to create an API key at https://cloud.maptiler.com/

To test the other vector-tile services you need to replace `MAPTILER_API_KEY` in `osm-bright.yaml` with your key

## Run

This project is using parcel so all you need to do is run:

```
npm install && npm start
```

The app will be accessible at `http://localhost:1234`

## Endpoints

- http://localhost:1234/leaflet/raster
- http://localhost:1234/leaflet/mvt
- http://localhost:1234/leaflet/tangram
- http://localhost:1234/ol/mvt
- http://localhost:1234/ol/raster
- http://localhost:1234/maplibre/mvt
- http://localhost:1234/maplibre/raster
