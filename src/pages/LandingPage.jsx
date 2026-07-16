
import NavBar from "../components/NavBar.jsx"
import Hero from "../components/Hero.jsx"
import Why from "../components/Why.jsx"
import Faq from "../components/Faq.jsx"
import MapRestricted from "../components/MapRestricted.jsx"

function LandingPage() {

  return (
      <>
        <NavBar />
        <main className="landing-page-main bg-[#F5FDF9]">
          <Hero />
          <div className="h-100">
            <MapRestricted />
          </div>
          <Why />
          <Faq />
        </main>
      </>
  )
}

export default LandingPage;