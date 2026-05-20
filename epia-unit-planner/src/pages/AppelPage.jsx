import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const MATIERES = ['Biologie', 'Chimie', 'Économie', 'Français A', 'Français B', 'Histoire', 'Informatique', 'Mathématiques', 'Physique', 'Psychologie', 'Anglais A', 'Anglais B', 'Arts visuels', 'Musique', 'Théâtre']
const STATUTS = { P: { label: 'Présent', color: '#1a6b4a', bg: '#e8f5e9' }, A: { label: 'Absent', color: '#991b1b', bg: '#fef2f2' }, R: { label: 'Retard', color: '#856404', bg: '#fff8e1' } }

export default function AppelPage() {
  const [eleves, setEleves] = useState([])
  const [annee_pd, setAnneePd] = useState('D1')
  const [matiere, setMatiere] = useState('')
  const [enseignant, setEnseignant] = useState('')
  const [dateAppel, setDateAppel] = useState(new Date().toISOString().split('T')[0])
  const [presences, setPresences] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [historiqueAppels, setHistoriqueAppels] = useState([])
  const [tab, setTab] = useState('appel') // 'appel' ou 'historique'
  const [loadingHisto, setLoadingHisto] = useState(false)

  useEffect(() => { fetchEleves() }, [annee_pd])
  useEffect(() => { if (tab === 'historique') fetchHistorique() }, [tab, annee_pd])

  async function fetchEleves() {
    const { data } = await supabase.from('eleves').select('*').eq('annee_pd', annee_pd).eq('actif', true).order('nom')
    const elevesData = data || []
    setEleves(elevesData)
    // Init toutes présences à P par défaut
    const init = {}
    elevesData.forEach(e => { init[e.id] = 'P' })
    setPresences(init)
  }

  async function fetchHistorique() {
    setLoadingHisto(true)
    const { data } = await supabase.from('appels').select('*').eq('annee_pd', annee_pd).order('date_appel', { ascending: false }).limit(30)
    setHistoriqueAppels(data || [])
    setLoadingHisto(false)
  }

  function toggleStatut(eleveId) {
    setPresences(prev => {
      const current = prev[eleveId] || 'P'
      const next = current === 'P' ? 'A' : current === 'A' ? 'R' : 'P'
      return { ...prev, [eleveId]: next }
    })
  }

  function setAllPresent() {
    const all = {}
    eleves.forEach(e => { all[e.id] = 'P' })
    setPresences(all)
  }

  async function saveAppel() {
    if (!matiere) { setError('Veuillez sélectionner une matière'); return }
    setSaving(true)
    setError(null)
    const payload = { date_appel: dateAppel, matiere, enseignant, annee_pd, presences, annee_scolaire: '2025-2026' }
    const { error: err } = await supabase.from('appels').insert([payload])
    if (err) setError(err.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const absents = eleves.filter(e => presences[e.id] === 'A')
  const retards = eleves.filter(e => presences[e.id] === 'R')
  const presents = eleves.filter(e => presences[e.id] === 'P' || !presences[e.id])

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Feuilles d'appel</h1>
        <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Enregistrez les présences par cours et par promotion</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
        {[['appel', '📋 Faire l\'appel'], ['historique', '📅 Historique']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '9px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            background: tab === key ? '#1a3a5c' : '#e8e6e0',
            color: tab === key ? '#fff' : '#555', fontWeight: 600, fontSize: 14
          }}>{label}</button>
        ))}
      </div>

      {tab === 'appel' && (
        <>
          {/* Formulaire haut */}
          <div style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>Promotion</label>
                <select value={annee_pd} onChange={e => setAnneePd(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}>
                  <option value="D1">D1 — 2024-2025</option>
                  <option value="D2">D2 — 2025-2026</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>Date</label>
                <input type="date" value={dateAppel} onChange={e => setDateAppel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>Matière *</label>
                <select value={matiere} onChange={e => setMatiere(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: `1px solid ${!matiere ? '#fca5a5' : '#ddd'}`, borderRadius: 6, fontSize: 14 }}>
                  <option value="">Sélectionner…</option>
                  {MATIERES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#444' }}>Enseignant(e)</label>
                <input value={enseignant} onChange={e => setEnseignant(e.target.value)}
                  placeholder="Nom de l'enseignant"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
          </div>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.75rem 1rem', color: '#991b1b', marginBottom: '1rem', fontSize: 14 }}>{error}</div>}

          {/* Résumé rapide */}
          {eleves.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Présents', count: presents.length, color: '#1a6b4a', bg: '#e8f5e9' },
                { label: 'Absents', count: absents.length, color: '#991b1b', bg: '#fef2f2' },
                { label: 'Retards', count: retards.length, color: '#856404', bg: '#fff8e1' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}33`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
              <button onClick={setAllPresent} style={{ padding: '8px 14px', background: '#f0f4f8', color: '#1a3a5c', border: '1px solid #c5d5e8', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                ✅ Tous présents
              </button>
            </div>
          )}

          {/* Liste élèves */}
          {eleves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0' }}>
              <p style={{ color: '#888' }}>Aucun élève dans la promotion {annee_pd}.</p>
              <a href="/eleves" style={{ color: '#1a3a5c', fontSize: 14, fontWeight: 600 }}>→ Ajouter des élèves</a>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 1fr 140px',
                background: '#1a3a5c', color: '#fff',
                padding: '10px 16px', fontSize: 13, fontWeight: 700
              }}>
                <span>N°</span><span>NOM</span><span>PRÉNOM</span>
                <span style={{ textAlign: 'center' }}>STATUT</span>
              </div>

              {eleves.map((eleve, idx) => {
                const statut = presences[eleve.id] || 'P'
                const s = STATUTS[statut]
                return (
                  <div key={eleve.id} style={{
                    display: 'grid', gridTemplateColumns: '50px 1fr 1fr 140px',
                    padding: '10px 16px',
                    background: statut === 'A' ? '#fff5f5' : statut === 'R' ? '#fffdf0' : idx % 2 === 0 ? '#fff' : '#f8f7f4',
                    borderBottom: '1px solid #eee', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>{idx + 1}</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{eleve.nom.toUpperCase()}</span>
                    <span style={{ fontSize: 15 }}>{eleve.prenom}</span>
                    <div style={{ textAlign: 'center' }}>
                      <button onClick={() => toggleStatut(eleve.id)} style={{
                        padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        background: s.bg, color: s.color, fontWeight: 700, fontSize: 13,
                        minWidth: 90, transition: 'all 0.15s'
                      }}>{s.label}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Bouton sauvegarder */}
          {eleves.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={saveAppel} disabled={saving} style={{
                background: '#1a6b4a', color: '#fff', border: 'none',
                padding: '11px 24px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer'
              }}>{saving ? 'Enregistrement…' : '💾 Enregistrer l\'appel'}</button>
              {saved && <span style={{ color: '#1a6b4a', fontWeight: 600, fontSize: 14 }}>✓ Appel enregistré !</span>}
            </div>
          )}
        </>
      )}

      {tab === 'historique' && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {['D1', 'D2'].map(p => (
              <button key={p} onClick={() => setAnneePd(p)} style={{
                padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: annee_pd === p ? '#1a3a5c' : '#e8e6e0',
                color: annee_pd === p ? '#fff' : '#555', fontWeight: 600
              }}>{p}</button>
            ))}
          </div>

          {loadingHisto && <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Chargement…</div>}

          {!loadingHisto && historiqueAppels.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0' }}>
              <p style={{ color: '#888' }}>Aucun appel enregistré pour {annee_pd}.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historiqueAppels.map(appel => {
              const presObj = appel.presences || {}
              const nbAbsents = Object.values(presObj).filter(v => v === 'A').length
              const nbRetards = Object.values(presObj).filter(v => v === 'R').length
              const total = Object.keys(presObj).length
              return (
                <div key={appel.id} style={{ background: '#fff', border: '1px solid #e8e6e0', borderRadius: 10, padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{appel.matiere}</span>
                      <span style={{ marginLeft: 10, fontSize: 13, color: '#888' }}>
                        {new Date(appel.date_appel).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                      {appel.enseignant && <span style={{ marginLeft: 8, fontSize: 13, color: '#888' }}>· {appel.enseignant}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#e8f5e9', color: '#1a6b4a', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                        {total - nbAbsents - nbRetards} présents
                      </span>
                      {nbAbsents > 0 && <span style={{ background: '#fef2f2', color: '#991b1b', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{nbAbsents} absent{nbAbsents > 1 ? 's' : ''}</span>}
                      {nbRetards > 0 && <span style={{ background: '#fff8e1', color: '#856404', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{nbRetards} retard{nbRetards > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
