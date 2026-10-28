import { Route, Routes } from 'react-router-dom'
import { ScrollManager } from './components/layout/ScrollManager'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { ScanPage } from './pages/ScanPage'

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/latihan" element={<PracticePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
