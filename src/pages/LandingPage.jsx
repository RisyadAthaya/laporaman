
import NavBar from "../components/NavBar.jsx"
import Hero from "../components/Hero.jsx"

function LandingPage() {

  return (
      <>
        <NavBar />
        <main className="landing-page-main bg-[#F5FDF9]">
          <Hero />
        </main>
      </>
  )
}

export default LandingPage;