import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'

function MapInteractive() {
  const markersData = [
    {
      key: 1,
      latitude: -6.175,
      longitude: 106.825,
      title: "Rumah Ihsan",
      description: "Ihsan ganteng"
    }
  ]

  const [activePopupKey, setActivePopupKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <Map
      initialViewState={{
        latitude: -6.175,
        longitude: 106.825,
        zoom: 15
      }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >
      {markersData.map((marker) => (
        <Marker
          key={marker.key}
          latitude={marker.latitude}
          longitude={marker.longitude}
          color="#000000"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            if (!isEditMode) setActivePopupKey(marker.key);
          }}
        >
        </Marker>
      ))}

      {markersData.map((marker) => {
        if (activePopupKey !== marker.key) return null

        return (
          <Popup
            latitude={marker.latitude}
            longitude={marker.longitude}
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

export default MapInteractive