import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  EVALUATIONS_OPTIONS, APPROCHES_OPTIONS, DIFFERENTIATION_OPTIONS,
  ADA_OPTIONS, LANGUE_OPTIONS, TDC_OPTIONS, CAS_OPTIONS
} from '../lib/formConfig'

const ALL_OPTIONS = {
  evaluations: EVALUATIONS_OPTIONS,
  approches_pedagogiques: APPROCHES_OPTIONS,
  differentiation: DIFFERENTIATION_OPTIONS,
  ada_competences: ADA_OPTIONS,
  langue_apprentissage: LANGUE_OPTIONS,
  tdc: TDC_OPTIONS,
  cas: CAS_OPTIONS,
}

function getLabel(optionKey, ids) {
  if (!ids || !ids.length) return null
  const opts = ALL_OPTIONS[optionKey] || []
  return ids.map(id => opts.find(o => o.id === id)?.label).filter(Boolean)
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#aaa', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: '#222', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{value}</div>
    </div>
  )
}

function TagList({ label, ids, optionKey }) {
  const labels = getLabel(optionKey, ids)
  if (!labels || !labels.length) return null
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#aaa', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {labels.map((l, i) => (
          <span key={i} style={{
            background: '#eef2f7', color: '#1a3a5c', fontSize: 13,
            padding: '4px 10px', borderRadius: 20
          }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

function Section({ color, title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        background: color, color: '#fff', borderRadius: '10px 10px 0 0',
        padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: 16
      }}>{title}</div>
      <div style={{
        background: '#fff', border: `1px solid ${color}33`,
        borderTop: 'none', borderRadius: '0 0 10px 10px',
        padding: '1.25rem'
      }}>{children}</div>
    </div>
  )
}

