
import NavBar from "../components/NavBar.jsx"
import Hero from "../components/Hero.jsx"
import Why from "../components/Why.jsx"

function LandingPage() {

  return (
      <>
        <NavBar />
        <main className="landing-page-main bg-[#F5FDF9]">
          <Hero />
          <Why />
        </main>
      </>
  )
}

export default LandingPage;