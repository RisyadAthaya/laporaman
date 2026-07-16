import { useState } from 'react'

function SideBarMaps() {
  const [detailsSectionSelected, setDetailsSectionSelected] = useState(true)

  return (
    <div className="flex flex-col w-160">
      <div className="flex flex-row border-b border-gray-300">
        <button
          className={`${detailsSectionSelected ? 'button-sidebar-selected' : 'button-sidebar'}`}
          onClick={() => setDetailsSectionSelected(true)}
        >
          Details
        </button>
        <button
          className={`${!detailsSectionSelected ? 'button-sidebar-selected' : 'button-sidebar'}`}
          onClick={() => setDetailsSectionSelected(false)}
        >
          Lorem Ipsum
        </button>
      </div>
      <div className="p-4 w-full">
        {detailsSectionSelected ? (
          <div>
            <h2 className="text-lg font-bold mb-2">Details</h2>
            <p>This is the details section. You can put your map details, coordinates, or location info here.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Lorem Ipsum</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBarMaps;