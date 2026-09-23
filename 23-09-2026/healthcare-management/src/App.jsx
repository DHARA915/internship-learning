import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PrimaryLayout from './layout/PrimaryLayout';
import Dashboard from './modules/Dashboard/pages/Dashboard'
import Appointments from './modules/Appointments/pages/Appointments'
import Patients from './modules/Patients/pages/Patients'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrimaryLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
        </Route>
      {/* Default rote */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      </Routes>

    </BrowserRouter>
  )
}

export default App
