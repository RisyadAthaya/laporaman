import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css';

function MapInteractive() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >
    </Map>
  )
}

export default MapInteractive