import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NewPlanPage from './pages/NewPlanPage'
import EditPlanPage from './pages/EditPlanPage'
import ViewPlanPage from './pages/ViewPlanPage'
import PlansListPage from './pages/PlansListPage'
import AProposPage from './pages/AProposPage'
import ElevesPage from './pages/ElevesPage'
import AppelPage from './pages/AppelPage'
import CahierPage from './pages/CahierPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apropos" element={<AProposPage />} />
        <Route path="/plans" element={<PlansListPage />} />
        <Route path="/plans/new" element={<NewPlanPage />} />
        <Route path="/plans/:id" element={<ViewPlanPage />} />
        <Route path="/plans/:id/edit" element={<EditPlanPage />} />
        <Route path="/eleves" element={<ElevesPage />} />
        <Route path="/appel" element={<AppelPage />} />
        <Route path="/cahier" element={<CahierPage />} />
      </Routes>
    </Layout>
  )
}
