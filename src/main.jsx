import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import FullscreenMapPage from "./pages/FullscreenMapPage.jsx";
import LandingPage from './pages/LandingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
