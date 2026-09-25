import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimaryLayout from './Layout/PrimaryLayout'
import Chatwindow from './modules/Chatwindow/Chatwindow'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrimaryLayout />}>
          <Route path="/" element={<Chatwindow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
