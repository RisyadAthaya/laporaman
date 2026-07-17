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
                  <div className="flex flex-col gap-2 p-2 min-w-40">
                    <input
                      type="text"
                      placeholder="Title"
                      value={draftData.title}
                      onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
                      className="p-1"
                    />
                    <textarea
                      placeholder="Description"
                      value={draftData.description}
                      onChange={(e) => setDraftData({ ...draftData, description: e.target.value })}
                      className="p-1 resize-y"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs">Color:</label>
                      <input
                        type="color"
                        value={draftData.color}
                        onChange={(e) => setDraftData({ ...draftData, color: e.target.value })}
                        className="cursor-pointer p-0 border-0 h-6"
                      />
                    </div>
                    <button onClick={handleSaveDraft} className="button-300 text-white bg-green-700">
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