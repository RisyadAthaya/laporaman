
import NavBar from "../components/NavBar.jsx"
import Hero from "../components/Hero.jsx"
import Why from "../components/Why.jsx"
import Faq from "../components/Faq.jsx"
import MapRestricted from "../components/MapRestricted.jsx"
import Footer from "../components/Footer.jsx";

function LandingPage() {

  return (
      <>
        <NavBar />
        <main className="landing-page-main bg-[#F5FDF9]">
          <Hero />
          <MapRestricted />
          <Why />
          <Faq />
        </main>
        <Footer />
      </>
  )
}

export default LandingPage;