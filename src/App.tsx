import { Route, Routes } from 'react-router-dom'
import { ScrollManager } from './components/layout/ScrollManager'
import { HomePage } from './pages/HomePage'
import { MateriDetailPage } from './pages/MateriDetailPage'
import { MateriListPage } from './pages/MateriListPage'
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
        <Route path="/materi" element={<MateriListPage />} />
        <Route path="/materi/:slug" element={<MateriDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
