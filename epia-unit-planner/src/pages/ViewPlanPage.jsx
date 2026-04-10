import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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

export default function ViewPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
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
              {plan.annee_pd && <span>{plan.annee_pd}ᵉ année PD · {plan.semestre ? `${plan.semestre}er semestre` : ''}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
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
