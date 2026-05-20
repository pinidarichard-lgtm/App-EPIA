import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import UnitPlanForm from '../components/UnitPlanForm'
export default function EditPlanPage() {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    async function loadPlan() {
      try {
        const { data, error } = await supabase.from('unit_plans').select('*').eq('id', id).single()
        if (error) throw error
        setPlan(data)
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }
    }
    loadPlan()
  }, [id])
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Chargement…</div>
  if (error) return <div style={{ padding: '2rem' }}><div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '1rem', color: '#991b1b' }}>Erreur : {error}</div></div>
  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Modifier : {plan.matiere || 'Plan sans titre'}</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{plan.enseignants && `${plan.enseignants} · `}{plan.annee_scolaire}</p>
        </div>
        <Link to={"/plans/" + id} style={{ background: '#f5f5f5', color: '#333', textDecoration: 'none', padding: '9px 16px', borderRadius: 7, fontWeight: 600, fontSize: 14, border: '1px solid #ddd' }}>Voir le plan</Link>
      </div>
      <UnitPlanForm initialData={plan} planId={id} />
    </div>
  )
}