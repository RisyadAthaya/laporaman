import warningSign from "../assets/warningsign.svg"

function SideBarMaps({ detailsSelected, setDetailsSelected, isEditing, selectedMarkerKey, markersDatabase,
                       draftLocation, draftData, setDraftData, handleSaveDraft }) {

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
                    <h3>{activeMarker.title}</h3>
                    <p>{activeMarker.description}</p>
                  </div>
                ) : (
                  <div className="flex h-full text-center items-center justify-center">
                    <p className="text-s font-bold text-text3">Click a marker to see the details!</p>
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
                    />
                    <textarea
                      placeholder="Description"
                      value={draftData.description || ''}
                      onChange={(e) => setDraftData({ ...draftData, description: e.target.value })}
                      className="p-1 border border-gray-300 rounded resize-y"
                    />

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold">Tingkat Bahaya:</label>
                      <select
                        value={
                          draftData.color === 'red' ? 'Tinggi' :
                            draftData.color === 'orange' ? 'Menengah' :
                              draftData.color === 'yellow' ? 'Rendah' : ''
                        }
                        onChange={(e) => {
                          const level = e.target.value;
                          let newColor = '';
                          if (level === 'Rendah') newColor = 'yellow';
                          if (level === 'Menengah') newColor = 'orange';
                          if (level === 'Tinggi') newColor = 'red';
                          setDraftData({ ...draftData, color: newColor, dangerLevel: level });
                        }}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Pilih tingkat bahaya</option>
                        <option value="Rendah">Rendah</option>
                        <option value="Menengah">Menengah</option>
                        <option value="Tinggi">Tinggi</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold">Kategori Laporan:</label>
                      <select
                        value={draftData.category || ''}
                        onChange={(e) => setDraftData({ ...draftData, category: e.target.value })}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="" disabled>Pilih kategori</option>
                        <option value="Kecelakaan">Kecelakaan</option>
                        <option value="Begal">Begal</option>
                        <option value="Kerusakan Infrastruktur">Kerusakan Infrastruktur</option>
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
                      }}
                      className="button-300 text-white bg-green-700 mt-2 py-1 rounded"
                    >
                      Save
                    </button>
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