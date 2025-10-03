import { useState } from 'react'
import './App.css'
import FaceDetectionCamera from './components/FaceDetectionCamera'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <FaceDetectionCamera/>
   </>
  )
}

export default App
