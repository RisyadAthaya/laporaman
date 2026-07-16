import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { fetchAllMarkers } from '../services/markerService.js'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

const initialLongitude = 106.825;
const initialLatitude = -6.175;

const DEFAULT_PREVIEW_PINS = [
  { key: 'p1', longitude: 106.8335, latitude: -6.3315, color: '#FF8125', title: 'Srengseng Sawah', description: 'Orange category warning.' },
  { key: 'p2', longitude: 106.8312, latitude: -6.3395, color: '#FF2525', title: 'Batalyon Zeni Konstruksi', description: 'Red category hazard.' },
  { key: 'p3', longitude: 106.8405, latitude: -6.3382, color: '#FF2525', title: 'Stasiun Universitas Pancasila', description: 'Red category hazard.' },
  { key: 'p4', longitude: 106.8388, latitude: -6.3428, color: '#23B58A', title: 'Jalan Amalia', description: 'Teal category notice.' },
  { key: 'p5', longitude: 106.8322, latitude: -6.3465, color: '#FF8125', title: 'Jalan Mangga', description: 'Orange category warning.' }
];

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

function MapRestricted({ onShowLogin }) {
  const [dbPinpoints, setDbPinpoints] = useState([]);
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const { currentUser } = useAuth();

  const isLoggedIn = !!currentUser;

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const data = await fetchAllMarkers();
        setDbPinpoints(data || []);
      } catch (error) {
        console.error("Gagal mengambil data marker", error);
      }
    };

    loadMarkers();
  }, []);

  const dbPinsMapped = dbPinpoints.map((pin, idx) => ({
    key: pin.key || `db-${idx}`,
    longitude: Number(pin.longitude),
    latitude: Number(pin.latitude),
    color: mapColorToTheme(pin.color),
    title: pin.title || 'Reported Pin',
    description: pin.description || 'No description provided.'
  })).filter(pin => !isNaN(pin.longitude) && !isNaN(pin.latitude));

  const allPins = [...DEFAULT_PREVIEW_PINS, ...dbPinsMapped];

  const handleActionClick = () => {
    if (isLoggedIn) {
      navigate('/maps');
    } else if (onShowLogin) {
      onShowLogin();
    }
  };


  return (
      <section
          className="flex flex-col lg:flex-row items-center justify-between pt-44 pb-20 px-6 lg:px-24 bg-background gap-12 w-full mx-0"
          id="laporan-peta"
          style={{
            backgroundImage: 'linear-gradient(180deg, #028F65 0%,rgba(0, 0, 0, 0) 21%)',
          }}
      >
        <style>{`
        @keyframes customRipple {
          0% {
            transform: scale(0.6);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.15;
          }
          100% {
            transform: scale(0.6);
            opacity: 0.65;
          }
        }
        .animate-custom-ripple {
          animation: customRipple 2s infinite ease-in-out;
        }
      `}</style>

        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-4 bg-[#23B58A]/10 px-3 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-[#23B58A] animate-pulse"></span>
            <span className="text-text2 font-bold text-xs tracking-wider font-sans uppercase">Lorem Ipsum</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-text2 m-0 mb-4 leading-[1.1] font-sans tracking-tight">
            Adalah,<br />
            <span className="text-text1">Pokoknya.</span>
          </h2>

          <p className="text-sm md:text-base text-text3 m-0 mb-8 leading-relaxed max-w-md font-sans">
            Lorem Ipsum
          </p>

          <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={handleActionClick}
                className="add-report-btn"
            >
              Add Report
            </button>
            <button
                type="button"
                onClick={handleActionClick}
                className="see-map-btn"
            >
              See Full Map
            </button>
          </div>
        </div>

        {/* Right Column - Map Card */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-135 bg-white border border-stroke/80 rounded-4xl overflow-hidden shadow-[0_16px_40px_rgba(5,40,73,0.06)] p-3">
            <div className="relative h-105 w-full rounded-3xl overflow-hidden bg-gray-100">
                  <Map
                      initialViewState={{
                        longitude: initialLongitude,
                        latitude: initialLatitude,
                        zoom: 13.8
                      }}
                      maxBounds={[106.81, -6.36, 106.86, -6.31]}
                      mapStyle="https://tiles.openfreemap.org/styles/bright"
                  >
                    {allPins.map((pin) => (
                        <Marker
                            key={pin.key}
                            longitude={pin.longitude}
                            latitude={pin.latitude}
                            onClick={(e) => {
                              e.originalEvent.stopPropagation();
                              setActivePopup(pin);
                            }}
                        >
                          <div className="relative flex items-center justify-center cursor-pointer">
                            {/* Ripple Halo Animation */}
                            <div
                                className="absolute rounded-full animate-custom-ripple"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: pin.color,
                                }}
                            />
                            <div
                                className="relative rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  backgroundColor: pin.color,
                                }}
                            />
                          </div>
                        </Marker>
                    ))}

                    {activePopup && (
                        <Popup
                            longitude={activePopup.longitude}
                            latitude={activePopup.latitude}
                            anchor="bottom"
                            onClose={() => setActivePopup(null)}
                            closeOnClick={true}
                            closeButton={false}
                        >
                          <div className="p-2 text-black max-w-50 font-sans">
                            <h4 className="font-bold border-b border-gray-100 pb-1 mb-1 text-sm text-text2">
                              {activePopup.title}
                            </h4>
                            <p className="text-xs text-text3">
                              {activePopup.description}
                            </p>
                          </div>
                        </Popup>
                    )}
                  </Map>
              )
            </div>

            <div className="w-full text-center py-3 bg-white mt-1 border-t border-gray-50">
              {isLoggedIn ? (
                  <span className="text-xs font-semibold text-text3 font-sans">
                You are signed in.
              </span>
              ) : (
                  <button
                      onClick={onShowLogin}
                      className="text-[13px] font-bold text-text2/80 hover:text-main transition-colors duration-200 bg-transparent border-0 cursor-pointer font-sans"
                  >
                    Sign in to add report and see the full map
                  </button>
              )}
            </div>
          </div>
        </div>
      </section>
  );
}

export default MapRestricted