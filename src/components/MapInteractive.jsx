import { Map, Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { saveMarker, fetchAllMarkers, createNewMarker, getReportCooldownRemaining } from '../services/markerService.js'
import { useAuth } from '../contexts/useAuth.js'
import SideBarMaps from "./SideBarMaps.jsx";

const initialLongitude = 106.825;
const initialLatitude = -6.175;

const mapColorToTheme = (color) => {
  const c = color ? color.toLowerCase() : '';
  if (c.includes('red') || c === '#ff2525' || c === '#e53935' || c === '#ff0000') {
    return '#FF2525';
  }
  if (c.includes('green') || c === '#23b58a' || c === '#00ff00' || c === '#028f65') {
    return '#23B58A';
  }
  return '#FF8125';
};

function MapInteractive() {
  const { currentUser } = useAuth()
  const [detailsSectionSelected, setDetailsSectionSelected] = useState(true)
  const [markers, setMarkers] = useState([]);
  const [activePopupKey, setActivePopupKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftMarkerLocation, setDraftMarkerLocation] = useState(null)
  const [draftMarkerData, setDraftMarkerData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [reportError, setReportError] = useState(null)

  useEffect(() => {
    const loadMarkers = async () => {
      setIsLoading(true);
      const data = await fetchAllMarkers();
      setMarkers(data);
      setIsLoading(false);
    };

    loadMarkers();
  }, []);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const mapHandleClick = (e) => {
    if (!isEditMode) {
      setActivePopupKey(null)
      return null
    }

    setDetailsSectionSelected(false)
    setReportError(null)
    const { lng, lat } = e.lngLat
    setDraftMarkerLocation({ longitude: lng, latitude: lat })
    setDraftMarkerData({ title: "", description: "", color: "#000000" })

    if (currentUser) {
      getReportCooldownRemaining(currentUser.uid).then(setCooldownRemaining);
    }
  }

  const handleSaveDraftMarker = async () => {
    if (!draftMarkerLocation || !currentUser) return;

    if (cooldownRemaining > 0) {
      setReportError(`You're reporting too fast — please wait ${cooldownRemaining}s before submitting another report.`);
      return;
    }

    setIsLoading(true);
    setReportError(null);

    try {
      const newMarker = createNewMarker(draftMarkerLocation, draftMarkerData)
      const cloudKey = await saveMarker(newMarker, currentUser.uid);

      setMarkers((previousMarkers) => [
        ...previousMarkers,
        { ...newMarker, key: cloudKey }
      ]);
      setDraftMarkerLocation(null);
      setDraftMarkerData(null);
      setCooldownRemaining(0);
    } catch (error) {
      setReportError(error.message);
      const remaining = await getReportCooldownRemaining(currentUser.uid);
      setCooldownRemaining(remaining);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-row w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-600/10 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

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
            className="absolute font-bold cursor-pointer text-white w-16 h-16 rounded-full bottom-11 right-3 z-10 transition-all duration-100 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg"
        >
          <Plus className="h-8 w-8 stroke-[3px]" />
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

          {markers.map((marker) => {
            const markerColor = mapColorToTheme(marker.color);

            return (
                <Marker
                    key={marker.key}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      if (!isEditMode) setActivePopupKey(marker.key);
                    }}
                >
                  <div className="relative flex items-center justify-center cursor-pointer animate-scale-in">
                    <div
                        className="relative rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:scale-125 transition-transform duration-200"
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: markerColor,
                        }}
                    />
                  </div>
                </Marker>
            );
          })}
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
          cooldownRemaining={cooldownRemaining}
          reportError={reportError}
      />
    </div>
  )
}

export default MapInteractive;
