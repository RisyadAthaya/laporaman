import { Map, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { saveMarker, fetchAllMarkers } from '../services/markerService.js'
import SideBarMaps from "./SideBarMaps.jsx";

const initialLongitude = 106.825;
const initialLatitude = -6.175;

function MapInteractive() {
  const [detailsSectionSelected, setDetailsSectionSelected] = useState(true)
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
    <div className="flex flex-row w-full h-screen relative">
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
        </Map>
      </div>
      <SideBarMaps
        detailsSelected={detailsSectionSelected}
        setDetailsSelected={setDetailsSectionSelected}
        isEditing={isEditMode}
        selectedMarkerKey={activePopupKey}
        markersDatabase={markers}
        draftLocation={draftMarkerLocation}
        draftData={draftMarkerData}
        setDraftData={setDraftMarkerData}
        handleSaveDraft={handleSaveDraftMarker}
      />
    </div>
  )
}

export default MapInteractive