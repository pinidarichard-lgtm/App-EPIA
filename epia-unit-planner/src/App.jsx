import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NewPlanPage from './pages/NewPlanPage'
import EditPlanPage from './pages/EditPlanPage'
import ViewPlanPage from './pages/ViewPlanPage'
import PlansListPage from './pages/PlansListPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans" element={<PlansListPage />} />
        <Route path="/plans/new" element={<NewPlanPage />} />
        <Route path="/plans/:id" element={<ViewPlanPage />} />
        <Route path="/plans/:id/edit" element={<EditPlanPage />} />
      </Routes>
    </Layout>
  )
}
