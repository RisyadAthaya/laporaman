import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'

function MapRestricted() {
  const [activePopupKey, setActivePopupKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const markersData = [
    {
      key: 1,
      longitude: 106.825,
      latitude: -6.175,
      title: "Rumah Ihsan",
      description: "Ihsan ganteng"
    }
  ]

  return (
    <Map
      initialViewState={{
        longitude: 106.825,
        latitude: -6.175,
        zoom: 15
      }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >

      {markersData.map((marker) => (
        <Marker
          key={marker.key}
          longitude={marker.longitude}
          latitude={marker.latitude}
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