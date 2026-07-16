import MapInteractive from "../components/MapInteractive.jsx";
import NavBar from "../components/NavBar.jsx";

function FullscreenMapPage() {
  return (
    <div className="w-full h-screen relative flex flex-col">
      <NavBar />
      <MapInteractive />
    </div>
  )
}

export default FullscreenMapPage;