import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import FullscreenMapPage from "./pages/FullscreenMapPage.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FullscreenMapPage />
  </StrictMode>,
)
