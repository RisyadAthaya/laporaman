import { Map, Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { fetchAllMarkers } from '../services/markerService.js'

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

function MapRestricted() {
  const [markers, setMarkers] = useState([]);
  const [activePopupKey, setActivePopupKey] = useState(null)

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const data = await fetchAllMarkers();
        setMarkers(data || []);
      } catch (error) {
        console.error("Gagal mengambil data marker", error);
      }
    };

    loadMarkers();
  }, []);

  return (
      <Map
          initialViewState={{
            longitude: initialLongitude,
            latitude: initialLatitude,
            zoom: 14
          }}
          style={{ width: '100%', height: '500px' }}
          mapStyle="https://tiles.openfreemap.org/styles/bright"
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
                    setActivePopupKey(marker.key);
                  }}
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  <div
                      className="relative rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform duration-200"
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

        {markers.map((marker) => {
          if (activePopupKey !== marker.key) return null

          return (
              <Popup
                  key={`popup-${marker.key}`}
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  anchor="bottom"
                  onClose={() => setActivePopupKey(null)}
                  closeOnClick={true}
                  closeButton={false}
              >
                <div className="p-2 text-black max-w-50 font-sans">
                  <h4 className="font-bold border-b border-gray-100 pb-1 mb-1 text-sm">
                    {marker.title}
                  </h4>
                  <p className="text-xs text-gray-600 m-0">
                    {marker.description}
                  </p>
                </div>
              </Popup>
          )
        })}
      </Map>
  )
}

export default MapRestricted