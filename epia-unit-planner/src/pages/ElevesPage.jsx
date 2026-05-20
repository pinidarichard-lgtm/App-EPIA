import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ElevesPage() {
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('D1') // 'D1' ou 'D2'
  const [showForm, setShowForm] = useState(false)
  const [editEleve, setEditEleve] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', annee_pd: 'D1', annee_scolaire: '2025-2026' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { fetchEleves() }, [])

  async function fetchEleves() {
    setLoading(true)
    const { data, error } = await supabase
      .from('eleves')
      .select('*')
      .eq('actif', true)
      .order('nom')
    if (!error) setEleves(data || [])
    else setError(error.message)
    setLoading(false)
  }

  async function saveEleve() {
    setSaving(true)
    setError(null)
    if (!form.nom.trim() || !form.prenom.trim()) {
      setError('Nom et prénom obligatoires')
      setSaving(false)
      return
    }
    let err
    if (editEleve) {
      ;({ error: err } = await supabase.from('eleves').update(form).eq('id', editEleve.id))
    } else {
      ;({ error: err } = await supabase.from('eleves').insert([form]))
    }
    if (err) { setError(err.message) } 
    else {
      setShowForm(false)
      setEditEleve(null)
      setForm({ nom: '', prenom: '', annee_pd: tab, annee_scolaire: '2025-2026' })
      fetchEleves()
    }
    setSaving(false)
  }

  async function deleteEleve(id) {
    if (!confirm('Supprimer cet élève ?')) return
    await supabase.from('eleves').update({ actif: false }).eq('id', id)
    fetchEleves()
  }

  function openEdit(e) {
    setEditEleve(e)
    setForm({ nom: e.nom, prenom: e.prenom, annee_pd: e.annee_pd, annee_scolaire: e.annee_scolaire })
    setShowForm(true)
  }

  function openAdd() {
    setEditEleve(null)
    setForm({ nom: '', prenom: '', annee_pd: tab, annee_scolaire: '2025-2026' })
    setShowForm(true)
  }

  const filtered = eleves.filter(e => e.annee_pd === tab)
  const d1Count = eleves.filter(e => e.annee_pd === 'D1').length
  const d2Count = eleves.filter(e => e.annee_pd === 'D2').length

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Listes des élèves</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Gérez les promotions D1 et D2 du Programme du Diplôme</p>
        </div>
        <button onClick={openAdd} style={{ background: '#1a3a5c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          + Ajouter un élève
        </button>
      </div>

      {/* Tabs D1 / D2 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {[['D1', d1Count, '#1a3a5c'], ['D2', d2Count, '#1a6b4a']].map(([key, count, color]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === key ? color : '#e8e6e0',
            color: tab === key ? '#fff' : '#555',
            fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            {key} — {key === 'D1' ? '2024-2025' : '2025-2026'}
            <span style={{
              background: tab === key ? 'rgba(255,255,255,0.25)' : '#ccc',
              color: tab === key ? '#fff' : '#555',
              borderRadius: 20, padding: '1px 8px', fontSize: 12
            }}>{count}</span>
          </button>
        ))}
      </div>

      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '1rem', color: '#991b1b', marginBottom: '1rem' }}>{error}</div>}

      {/* Formulaire ajout/édition */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: '#1a3a5c' }}>
            {editEleve ? 'Modifier l\'élève' : 'Nouvel élève'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1rem' }}>
            {[['Nom', 'nom'], ['Prénom', 'prenom']].map(([label, field]) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>{label}</label>
                <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  placeholder={label} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>Promotion</label>
              <select value={form.annee_pd} onChange={e => setForm(p => ({ ...p, annee_pd: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                <option value="D1">D1 — 2024-2025</option>
                <option value="D2">D2 — 2025-2026</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={saveEleve} disabled={saving} style={{ background: '#1a3a5c', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 7, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {saving ? 'Enregistrement…' : editEleve ? 'Modifier' : 'Ajouter'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '9px 16px', borderRadius: 7, fontSize: 14, cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Chargement…</div>}

      {/* Liste des élèves */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>👥</div>
          <p style={{ color: '#888' }}>Aucun élève dans la promotion {tab}.</p>
          <button onClick={openAdd} style={{ marginTop: '1rem', background: '#1a3a5c', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 7, fontWeight: 600, cursor: 'pointer' }}>
            Ajouter le premier élève
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0', overflow: 'hidden' }}>
          {/* En-tête tableau */}
          <div style={{
            display: 'grid', gridTemplateColumns: '50px 1fr 1fr 120px',
            background: tab === 'D1' ? '#1a3a5c' : '#1a6b4a',
            color: '#fff', padding: '10px 16px', fontSize: 13, fontWeight: 700
          }}>
            <span>N°</span>
            <span>NOM</span>
            <span>PRÉNOM</span>
            <span style={{ textAlign: 'right' }}>ACTIONS</span>
          </div>

          {filtered.map((eleve, idx) => (
            <div key={eleve.id} style={{
              display: 'grid', gridTemplateColumns: '50px 1fr 1fr 120px',
              padding: '10px 16px',
              background: idx % 2 === 0 ? '#fff' : '#f8f7f4',
              borderBottom: '1px solid #eee',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>{idx + 1}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{eleve.nom.toUpperCase()}</span>
              <span style={{ fontSize: 15, color: '#333' }}>{eleve.prenom}</span>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button onClick={() => openEdit(eleve)} style={{ padding: '5px 10px', background: '#f0f4f8', color: '#1a3a5c', border: '1px solid #ddd', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}>✏️</button>
                <button onClick={() => deleteEleve(eleve.id)} style={{ padding: '5px 10px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}

          <div style={{ padding: '10px 16px', background: '#f0f4f8', fontSize: 13, color: '#555', fontWeight: 600 }}>
            Total : {filtered.length} élève{filtered.length > 1 ? 's' : ''} — Promotion {tab} ({tab === 'D1' ? '2024-2025' : '2025-2026'})
          </div>
        </div>
      )}
    </div>
  )
}
