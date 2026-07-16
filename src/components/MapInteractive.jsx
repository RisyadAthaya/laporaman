import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { saveMarker, fetchAllMarkers } from '../services/markerService.js'

const initialLongitude = 106.825;
const initialLatitude = -6.175;

function MapInteractive() {
  const [markers, setMarkers] = useState([]);
  const [activePopupKey, setActivePopupKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftMarkerLocation, setDraftMarkerLocation] = useState(null)
  const [draftMarkerData, setDraftMarkerData] = useState(null)

  // Fetch the markers data
  useEffect(() => {
    const loadMarkers = async () => {
      const data = await fetchAllMarkers();
      setMarkers(data);
    };

    loadMarkers();
  }, []);

  const mapHandleClick = (e) => {
    if (!isEditMode || draftMarkerLocation) return null

    const { lng, lat } = e.lngLat
    setDraftMarkerLocation({ longitude: lng, latitude: lat })
    setDraftMarkerData({ title: "", description: "", color: "#000000" })
  }

  const handleSaveDraftMarker = async () => {
    if (!draftMarkerLocation) return;

    const newMarker = {
      longitude: draftMarkerLocation.longitude,
      latitude: draftMarkerLocation.latitude,
      color: draftMarkerData.color,
      title: draftMarkerData.title || "Untitled Marker",
      description: draftMarkerData.description
    };

    const cloudKey = await saveMarker(newMarker);

    if (cloudKey) {
      setMarkers((previousMarkers) => [
        ...previousMarkers,
        { ...newMarker, key: cloudKey }
      ]);
      setDraftMarkerLocation(null);
    }
  }

  return (
    <div className="w-full h-full relative">
      <button
        type="button"
        onClick={() => {
          setIsEditMode(!isEditMode);
          setDraftMarkerLocation(null);
        }}
        style={{
          backgroundColor: isEditMode ? '#E53935' : '#008236'
        }}
          className="absolute font-bold cursor-pointer text-white w-16 h-16 rounded-full bottom-11 right-3 z-10 transition-all duration-100"
      >
        <div className="flex items-center justify-center">
          <Plus className="h-8 w-8 stroke-[3px]" />
        </div>
      </button>
      <Map
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: 15
        }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        onClick={mapHandleClick}
      >

        {/*Load the markers contained in the database*/}
        {markers.map((marker) => (
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

        {/*Show the popup of a marker when clicked*/}
        {markers.map((marker) => {
          if (activePopupKey !== marker.key) return null

          return (
            <Popup
              key={marker.key}
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

        {/*Show the input popup when a position is clicked and is in edit mode*/}
        {draftMarkerLocation && (
          <Popup
            longitude={draftMarkerLocation.longitude}
            latitude={draftMarkerLocation.latitude}
            anchor="bottom"
            onClose={() => setDraftMarkerLocation(null)}
            closeOnClick={true}
            closeButton={false}
          >
            <div className="flex flex-col gap-2 p-2 min-w-40">
              <h4>New Marker</h4>
              <input
                type="text"
                placeholder="Title"
                value={draftMarkerData.title}
                onChange={(e) => setDraftMarkerData({ ...draftMarkerData, title: e.target.value })}
                className="p-1"
              />
              <textarea
                placeholder="Description"
                value={draftMarkerData.description}
                onChange={(e) => setDraftMarkerData({ ...draftMarkerData, description: e.target.value })}
                className="p-1 resize-y"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs">Color:</label>
                <input
                  type="color"
                  value={draftMarkerData.color}
                  onChange={(e) => setDraftMarkerData({ ...draftMarkerData, color: e.target.value })}
                  className="cursor-pointer p-0 border-0 h-6"
                />
              </div>
              <button onClick={handleSaveDraftMarker} className="button-300 text-white bg-green-700">
                Save
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

export default MapInteractive