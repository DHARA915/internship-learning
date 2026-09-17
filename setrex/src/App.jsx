import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Navbar from './Component/Navbar'
import Homepage from './Page/Homepage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Homepage/>
  )
}

export default App
