import MapInteractive from "../components/MapInteractive.jsx";
import NavBar from "../components/NavBar.jsx";
import SideBarMaps from "../components/SideBarMaps.jsx";

function FullscreenMapPage() {
  return (
    <div className="w-full h-screen relative flex flex-col">
      <NavBar />
      <div className="flex flex-row w-full h-screen relative">
        <MapInteractive />
        <SideBarMaps />
      </div>
    </div>
  )
}

export default FullscreenMapPage;