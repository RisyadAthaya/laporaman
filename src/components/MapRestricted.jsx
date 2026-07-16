import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { fetchAllMarkers } from '../services/markerService.js'

const initialLongitude = 106.825;
const initialLatitude = -6.175;

function MapRestricted() {
  const [markers, setMarkers] = useState([]);
  const [activePopupKey, setActivePopupKey] = useState(null)

  // Fetch the markers data
  useEffect(() => {
    const loadMarkers = async () => {
      const data = await fetchAllMarkers();
      setMarkers(data);
    };

    loadMarkers();
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: initialLongitude,
        latitude: initialLatitude,
        zoom: 15
      }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >

      {markers.map((marker) => (
        <Marker
          key={marker.key}
          longitude={marker.longitude}
          latitude={marker.latitude}
          color="#000000"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActivePopupKey(marker.key);
          }}
        >
        </Marker>
      ))}

      {markers.map((marker) => {
        if (activePopupKey !== marker.key) return null

        return (
          <Popup
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            onClose={() => setActivePopupKey(null)}
            closeOnClick={true}
            closeButton={false}
          >
            <h3>{marker.title}</h3>
            <p>{marker.description}</p>
          </Popup>
        )
      })}
    </Map>
  )
}

export default MapRestricted