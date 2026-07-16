function SideBarMaps({ detailsSelected, setDetailsSelected, isEditing, selectedMarkerKey, markersDatabase,
                     draftLocation, draftData, setDraftData, handleSaveDraft }) {

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
                {/*Show the details of the clicked marker when not in edit mode*/}
                {markersDatabase.map((marker) => {
                  if (selectedMarkerKey !== marker.key) return null

                  return (
                    <div key={marker.key}>
                      <h3>{marker.title}</h3>
                      <p>{marker.description}</p>
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="text-center items-center">
                {/*Warn that they're in edit mode when in edit mode*/}
                <h2>Yo you're in edit mode dumbahh</h2>
                <p>lmao L analytical skills</p>
              </div>
            )}
          </>
        ) : (
          <div>
            {/*Show the input popup when a position is clicked and is in edit mode*/}
            {draftLocation && (
              <div className="flex flex-col gap-2 p-2 min-w-40">
                <h4>New Marker</h4>
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBarMaps;