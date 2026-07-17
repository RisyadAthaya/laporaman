import { useState } from "react"
import NavBar from "../components/NavBar.jsx"
import Hero from "../components/Hero.jsx"
import Why from "../components/Why.jsx"
import Faq from "../components/Faq.jsx"
import MapRestricted from "../components/MapRestricted.jsx"
import Footer from "../components/Footer.jsx";
import LoginPopup from "../components/LoginPopup.jsx"

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
      <>
        <NavBar />
        <main className="landing-page-main bg-[#F5FDF9]">
          <Hero />
          <MapRestricted onShowLogin={() => setShowLogin(true)} />
          <Why />
          <Faq />
        </main>
        <Footer />
        {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      </>
  )
}

export default LandingPage;