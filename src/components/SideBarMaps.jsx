import warningSign from "../assets/warningsign.svg"
import {LocateFixed, Crosshair, MapPin, Clock} from "lucide-react"
import { formatDistance } from "../utils/geo.js"

function SideBarMaps({ detailsSelected, setDetailsSelected, isEditing, selectedMarkerKey, markersDatabase,
                       draftLocation, draftData, setDraftData, handleSaveDraft, reportsRemainingToday, reportError,
                       nearbyRadiusKm, setNearbyRadiusKm, nearbyCenter, isPickingCenter, isLocating, locationError,
                       nearbyReports, onUseMyLocation, onTogglePickCenter, onSelectNearbyReport }) {

  const activeMarker = markersDatabase.find(marker => marker.key === selectedMarkerKey);

  return (
    <div className="flex flex-col w-160 rounded-tl-4xl rounded-bl-4xl">
      <div className="flex flex-row border-b border-gray-300">
        <button
          className={`${detailsSelected ? 'button-sidebar-selected' : 'button-sidebar'}`}
          onClick={() => setDetailsSelected(true)}
        >
          Details
        </button>
        <button
          className={`${!detailsSelected ? 'button-sidebar-selected' : 'button-sidebar'}`}
          onClick={() => setDetailsSelected(false)}
        >
          Report an Incident
        </button>
      </div>
      <div className="p-4 w-full h-full">
        {detailsSelected ? (
          <>
            {!isEditing ? (
              <>
                {activeMarker ? (
                  <div key={activeMarker.key}>
                    <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">

                      <div className="flex flex-wrap gap-2">
                        <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-[#028F65] rounded-full border border-emerald-100">
                          {activeMarker.category}
                        </span>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                          activeMarker.dangerLevel === "Tinggi"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : activeMarker.dangerLevel === "Sedang"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-teal-50 text-teal-600 border-teal-100"
                        }`}>
                          Danger: {activeMarker.dangerLevel}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-text2 leading-tight font-sans">
                          {activeMarker.title}
                        </h2>
                        <p className="text-[11px] text-text3/50 mt-1.5 font-sans">
                          Dilaporkan oleh <span className="font-semibold text-text3/80">Anonymous</span> • <Clock className="w-3 h-3 inline ml-0.5 mr-0.5" /> {activeMarker.time}
                        </p>
                      </div>

                      <div className="bg-[#F3FAF6] border border-stroke/40 p-5 rounded-2xl text-[13px] text-text3 leading-relaxed font-sans shadow-inner">
                        {activeMarker.description}
                      </div>

                      <div className="border border-stroke/70 bg-white p-4 rounded-xl font-sans">
                        <span className="text-xs font-bold text-text2 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                          <MapPin className="w-4 h-4 text-red-500" /> Titik Penanganan Lokasi
                        </span>
                        <p className="text-xs font-semibold text-text2 mb-1 pl-5">
                          {activeMarker.locationName}
                        </p>
                        <p className="text-[10px] text-text3/50 font-mono pl-5">
                          Koordinat: Lat {Number(activeMarker.latitude).toFixed(4)}, Lng {Number(activeMarker.longitude).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text3 flex justify-between mb-1">
                        <span>Radius Laporan Terdekat</span>
                        <span className="text-main font-bold">{formatDistance(nearbyRadiusKm)}</span>
                      </label>
                      <input
                        type="range"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={nearbyRadiusKm}
                        onChange={(e) => setNearbyRadiusKm(Number(e.target.value))}
                        className="w-full accent-main cursor-pointer"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onUseMyLocation}
                        disabled={isLocating}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-colors cursor-pointer ${
                          nearbyCenter?.source === 'device'
                            ? 'bg-main text-white border-main'
                            : 'bg-white text-text3 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <LocateFixed className="w-3.5 h-3.5" />
                        {isLocating ? 'Mencari...' : 'Lokasi Saya'}
                      </button>
                      <button
                        type="button"
                        onClick={onTogglePickCenter}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-colors cursor-pointer ${
                          isPickingCenter
                            ? 'bg-main text-white border-main'
                            : nearbyCenter?.source === 'picked'
                              ? 'bg-main/10 text-main border-main'
                              : 'bg-white text-text3 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        {isPickingCenter ? 'Klik peta...' : 'Pilih di Peta'}
                      </button>
                    </div>

                    {locationError && (
                      <p className="text-[11px] font-semibold text-red-600">{locationError}</p>
                    )}

                    <div className="flex-grow overflow-y-auto min-h-0">
                      {!nearbyCenter ? (
                        <div className="flex h-full text-center items-center justify-center">
                          <p className="text-s font-bold text-text3">Set lokasi untuk melihat laporan terdekat!</p>
                        </div>
                      ) : nearbyReports.length === 0 ? (
                        <div className="flex h-full text-center items-center justify-center">
                          <p className="text-xs font-semibold text-text3">Tidak ada laporan dalam radius {nearbyRadiusKm} km.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {nearbyReports.map((report) => (
                            <button
                              key={report.key}
                              type="button"
                              onClick={() => onSelectNearbyReport(report.key)}
                              className="text-left flex items-start gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-main hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <span
                                className="w-2.5 h-2.5 mt-1 rounded-full shrink-0"
                                style={{ backgroundColor: report.themeColor }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-text2 truncate">{report.title || 'Laporan Baru'}</p>
                                <p className="text-[10.5px] text-text3/70 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  {formatDistance(report.distanceKm)} away
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col h-full text-center items-center justify-center gap-4">
                {/*Warn that they're in edit mode when in edit mode*/}
                <img src={warningSign}  alt="Warning sign" className="w-12 opacity-20"/>
                <p className="text-s font-bold text-text3">You're currently in edit mode!<br/>Switch back to view mode to see the detail of this marker.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                {draftLocation ? (
                  <div className="flex flex-col gap-3 p-2 min-w-40">
                    <input
                      type="text"
                      placeholder="Title"
                      value={draftData.title || ''}
                      onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                      className="p-1 border border-gray-300 rounded"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={draftData.description || ''}
                      onChange={(e) => setDraftData({ ...draftData, description: e.target.value })}
                      className="p-1 border border-gray-300 rounded resize-y"
                      required
                    />

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold">Tingkat Bahaya:</label>
                      <select
                        value={
                          draftData.color === 'red' ? 'Tinggi' :
                            draftData.color === 'orange' ? 'Sedang' :
                              draftData.color === 'green' ? 'Rendah' : ''
                        }
                        onChange={(e) => {
                          const level = e.target.value;
                          let newColor = '';
                          if (level === 'Rendah') newColor = 'green';
                          if (level === 'Sedang') newColor = 'orange';
                          if (level === 'Tinggi') newColor = 'red';
                          setDraftData({ ...draftData, color: newColor, dangerLevel: level });
                        }}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Pilih tingkat bahaya</option>
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                      </select>
                    </div>
                    {reportError && (
                      <p className="text-xs font-semibold text-red-600">{reportError}</p>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold">Kategori Laporan:</label>
                      <select
                        value={draftData.category || ''}
                        onChange={(e) => setDraftData({ ...draftData, category: e.target.value })}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Pilih kategori</option>
                        <option value="Kerusakan Infrastruktur">Kerusakan Infrastruktur</option>
                        <option value="Lampu Jalan Mati">Lampu Jalan Mati</option>
                        <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                        <option value="Keamanan & Kriminalitas">Keamanan & Kriminalitas</option>
                        <option value="Bencana Alam & Banjir">Bencana Alam & Banjir</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        const currentTime = new Date().toLocaleString();
                        setDraftData(prevData => ({ ...prevData, time: currentTime }));
                        // Using a brief timeout ensures the state update has time to process
                        // before the parent's handleSaveDraft function is executed.
                        setTimeout(() => handleSaveDraft(), 0);
                      }} disabled={reportsRemainingToday === 0}
                      className="button-300 text-white bg-green-700 mt-2 py-1 rounded"
                    >
                      {reportsRemainingToday === 0 ? "Daily limit reached" : "Save"}
                    </button>
                    {reportsRemainingToday > 0 && (
                      <p className="text-xs text-text3">{reportsRemainingToday} report{reportsRemainingToday === 1 ? "" : "s"} left today</p>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full text-center items-center justify-center">
                    <p className="text-s font-bold text-text3">Click a location to start reporting!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col h-full text-center items-center justify-center gap-4">
                  {/*Warn that they're not in edit mode*/}
                  <img src={warningSign}  alt="Warning sign" className="w-12 opacity-20"/>
                  <p className="text-s font-bold text-text3">You're currently in view mode!<br/>Switch to edit mode to report an incident.</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SideBarMaps;