import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { exportPlanPDF } from '../lib/pdfExport'

const GROUPES = ['Groupe 1','Groupe 2','Groupe 3','Groupe 4','Groupe 5','Groupe 6']

export default function PlansListPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterNiveau, setFilterNiveau] = useState('')
  const [filterGroupe, setFilterGroupe] = useState('')

  useEffect(() => { fetchPlans() }, [])

  async function fetchPlans() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('unit_plans').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setPlans(data || [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function deletePlan(id) {
    if (!confirm("Supprimer ce plan ?")) return
    const { error } = await supabase.from('unit_plans').delete().eq('id', id)
    if (!error) setPlans(plans.filter(p => p.id !== id))
  }

  const filtered = plans.filter(p => {
    const q = search.toLowerCase()
    return (!q || (p.matiere||'').toLowerCase().includes(q) || (p.enseignants||'').toLowerCase().includes(q))
      && (!filterNiveau || (p.niveau||'').includes(filterNiveau))
      && (!filterGroupe || (p.groupe_matieres||'').includes(filterGroupe))
  })

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Plans d'unite</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{plans.length} plan{plans.length > 1 ? 's' : ''} enregistre{plans.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/plans/new" style={{ background: '#1a3a5c', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>+ Nouveau plan</Link>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Rechercher par matiere ou enseignant..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
        <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">Tous les niveaux</option>
          <option value="NM">NM</option><option value="NS">NS</option>
        </select>
        <select value={filterGroupe} onChange={e => setFilterGroupe(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">Tous les groupes</option>
          {GROUPES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Chargement...</div>}
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '1rem', color: '#991b1b', marginBottom: '1rem' }}>Erreur : {error}</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 12, border: '1px solid #e8e6e0' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>📋</div>
          <p style={{ color: '#888', fontSize: 16 }}>{plans.length === 0 ? "Aucun plan d'unite pour l'instant." : 'Aucun resultat.'}</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(plan => <PlanCard key={plan.id} plan={plan} onDelete={deletePlan} />)}
      </div>
    </div>
  )
}

function PlanCard({ plan, onDelete }) {
  const niveauColor = (plan.niveau||'').includes('NS') ? '#1a6b4a' : '#1a3a5c'
  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#1a1a1a' }}>{plan.matiere || 'Matiere non definie'}</span>
          {plan.niveau && <span style={{ background: niveauColor + '15', color: niveauColor, fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{plan.niveau}</span>}
          {plan.annee_pd && <span style={{ background: '#f0f0f0', color: '#555', fontSize: 12, padding: '2px 8px', borderRadius: 20 }}>{plan.annee_pd}e annee PD</span>}
          <span style={{ background: plan.statut === 'publie' ? '#e8f5e9' : '#fff8e1', color: plan.statut === 'publie' ? '#1a6b4a' : '#856404', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: '1px solid ' + (plan.statut === 'publie' ? '#a5d6a7' : '#ffd54f') }}>
            {plan.statut === 'publie' ? 'Publie' : plan.statut === 'publié' ? 'Publie' : 'Brouillon'}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {plan.enseignants && <span>👤 {plan.enseignants}</span>}
          {plan.groupe_matieres && <span>📚 {plan.groupe_matieres}</span>}
          {plan.annee_scolaire && <span>📅 {plan.annee_scolaire}</span>}
          <span>Cree le {dateStr}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
        <Link to={"/plans/" + plan.id} style={{ padding: '7px 14px', background: '#1a3a5c', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Voir</Link>
        <Link to={"/plans/" + plan.id + "/edit"} style={{ padding: '7px 14px', background: '#f5f5f5', color: '#333', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid #ddd' }}>Modifier</Link>
        <button onClick={() => exportPlanPDF(plan)} style={{ padding: '7px 14px', background: '#eef2f7', color: '#1a3a5c', borderRadius: 6, fontSize: 13, fontWeight: 600, border: '1px solid #c5d5e8', cursor: 'pointer' }}>⬇ PDF</button>
        <button onClick={() => onDelete(plan.id)} style={{ padding: '7px 14px', background: '#fef2f2', color: '#991b1b', borderRadius: 6, fontSize: 13, fontWeight: 600, border: '1px solid #fca5a5', cursor: 'pointer' }}>Suppr.</button>
      </div>
    </div>
  )
}
