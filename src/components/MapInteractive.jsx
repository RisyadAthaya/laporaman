import { Map, Marker, Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { saveMarker, fetchAllMarkers, createNewMarker, getReportsRemainingToday } from '../services/markerService.js'
import { useAuth } from '../contexts/useAuth.js'
import { haversineDistanceKm, createGeoJSONCircle, getBoundsForRadius } from '../utils/geo.js'
import SideBarMaps from "./SideBarMaps.jsx";

const DEFAULT_NEARBY_RADIUS_KM = 3;

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
  const mapRef = useRef(null)
  const [detailsSectionSelected, setDetailsSectionSelected] = useState(true)
  const [markers, setMarkers] = useState([]);
  const [activePopupKey, setActivePopupKey] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draftMarkerLocation, setDraftMarkerLocation] = useState(null)
  const [draftMarkerData, setDraftMarkerData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reportsRemainingToday, setReportsRemainingToday] = useState(null)
  const [reportError, setReportError] = useState(null)

  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(DEFAULT_NEARBY_RADIUS_KM)
  const [nearbyCenter, setNearbyCenter] = useState(null)
  const [isPickingCenter, setIsPickingCenter] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    const loadMarkers = async () => {
      setIsLoading(true);
      const data = await fetchAllMarkers();
      setMarkers(data);
      setIsLoading(false);
    };

    loadMarkers();
  }, []);

  const mapHandleClick = (e) => {
    const { lng, lat } = e.lngLat

    if (isPickingCenter) {
      setNearbyCenter({ latitude: lat, longitude: lng, source: 'picked' })
      setIsPickingCenter(false)
      setLocationError(null)
      return null
    }

    if (!isEditMode) {
      setActivePopupKey(null)
      return null
    }

    setDetailsSectionSelected(false)
    setReportError(null)
    setDraftMarkerLocation({ longitude: lng, latitude: lat })
    setDraftMarkerData({ title: "", description: "", color: "#000000" })

    if (currentUser) {
      getReportsRemainingToday(currentUser.uid).then(setReportsRemainingToday);
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
        (position) => {
          setNearbyCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'device'
          });
          setIsLocating(false);
        },
        () => {
          setLocationError("Couldn't get your location. Check your browser's location permission.");
          setIsLocating(false);
        }
    );
  }

  const handleTogglePickCenter = () => {
    setIsPickingCenter((prev) => !prev);
    setLocationError(null);
  }

  const handleSelectNearbyReport = (key) => {
    setActivePopupKey(key);
    setDetailsSectionSelected(true);
  }

  const nearbyReports = useMemo(() => {
    if (!nearbyCenter) return [];

    return markers
        .map((marker) => ({
          ...marker,
          themeColor: mapColorToTheme(marker.color),
          distanceKm: haversineDistanceKm(
              nearbyCenter.latitude,
              nearbyCenter.longitude,
              marker.latitude,
              marker.longitude
          )
        }))
        .filter((marker) => marker.distanceKm <= nearbyRadiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [markers, nearbyCenter, nearbyRadiusKm]);

  const nearbyCircleGeoJSON = useMemo(() => {
    if (!nearbyCenter) return null;
    return createGeoJSONCircle(nearbyCenter.latitude, nearbyCenter.longitude, nearbyRadiusKm);
  }, [nearbyCenter, nearbyRadiusKm]);

  useEffect(() => {
    if (!nearbyCenter || !mapRef.current) return;

    const timeoutId = setTimeout(() => {
      const bounds = getBoundsForRadius(nearbyCenter.latitude, nearbyCenter.longitude, nearbyRadiusKm);
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 800 });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [nearbyCenter, nearbyRadiusKm]);

  const handleSaveDraftMarker = async () => {
    if (!draftMarkerLocation || !currentUser) return;

    if (reportsRemainingToday === 0) {
      setReportError(`You've reached today's report limit — please try again tomorrow.`);
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
      setReportsRemainingToday((previous) => Math.max(0, (previous ?? 1) - 1));
    } catch (error) {
      setReportError(error.message);
      const remaining = await getReportsRemainingToday(currentUser.uid);
      setReportsRemainingToday(remaining);
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
            ref={mapRef}
            initialViewState={{
              longitude: initialLongitude,
              latitude: initialLatitude,
              zoom: 15
            }}
            mapStyle="https://tiles.openfreemap.org/styles/bright"
            onClick={mapHandleClick}
            style={isPickingCenter ? { cursor: 'crosshair' } : undefined}
        >

          {nearbyCircleGeoJSON && (
              <Source type="geojson" data={nearbyCircleGeoJSON}>
                <Layer
                    type="fill"
                    paint={{ 'fill-color': '#008236', 'fill-opacity': 0.08 }}
                />
                <Layer
                    type="line"
                    paint={{ 'line-color': '#008236', 'line-width': 2, 'line-dasharray': [2, 2] }}
                />
              </Source>
          )}

          {nearbyCenter && (
              <Marker longitude={nearbyCenter.longitude} latitude={nearbyCenter.latitude}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-6 h-6 rounded-full bg-main/20 animate-ping" />
                  <div className="relative w-3.5 h-3.5 rounded-full bg-main border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]" />
                </div>
              </Marker>
          )}

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
          reportsRemainingToday={reportsRemainingToday}
          reportError={reportError}
          nearbyRadiusKm={nearbyRadiusKm}
          setNearbyRadiusKm={setNearbyRadiusKm}
          nearbyCenter={nearbyCenter}
          isPickingCenter={isPickingCenter}
          isLocating={isLocating}
          locationError={locationError}
          nearbyReports={nearbyReports}
          onUseMyLocation={handleUseMyLocation}
          onTogglePickCenter={handleTogglePickCenter}
          onSelectNearbyReport={handleSelectNearbyReport}
      />
    </div>
  )
}

export default MapInteractive;