// ── Génération PDF via impression navigateur ──────────────────────────────
function downloadPDF(plan) {
  const ALL_OPT = ALL_OPTIONS
  function labels(key, ids) {
    if (!ids || !ids.length) return ''
    const opts = ALL_OPT[key] || []
    return ids.map(id => opts.find(o => o.id === id)?.label).filter(Boolean).join(', ')
  }
  function row(label, value) {
    if (!value) return ''
    return `
      <div class="row">
        <div class="row-label">${label}</div>
        <div class="row-value">${value.replace(/\n/g, '<br>')}</div>
      </div>`
  }
  function tags(label, key, ids) {
    const l = labels(key, ids)
    if (!l) return ''
    return `
      <div class="row">
        <div class="row-label">${label}</div>
        <div class="row-value tags">${labels(key, ids).split(', ').map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`
  }
  function section(color, title, content) {
    return `
      <div class="section">
        <div class="section-header" style="background:${color}">${title}</div>
        <div class="section-body">${content}</div>
      </div>`
  }

  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Plan d'unité — ${plan.matiere || 'EPIA'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #222; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 15mm 18mm; }

  /* En-tête */
  .header { background: #1a3a5c; color: #fff; border-radius: 8px; padding: 18px 22px; margin-bottom: 20px; }
  .header h1 { font-size: 22pt; font-weight: 700; margin-bottom: 6px; }
  .header .meta { font-size: 10pt; opacity: 0.85; display: flex; flex-wrap: wrap; gap: 14px; }
  .badge { background: #e8b84b; color: #1a3a5c; font-size: 9pt; font-weight: 700; padding: 2px 10px; border-radius: 20px; display: inline-block; margin-left: 8px; }
  .badge-green { background: #1a6b4a; color: #fff; font-size: 9pt; padding: 2px 10px; border-radius: 20px; display: inline-block; margin-left: 4px; }

  /* Sections */
  .section { margin-bottom: 18px; break-inside: avoid; }
  .section-header { color: #fff; padding: 8px 14px; font-weight: 700; font-size: 12pt; border-radius: 6px 6px 0 0; }
  .section-body { border: 1px solid #ddd; border-top: none; border-radius: 0 0 6px 6px; padding: 14px; background: #fff; }

  /* Lignes */
  .row { margin-bottom: 10px; }
  .row-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #aaa; margin-bottom: 2px; }
  .row-value { font-size: 11pt; line-height: 1.55; color: #222; }
  .row-value.tags { display: flex; flex-wrap: wrap; gap: 4px; }

  /* Grille 2 colonnes */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Tags */
  .tag { background: #eef2f7; color: #1a3a5c; font-size: 9pt; padding: 3px 9px; border-radius: 20px; display: inline-block; }

  /* Sous-titre de section */
  .subsection { font-size: 10pt; font-weight: 700; color: #1a3a5c; border-bottom: 1px solid #eee; padding-bottom: 5px; margin: 12px 0 8px; }

  /* Pied de page */
  .footer { text-align: center; font-size: 9pt; color: #aaa; margin-top: 24px; padding-top: 10px; border-top: 1px solid #eee; }

  @media print {
    body { font-size: 10pt; }
    .page { padding: 10mm 12mm; }
    .section { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="background:#e8b84b;color:#1a3a5c;width:36px;height:36px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;">IB</div>
      <div>
        <div style="font-size:10pt;opacity:0.7;">L'EPIA — École Pilote Innovante Alpha de Lomé, Togo</div>
        <div style="font-size:9pt;opacity:0.6;">Programme du Diplôme</div>
      </div>
    </div>
    <h1>
      ${plan.matiere || 'Plan sans titre'}
      ${plan.niveau ? `<span class="badge">${plan.niveau}</span>` : ''}
      ${plan.statut === 'publié' ? '<span class="badge-green">Publié</span>' : '<span style="background:#555;color:#fff;font-size:9pt;padding:2px 10px;border-radius:20px;display:inline-block;margin-left:4px;">Brouillon</span>'}
    </h1>
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

  ${section('#1a3a5c', 'Phase 1 — Recherche : Définir l\'objectif de l\'unité', `
    ${row('Partie du cours et thème', plan.partie_cours)}
    ${row('Description de l\'unité et supports', plan.description_unite)}
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
    ${tags('Approches de l\'apprentissage (AdA)', 'ada_competences', plan.ada_competences)}
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
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (win) win.focus()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ViewPlanPage() {
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
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPlan()
  }, [id])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Chargement…</div>
  if (error) return (
    <div style={{ padding: '2rem' }}>
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '1rem', color: '#991b1b' }}>Erreur : {error}</div>
    </div>
  )

  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      {/* En-tête */}
      <div style={{ background: '#1a3a5c', borderRadius: 12, padding: '1.75rem', color: '#fff', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 26, fontWeight: 700 }}>{plan.matiere || 'Plan sans titre'}</h1>
              {plan.niveau && (
                <span style={{ background: '#e8b84b', color: '#1a3a5c', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {plan.niveau}
                </span>
              )}
              <span style={{
                background: plan.statut === 'publié' ? '#1a6b4a' : '#555',
                color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 20
              }}>{plan.statut === 'publié' ? 'Publié' : 'Brouillon'}</span>
            </div>
            <div style={{ opacity: 0.8, fontSize: 14, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {plan.enseignants && <span>👤 {plan.enseignants}</span>}
              {plan.groupe_matieres && <span>📚 {plan.groupe_matieres}</span>}
              {plan.annee_scolaire && <span>📅 {plan.annee_scolaire}</span>}
              {plan.annee_pd && <span>{plan.annee_pd}ᵉ année PD</span>}
              {plan.semestre && <span>{plan.semestre}er semestre</span>}
              {plan.trimestre && <span>{plan.trimestre}e trimestre</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Bouton télécharger PDF */}
            <button
              onClick={() => downloadPDF(plan)}
              style={{
                background: '#fff', color: '#1a3a5c',
                border: 'none', borderRadius: 7,
                padding: '9px 16px', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              ⬇ Télécharger PDF
            </button>
            <Link to={`/plans/${id}/edit`} style={{
              background: '#e8b84b', color: '#1a3a5c', textDecoration: 'none',
              padding: '9px 16px', borderRadius: 7, fontWeight: 700, fontSize: 14
            }}>Modifier</Link>
            <Link to="/plans" style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none',
              padding: '9px 16px', borderRadius: 7, fontWeight: 600, fontSize: 14,
              border: '1px solid rgba(255,255,255,0.3)'
            }}>← Retour</Link>
          </div>
        </div>
      </div>

      {/* Phase 1 */}
      <Section color="#1a3a5c" title="Phase 1 — Recherche : Définir l'objectif de l'unité">
        <Row label="Partie du cours et thème" value={plan.partie_cours} />
        <Row label="Description de l'unité et supports" value={plan.description_unite} />
        <TagList label="Évaluations" ids={plan.evaluations} optionKey="evaluations" />
        <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a5c', marginBottom: '0.75rem' }}>Objectifs de transfert</div>
          <Row label="Objectif 1" value={plan.objectif_1} />
          <Row label="Objectif 2" value={plan.objectif_2} />
          <Row label="Objectif 3" value={plan.objectif_3} />
        </div>
        <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a5c', marginBottom: '0.75rem' }}>Compréhensions essentielles</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Row label="Connaissance 4" value={plan.connaissance_4} />
            <Row label="Connaissance 5" value={plan.connaissance_5} />
            <Row label="Compétence 6" value={plan.competence_6} />
            <Row label="Compétence 7" value={plan.competence_7} />
            <Row label="Concept 8" value={plan.concept_8} />
            <Row label="Concept 9" value={plan.concept_9} />
          </div>
        </div>
        <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a5c', marginBottom: '0.75rem' }}>Questions de recherche</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Row label="Factuelle 10" value={plan.question_factuelle_10} />
            <Row label="Factuelle 11" value={plan.question_factuelle_11} />
            <Row label="Conceptuelle 12" value={plan.question_conceptuelle_12} />
            <Row label="Conceptuelle 13" value={plan.question_conceptuelle_13} />
            <Row label="Ouverte 14" value={plan.question_ouverte_14} />
            <Row label="Ouverte 15" value={plan.question_ouverte_15} />
          </div>
        </div>
      </Section>

      {/* Phase 2 */}
      <Section color="#1a6b4a" title="Phase 2 — Action : Enseignement et apprentissage">
        <TagList label="Approches pédagogiques" ids={plan.approches_pedagogiques} optionKey="approches_pedagogiques" />
        <Row label="Évaluation formative 18" value={plan.evaluation_formative_18} />
        <Row label="Évaluation formative 19" value={plan.evaluation_formative_19} />
        <Row label="Évaluation sommative 20" value={plan.evaluation_sommative_20} />
        <Row label="Évaluation sommative 21" value={plan.evaluation_sommative_21} />
        <TagList label="Différenciation" ids={plan.differentiation} optionKey="differentiation" />
        <Row label="Différenciation — Détails" value={plan.differentiation_details} />
        <TagList label="Approches de l'apprentissage (AdA)" ids={plan.ada_competences} optionKey="ada_competences" />
        <Row label="AdA — Détails" value={plan.ada_details} />
        <TagList label="Langue et apprentissage" ids={plan.langue_apprentissage} optionKey="langue_apprentissage" />
        <Row label="Langue — Détails" value={plan.langue_details} />
        <TagList label="Théorie de la connaissance (TdC)" ids={plan.tdc} optionKey="tdc" />
        <Row label="TdC — Détails" value={plan.tdc_details} />
        <TagList label="CAS" ids={plan.cas} optionKey="cas" />
        <Row label="CAS — Détails" value={plan.cas_details} />
        <Row label="Ressource 22" value={plan.ressource_22} />
        <Row label="Ressource 23" value={plan.ressource_23} />
      </Section>

      {/* Phase 3 */}
      <Section color="#7a3e1a" title="Phase 3 — Réflexion">
        <Row label="Ce qui a bien fonctionné" value={plan.ce_qui_a_bien_fonctionne} />
        <Row label="Ce qui n'a pas bien fonctionné" value={plan.ce_qui_na_pas_bien_fonctionne} />
        <Row label="Remarques & Suggestions" value={plan.remarques_suggestions} />
        <Row label="Réflexion sur les objectifs de transfert" value={plan.reflexion_transfert} />
      </Section>

      <div style={{ textAlign: 'center', padding: '1rem', color: '#aaa', fontSize: 13 }}>
        Créé le {dateStr} · EPIA Lomé, Togo
      </div>
    </div>
  )
}
