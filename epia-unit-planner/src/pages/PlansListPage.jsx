import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  EVALUATIONS_OPTIONS, APPROCHES_OPTIONS, DIFFERENTIATION_OPTIONS,
  ADA_OPTIONS, LANGUE_OPTIONS, TDC_OPTIONS, CAS_OPTIONS
} from '../lib/formConfig'

const GROUPES = ['Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4', 'Groupe 5', 'Groupe 6']

const ALL_OPTIONS = {
  evaluations: EVALUATIONS_OPTIONS,
  approches_pedagogiques: APPROCHES_OPTIONS,
  differentiation: DIFFERENTIATION_OPTIONS,
  ada_competences: ADA_OPTIONS,
  langue_apprentissage: LANGUE_OPTIONS,
  tdc: TDC_OPTIONS,
  cas: CAS_OPTIONS,
}

function getLabels(key, ids) {
  if (!ids || !ids.length) return ''
  const opts = ALL_OPTIONS[key] || []
  return ids.map(id => opts.find(o => o.id === id)?.label).filter(Boolean).join(', ')
}

function downloadPDF(plan) {
  function row(label, value) {
    if (!value) return ''
    return `<div class="row"><div class="row-label">${label}</div><div class="row-value">${value.replace(/\n/g, '<br>')}</div></div>`
  }
  function tags(label, key, ids) {
    const l = getLabels(key, ids)
    if (!l) return ''
    return `<div class="row"><div class="row-label">${label}</div><div class="row-value tags">${l.split(', ').map(t => `<span class="tag">${t}</span>`).join('')}</div></div>`
  }
  function section(color, title, content) {
    return `<div class="section"><div class="section-header" style="background:${color}">${title}</div><div class="section-body">${content}</div></div>`
  }

  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Plan d'unité — ${plan.matiere || 'EPIA'}</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; font-size: 11pt; color: #222; background: #fff; }
.page { max-width: 210mm; margin: 0 auto; padding: 15mm 18mm; }
.header { background: #1a3a5c; color: #fff; border-radius: 8px; padding: 18px 22px; margin-bottom: 20px; }
.header h1 { font-size: 20pt; font-weight: 700; margin-bottom: 6px; }
.header .meta { font-size: 10pt; opacity: 0.85; display: flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; }
.badge { background: #e8b84b; color: #1a3a5c; font-size: 9pt; font-weight: 700; padding: 2px 10px; border-radius: 20px; display: inline-block; margin-left: 8px; }
.badge-green { background: #1a6b4a; color: #fff; font-size: 9pt; padding: 2px 10px; border-radius: 20px; display: inline-block; margin-left: 4px; }
.section { margin-bottom: 16px; break-inside: avoid; }
.section-header { color: #fff; padding: 8px 14px; font-weight: 700; font-size: 12pt; border-radius: 6px 6px 0 0; }
.section-body { border: 1px solid #ddd; border-top: none; border-radius: 0 0 6px 6px; padding: 14px; }
.row { margin-bottom: 10px; }
.row-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #aaa; margin-bottom: 2px; }
.row-value { font-size: 11pt; line-height: 1.55; }
.row-value.tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { background: #eef2f7; color: #1a3a5c; font-size: 9pt; padding: 3px 9px; border-radius: 20px; display: inline-block; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.subsection { font-size: 10pt; font-weight: 700; color: #1a3a5c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin: 12px 0 8px; }
.footer { text-align: center; font-size: 9pt; color: #aaa; margin-top: 24px; padding-top: 10px; border-top: 1px solid #eee; }
@media print { body { font-size: 10pt; } .page { padding: 10mm 12mm; } .section { break-inside: avoid; } }
</style></head><body>
<div class="page">
  <div class="header">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="background:#e8b84b;color:#1a3a5c;width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">IB</div>
      <div>
        <div style="font-size:10pt;opacity:0.7;">L'EPIA — École Pilote Innovante Alpha de Lomé, Togo</div>
        <div style="font-size:9pt;opacity:0.6;">Programme du Diplôme</div>
      </div>
    </div>
    <h1>${plan.matiere || 'Plan sans titre'}${plan.niveau ? `<span class="badge">${plan.niveau}</span>` : ''}${plan.statut === 'publié' ? '<span class="badge-green">Publié</span>' : '<span style="background:#555;color:#fff;font-size:9pt;padding:2px 10px;border-radius:20px;display:inline-block;margin-left:4px;">Brouillon</span>'}</h1>
    <div class="meta">
      ${plan.enseignants ? `<span>👤 ${plan.enseignants}</span>` : ''}
      ${plan.groupe_matieres ? `<span>📚 ${plan.groupe_matieres}</span>` : ''}
      ${plan.annee_scolaire ? `<span>📅 ${plan.annee_scolaire}</span>` : ''}
      ${plan.annee_pd ? `<span>${plan.annee_pd}ᵉ année PD</span>` : ''}
      ${plan.semestre ? `<span>${plan.semestre}er semestre</span>` : ''}
      ${plan.trimestre ? `<span>${plan.trimestre}e trimestre</span>` : ''}
      ${plan.dates ? `<span>${plan.dates}</span>` : ''}
    </div>
  </div>

  ${section('#1a3a5c', "Phase 1 — Recherche : Définir l'objectif de l'unité", `
    ${row('Partie du cours et thème', plan.partie_cours)}
    ${row("Description de l'unité et supports", plan.description_unite)}
    ${tags('Évaluations', 'evaluations', plan.evaluations)}
    <div class="subsection">Objectifs de transfert</div>
    ${row('Objectif 1', plan.objectif_1)}
    ${row('Objectif 2', plan.objectif_2)}
    ${row('Objectif 3', plan.objectif_3)}
    <div class="subsection">Compréhensions essentielles</div>
    <div class="grid2">
      ${row('Connaissance 4', plan.connaissance_4)}
      ${row('Connaissance 5', plan.connaissance_5)}
      ${row('Compétence 6', plan.competence_6)}
      ${row('Compétence 7', plan.competence_7)}
      ${row('Concept 8', plan.concept_8)}
      ${row('Concept 9', plan.concept_9)}
    </div>
    <div class="subsection">Questions de recherche</div>
    <div class="grid2">
      ${row('Factuelle 10', plan.question_factuelle_10)}
      ${row('Factuelle 11', plan.question_factuelle_11)}
      ${row('Conceptuelle 12', plan.question_conceptuelle_12)}
      ${row('Conceptuelle 13', plan.question_conceptuelle_13)}
      ${row('Ouverte 14', plan.question_ouverte_14)}
      ${row('Ouverte 15', plan.question_ouverte_15)}
    </div>
  `)}

  ${section('#1a6b4a', 'Phase 2 — Action : Enseignement et apprentissage', `
    ${tags('Approches pédagogiques', 'approches_pedagogiques', plan.approches_pedagogiques)}
    ${row('Évaluation formative 18', plan.evaluation_formative_18)}
    ${row('Évaluation formative 19', plan.evaluation_formative_19)}
    ${row('Évaluation sommative 20', plan.evaluation_sommative_20)}
    ${row('Évaluation sommative 21', plan.evaluation_sommative_21)}
    ${tags('Différenciation', 'differentiation', plan.differentiation)}
    ${row('Différenciation — Détails', plan.differentiation_details)}
    ${tags("Approches de l'apprentissage (AdA)", 'ada_competences', plan.ada_competences)}
    ${row('AdA — Détails', plan.ada_details)}
    ${tags('Langue et apprentissage', 'langue_apprentissage', plan.langue_apprentissage)}
    ${row('Langue — Détails', plan.langue_details)}
    ${tags('Théorie de la connaissance (TdC)', 'tdc', plan.tdc)}
    ${row('TdC — Détails', plan.tdc_details)}
    ${tags('CAS', 'cas', plan.cas)}
    ${row('CAS — Détails', plan.cas_details)}
    ${row('Ressource 22', plan.ressource_22)}
    ${row('Ressource 23', plan.ressource_23)}
  `)}

  ${section('#7a3e1a', 'Phase 3 — Réflexion', `
    ${row('Ce qui a bien fonctionné', plan.ce_qui_a_bien_fonctionne)}
    ${row("Ce qui n'a pas bien fonctionné", plan.ce_qui_na_pas_bien_fonctionne)}
    ${row('Remarques & Suggestions', plan.remarques_suggestions)}
    ${row('Réflexion sur les objectifs de transfert', plan.reflexion_transfert)}
  `)}

  <div class="footer">Créé le ${dateStr} · EPIA Lomé, Togo · Programme du Diplôme IB</div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) win.focus()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

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
      const { data, error } = await supabase
        .from('unit_plans')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPlans(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function deletePlan(id) {
    if (!confirm("Supprimer ce plan d'unité ?")) return
    const { error } = await supabase.from('unit_plans').delete().eq('id', id)
    if (!error) setPlans(plans.filter(p => p.id !== id))
  }

  const filtered = plans.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || (p.matiere || '').toLowerCase().includes(q) || (p.enseignants || '').toLowerCase().includes(q)
    const matchNiveau = !filterNiveau || (p.niveau || '').includes(filterNiveau)
    const matchGroupe = !filterGroupe || (p.groupe_matieres || '').includes(filterGroupe)
    return matchSearch && matchNiveau && matchGroupe
  })

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Plans d'unité</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{plans.length} plan{plans.length > 1 ? 's' : ''} enregistré{plans.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/plans/new" style={{
          background: '#1a3a5c', color: '#fff', textDecoration: 'none',
          padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14
        }}>+ Nouveau plan</Link>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Rechercher par matière ou enseignant…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff' }}
        />
        <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">Tous les niveaux</option>
          <option value="NM">NM</option>
          <option value="NS">NS</option>
        </select>
        <select value={filterGroupe} onChange={e => setFilterGroupe(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">Tous les groupes</option>
          {GROUPES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Chargement…</div>}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '1rem', color: '#991b1b', marginBottom: '1rem' }}>
          Erreur : {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 12, border: '1px solid #e8e6e0' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>📋</div>
          <p style={{ color: '#888', fontSize: 16 }}>
            {plans.length === 0 ? "Aucun plan d'unité pour l'instant." : 'Aucun résultat pour cette recherche.'}
          </p>
          {plans.length === 0 && (
            <Link to="/plans/new" style={{
              display: 'inline-block', marginTop: '1rem',
              background: '#1a3a5c', color: '#fff', textDecoration: 'none',
              padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14
            }}>Créer le premier plan</Link>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(plan => (
          <PlanCard key={plan.id} plan={plan} onDelete={deletePlan} onDownload={downloadPDF} />
        ))}
      </div>
    </div>
  )
}

function PlanCard({ plan, onDelete, onDownload }) {
  const niveauColor = (plan.niveau || '').includes('NS') ? '#1a6b4a' : '#1a3a5c'
  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      background: '#fff', borderRadius: 10, border: '1px solid #e8e6e0',
      padding: '1.25rem', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#1a1a1a' }}>
            {plan.matiere || 'Matière non définie'}
          </span>
          {plan.niveau && (
            <span style={{ background: niveauColor + '15', color: niveauColor, fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
              {plan.niveau}
            </span>
          )}
          {plan.annee_pd && (
            <span style={{ background: '#f0f0f0', color: '#555', fontSize: 12, padding: '2px 8px', borderRadius: 20 }}>
              {plan.annee_pd}ᵉ année PD
            </span>
          )}
          <span style={{
            background: plan.statut === 'publié' ? '#e8f5e9' : '#fff8e1',
            color: plan.statut === 'publié' ? '#1a6b4a' : '#856404',
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
            border: `1px solid ${plan.statut === 'publié' ? '#a5d6a7' : '#ffd54f'}`
          }}>{plan.statut === 'publié' ? 'Publié' : 'Brouillon'}</span>
        </div>
        <div style={{ fontSize: 13, color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {plan.enseignants && <span>👤 {plan.enseignants}</span>}
          {plan.groupe_matieres && <span>📚 {plan.groupe_matieres}</span>}
          {plan.annee_scolaire && <span>📅 {plan.annee_scolaire}</span>}
          <span>Créé le {dateStr}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
        <Link to={`/plans/${plan.id}`} style={{
          padding: '7px 14px', background: '#1a3a5c', color: '#fff',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600
        }}>Voir</Link>
        <Link to={`/plans/${plan.id}/edit`} style={{
          padding: '7px 14px', background: '#f5f5f5', color: '#333',
          borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600,
          border: '1px solid #ddd'
        }}>Modifier</Link>
        <button onClick={() => onDownload(plan)} style={{
          padding: '7px 14px', background: '#eef2f7', color: '#1a3a5c',
          borderRadius: 6, fontSize: 13, fontWeight: 600,
          border: '1px solid #c5d5e8', cursor: 'pointer'
        }}>⬇ PDF</button>
        <button onClick={() => onDelete(plan.id)} style={{
          padding: '7px 14px', background: '#fef2f2', color: '#991b1b',
          borderRadius: 6, fontSize: 13, fontWeight: 600,
          border: '1px solid #fca5a5', cursor: 'pointer'
        }}>Suppr.</button>
      </div>
    </div>
  )
}
