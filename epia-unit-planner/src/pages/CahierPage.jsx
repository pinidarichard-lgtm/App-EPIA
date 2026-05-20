import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const MATIERES = ['Biologie', 'Chimie', 'Économie', 'Français A', 'Français B', 'Histoire', 'Informatique', 'Mathématiques', 'Physique', 'Psychologie', 'Anglais A', 'Anglais B', 'Arts visuels', 'Musique', 'Théâtre']

const INITIAL = {
  date_cours: new Date().toISOString().split('T')[0],
  matiere: '', enseignant: '', annee_pd: '', niveau: '',
  contenu: '', devoirs: '', observations: '', annee_scolaire: '2025-2026'
}

export default function CahierPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  // Filtres
  const [filterMatiere, setFilterMatiere] = useState('')
  const [filterPromo, setFilterPromo] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchEntries() }, [])

  async function fetchEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('cahier_textes')
      .select('*')
      .order('date_cours', { ascending: false })
    if (!error) setEntries(data || [])
    else setError(error.message)
    setLoading(false)
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  async function saveEntry() {
    if (!form.matiere || !form.date_cours) { setError('Date et matière obligatoires'); return }
    setSaving(true); setError(null)
    let err
    if (editEntry) {
      ;({ error: err } = await supabase.from('cahier_textes').update(form).eq('id', editEntry.id))
    } else {
      ;({ error: err } = await supabase.from('cahier_textes').insert([form]))
    }
    if (err) setError(err.message)
    else {
      setSaved(true); setTimeout(() => setSaved(false), 3000)
      setShowForm(false); setEditEntry(null); setForm(INITIAL)
      fetchEntries()
    }
    setSaving(false)
  }

  async function deleteEntry(id) {
    if (!confirm('Supprimer cette entrée ?')) return
    await supabase.from('cahier_textes').delete().eq('id', id)
    fetchEntries()
  }

  function openEdit(e) {
    setEditEntry(e)
    setForm({ date_cours: e.date_cours, matiere: e.matiere, enseignant: e.enseignant || '', annee_pd: e.annee_pd || '', niveau: e.niveau || '', contenu: e.contenu || '', devoirs: e.devoirs || '', observations: e.observations || '', annee_scolaire: e.annee_scolaire || '2025-2026' })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtered = entries.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || (e.matiere || '').toLowerCase().includes(q) || (e.enseignant || '').toLowerCase().includes(q) || (e.contenu || '').toLowerCase().includes(q)
    const matchMatiere = !filterMatiere || e.matiere === filterMatiere
    const matchPromo = !filterPromo || (e.annee_pd || '').includes(filterPromo)
    return matchSearch && matchMatiere && matchPromo
  })

  // Grouper par matière pour la vue
  const matieresCahier = [...new Set(entries.map(e => e.matiere))].sort()

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Cahier de textes</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{entries.length} entrée{entries.length > 1 ? 's' : ''} enregistrée{entries.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditEntry(null); setForm(INITIAL) }}
          style={{ background: '#1a3a5c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          {showForm ? '✕ Fermer' : '+ Nouvelle entrée'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: '#1a3a5c' }}>
            {editEntry ? 'Modifier l\'entrée' : 'Nouvelle entrée du cahier'}
          </h3>
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '0.75rem', color: '#991b1b', marginBottom: '1rem', fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Date *</label>
              <input type="date" value={form.date_cours} onChange={set('date_cours')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Matière *</label>
              <select value={form.matiere} onChange={set('matiere')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                <option value="">Sélectionner…</option>
                {MATIERES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Enseignant(e)</label>
              <input value={form.enseignant} onChange={set('enseignant')} placeholder="Nom"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Promotion</label>
              <select value={form.annee_pd} onChange={set('annee_pd')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                <option value="">Toutes</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D1/D2">D1 et D2</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Niveau</label>
              <select value={form.niveau} onChange={set('niveau')}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                <option value="">—</option>
                <option value="NM">NM</option>
                <option value="NS">NS</option>
                <option value="NM/NS">NM et NS</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>📖 Contenu du cours</label>
            <textarea value={form.contenu} onChange={set('contenu')} rows={4}
              placeholder="Décrivez ce qui a été fait durant ce cours…"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>📝 Devoirs / Travaux à faire</label>
            <textarea value={form.devoirs} onChange={set('devoirs')} rows={3}
              placeholder="Exercices, lectures, révisions à faire pour le prochain cours…"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>💬 Observations</label>
            <textarea value={form.observations} onChange={set('observations')} rows={2}
              placeholder="Remarques particulières, comportement, incidents…"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={saveEntry} disabled={saving} style={{ background: '#1a3a5c', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 7, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {saving ? 'Enregistrement…' : editEntry ? '✓ Modifier' : '✓ Enregistrer'}
            </button>
            <button onClick={() => { setShowForm(false); setEditEntry(null) }}
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '9px 16px', borderRadius: 7, fontSize: 14, cursor: 'pointer' }}>
              Annuler
            </button>
            {saved && <span style={{ color: '#1a6b4a', fontWeight: 600, fontSize: 14 }}>✓ Enregistré !</span>}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Rechercher par matière, enseignant, contenu…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
        <select value={filterMatiere} onChange={e => setFilterMatiere(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">Toutes les matières</option>
          {matieresCahier.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={filterPromo} onChange={e => setFilterPromo(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
          <option value="">D1 et D2</option>
          <option value="D1">D1 seulement</option>
          <option value="D2">D2 seulement</option>
        </select>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Chargement…</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>📒</div>
          <p style={{ color: '#888' }}>Aucune entrée dans le cahier de textes.</p>
        </div>
      )}

      {/* Entrées */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(entry => (
          <div key={entry.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0', overflow: 'hidden' }}>
            {/* En-tête entrée */}
            <div style={{ background: '#1a3a5c', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{entry.matiere}</span>
                {entry.annee_pd && <span style={{ background: 'rgba(232,184,75,0.3)', color: '#e8b84b', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{entry.annee_pd}</span>}
                {entry.niveau && <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, padding: '2px 8px', borderRadius: 20 }}>{entry.niveau}</span>}
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  📅 {new Date(entry.date_cours).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {entry.enseignant && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>· 👤 {entry.enseignant}</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(entry)} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}>✏️ Modifier</button>
                <button onClick={() => deleteEntry(entry.id)} style={{ padding: '5px 12px', background: 'rgba(220,50,50,0.3)', color: '#ffcccc', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 5, fontSize: 12, cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>

            {/* Corps de l'entrée */}
            <div style={{ padding: '1rem 1.25rem' }}>
              {entry.contenu && (
                <div style={{ marginBottom: entry.devoirs || entry.observations ? '0.875rem' : 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a3a5c', marginBottom: 4 }}>📖 Contenu du cours</div>
                  <p style={{ fontSize: 14, color: '#333', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{entry.contenu}</p>
                </div>
              )}
              {entry.devoirs && (
                <div style={{ marginBottom: entry.observations ? '0.875rem' : 0, background: '#fffdf0', borderLeft: '3px solid #e8b84b', padding: '0.625rem 0.875rem', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#856404', marginBottom: 4 }}>📝 Devoirs</div>
                  <p style={{ fontSize: 14, color: '#333', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{entry.devoirs}</p>
                </div>
              )}
              {entry.observations && (
                <div style={{ background: '#f0f7ff', borderLeft: '3px solid #1a3a5c', padding: '0.625rem 0.875rem', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a3a5c', marginBottom: 4 }}>💬 Observations</div>
                  <p style={{ fontSize: 14, color: '#333', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{entry.observations}</p>
                </div>
              )}
              {!entry.contenu && !entry.devoirs && !entry.observations && (
                <p style={{ color: '#aaa', fontSize: 14, fontStyle: 'italic' }}>Aucun contenu renseigné.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
