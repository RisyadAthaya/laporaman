import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css';

function MapInteractive() {
  return (
    <Map
      initialViewState={{
        latitude: -6.175,
        longitude: 106.825,
        zoom: 15
      }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >
    </Map>
  )
}

export default MapInteractive