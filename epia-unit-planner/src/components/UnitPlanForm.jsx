import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  EVALUATIONS_OPTIONS, APPROCHES_OPTIONS, DIFFERENTIATION_OPTIONS,
  ADA_OPTIONS, LANGUE_OPTIONS, TDC_OPTIONS, CAS_OPTIONS, INITIAL_FORM_STATE
} from '../lib/formConfig'
import {
  SectionHeader, SubSection, Field, TextInput, TextArea,
  SelectInput, CheckboxGroup, FormCard, Grid2
} from './FormComponents'

const PHASES = [
  { key: 0, label: 'Infos générales' },
  { key: 1, label: 'Phase 1 — Recherche' },
  { key: 2, label: 'Phase 2 — Action' },
  { key: 3, label: 'Phase 3 — Réflexion' },
]

const PHASE_COLORS = ['#555', '#1a3a5c', '#1a6b4a', '#7a3e1a']

export default function UnitPlanForm({ initialData = null, planId = null }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialData || INITIAL_FORM_STATE)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const setCheck = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function savePlan(statut = form.statut) {
    setSaving(true)
    setSaveError(null)
    setSaved(false)

    const payload = { ...form, statut }

    try {
      let error
      if (planId) {
        ({ error } = await supabase.from('unit_plans').update(payload).eq('id', planId))
      } else {
        const { data, error: err } = await supabase.from('unit_plans').insert([payload]).select().single()
        error = err
        if (!error && data) {
          navigate(`/plans/${data.id}/edit`, { replace: true })
        }
      }
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isLastPhase = currentPhase === PHASES.length - 1

  return (
    <div>
      {/* Stepper de phases */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {PHASES.map(p => (
          <button
            key={p.key}
            onClick={() => setCurrentPhase(p.key)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: currentPhase === p.key ? PHASE_COLORS[p.key] : '#e8e6e0',
              color: currentPhase === p.key ? '#fff' : '#555',
              transition: 'all 0.15s',
              minWidth: 100,
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Phase 0 — Informations générales */}
      {currentPhase === 0 && (
        <FormCard>
          <SectionHeader
            title="Informations générales"
            subtitle="Renseignez les métadonnées du plan d'unité"
            phaseColor={PHASE_COLORS[0]}
          />
          <Grid2>
            <Field label="Matière" required>
              <TextInput value={form.matiere} onChange={set('matiere')} placeholder="ex : Biologie, Histoire, Français B…" />
            </Field>
            <Field label="Enseignant(s)">
              <TextInput value={form.enseignants} onChange={set('enseignants')} placeholder="Nom(s) de l'enseignant(s)" />
            </Field>
            <Field label="Année scolaire">
              <TextInput value={form.annee_scolaire} onChange={set('annee_scolaire')} placeholder="ex : 2024–2025" />
            </Field>
            <Field label="Date(s)">
              <TextInput value={form.dates} onChange={set('dates')} placeholder="ex : Septembre – Octobre 2024" />
            </Field>
            <Field label="Groupe de matières">
              <SelectInput value={form.groupe_matieres} onChange={set('groupe_matieres')}>
                <option value="">Sélectionner…</option>
                <option>Groupe 1 – Études en langue et littérature</option>
                <option>Groupe 2 – Acquisition de langues</option>
                <option>Groupe 3 – Individus et sociétés</option>
                <option>Groupe 4 – Sciences</option>
                <option>Groupe 5 – Mathématiques</option>
                <option>Groupe 6 – Arts</option>
              </SelectInput>
            </Field>
            <Field label="Niveau">
              <SelectInput value={form.niveau} onChange={set('niveau')}>
                <option value="">Sélectionner…</option>
                <option value="NM">Niveau moyen (NM)</option>
                <option value="NS">Niveau supérieur (NS)</option>
              </SelectInput>
            </Field>
            <Field label="Année du PD">
              <SelectInput value={form.annee_pd} onChange={set('annee_pd')}>
                <option value="">Sélectionner…</option>
                <option value="1">1ère année</option>
                <option value="2">2ème année</option>
              </SelectInput>
            </Field>
            <Field label="Semestre">
              <SelectInput value={form.semestre} onChange={set('semestre')}>
                <option value="">Sélectionner…</option>
                <option value="1">1er semestre</option>
                <option value="2">2e semestre</option>
              </SelectInput>
            </Field>
          </Grid2>
        </FormCard>
      )}

      {/* Phase 1 — Recherche */}
      {currentPhase === 1 && (
        <div>
          <FormCard>
            <SectionHeader
              phase="PHASE 1 — RECHERCHE"
              title="Définir l'objectif de l'unité"
              phaseColor={PHASE_COLORS[1]}
            />

            <SubSection title="Informations générales sur l'unité">
              <Field label="Partie du cours et thème de l'unité">
                <TextInput value={form.partie_cours} onChange={set('partie_cours')} placeholder="ex : Thème 2 – Biochimie / Section A" />
              </Field>
              <Field label="Description de l'unité et supports utilisés" hint="Décrivez brièvement le contenu et les ressources principales">
                <TextArea value={form.description_unite} onChange={set('description_unite')} rows={4} placeholder="Cette unité porte sur…" />
              </Field>
            </SubSection>

            <SubSection title="Évaluations du Programme du Diplôme pour cette unité">
              <CheckboxGroup
                options={EVALUATIONS_OPTIONS}
                selected={form.evaluations}
                onChange={setCheck('evaluations')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Autre(s)">
                  <TextInput value={form.evaluations_autre} onChange={set('evaluations_autre')} placeholder="Précisez…" />
                </Field>
              </div>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Objectifs de transfert (1 à 3 objectifs majeurs à long terme)">
              <p style={{ fontSize: 13, color: '#888', marginBottom: '1rem' }}>
                Que devront être capables de faire les élèves à la fin de l'unité ? Objectifs fondamentaux — les élèves doivent pouvoir transférer ou appliquer leurs connaissances de manière autonome.
              </p>
              <Field label="Objectif 1">
                <TextArea value={form.objectif_1} onChange={set('objectif_1')} rows={2} placeholder="Les élèves seront capables de…" />
              </Field>
              <Field label="Objectif 2">
                <TextArea value={form.objectif_2} onChange={set('objectif_2')} rows={2} placeholder="Les élèves seront capables de…" />
              </Field>
              <Field label="Objectif 3">
                <TextArea value={form.objectif_3} onChange={set('objectif_3')} rows={2} placeholder="Les élèves seront capables de…" />
              </Field>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Compréhensions essentielles — Connaissances clés">
              <Grid2>
                <Field label="Connaissance 4">
                  <TextArea value={form.connaissance_4} onChange={set('connaissance_4')} rows={2} />
                </Field>
                <Field label="Connaissance 5">
                  <TextArea value={form.connaissance_5} onChange={set('connaissance_5')} rows={2} />
                </Field>
              </Grid2>
            </SubSection>

            <SubSection title="Compétences développées">
              <Grid2>
                <Field label="Compétence 6">
                  <TextArea value={form.competence_6} onChange={set('competence_6')} rows={2} />
                </Field>
                <Field label="Compétence 7">
                  <TextArea value={form.competence_7} onChange={set('competence_7')} rows={2} />
                </Field>
              </Grid2>
            </SubSection>

            <SubSection title="Concepts clés">
              <Grid2>
                <Field label="Concept 8">
                  <TextArea value={form.concept_8} onChange={set('concept_8')} rows={2} />
                </Field>
                <Field label="Concept 9">
                  <TextArea value={form.concept_9} onChange={set('concept_9')} rows={2} />
                </Field>
              </Grid2>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Questions de recherche — Factuelles">
              <Grid2>
                <Field label="Question 10">
                  <TextArea value={form.question_factuelle_10} onChange={set('question_factuelle_10')} rows={2} placeholder="Qu'est-ce que…?" />
                </Field>
                <Field label="Question 11">
                  <TextArea value={form.question_factuelle_11} onChange={set('question_factuelle_11')} rows={2} placeholder="Comment…?" />
                </Field>
              </Grid2>
            </SubSection>

            <SubSection title="Questions conceptuelles">
              <Grid2>
                <Field label="Question 12">
                  <TextArea value={form.question_conceptuelle_12} onChange={set('question_conceptuelle_12')} rows={2} placeholder="Pourquoi…?" />
                </Field>
                <Field label="Question 13">
                  <TextArea value={form.question_conceptuelle_13} onChange={set('question_conceptuelle_13')} rows={2} />
                </Field>
              </Grid2>
            </SubSection>

            <SubSection title="Questions ouvertes / débat">
              <Grid2>
                <Field label="Question 14">
                  <TextArea value={form.question_ouverte_14} onChange={set('question_ouverte_14')} rows={2} placeholder="Dans quelle mesure…?" />
                </Field>
                <Field label="Question 15">
                  <TextArea value={form.question_ouverte_15} onChange={set('question_ouverte_15')} rows={2} />
                </Field>
              </Grid2>
            </SubSection>
          </FormCard>
        </div>
      )}

      {/* Phase 2 — Action */}
      {currentPhase === 2 && (
        <div>
          <FormCard>
            <SectionHeader
              phase="PHASE 2 — ACTION"
              title="Enseignement et apprentissage par la recherche"
              phaseColor={PHASE_COLORS[2]}
            />

            <SubSection title="Approches pédagogiques">
              <CheckboxGroup
                options={APPROCHES_OPTIONS}
                selected={form.approches_pedagogiques}
                onChange={setCheck('approches_pedagogiques')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Autre(s)">
                  <TextInput value={form.approches_autre} onChange={set('approches_autre')} placeholder="Précisez…" />
                </Field>
              </div>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Évaluation formative">
              <Grid2>
                <Field label="Évaluation formative 18">
                  <TextArea value={form.evaluation_formative_18} onChange={set('evaluation_formative_18')} rows={3} placeholder="Décrivez l'activité d'évaluation formative…" />
                </Field>
                <Field label="Évaluation formative 19">
                  <TextArea value={form.evaluation_formative_19} onChange={set('evaluation_formative_19')} rows={3} />
                </Field>
              </Grid2>
            </SubSection>

            <SubSection title="Évaluation sommative">
              <Grid2>
                <Field label="Évaluation sommative 20">
                  <TextArea value={form.evaluation_sommative_20} onChange={set('evaluation_sommative_20')} rows={3} placeholder="Décrivez l'évaluation sommative…" />
                </Field>
                <Field label="Évaluation sommative 21">
                  <TextArea value={form.evaluation_sommative_21} onChange={set('evaluation_sommative_21')} rows={3} />
                </Field>
              </Grid2>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Différenciation">
              <CheckboxGroup
                options={DIFFERENTIATION_OPTIONS}
                selected={form.differentiation}
                onChange={setCheck('differentiation')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Précisions / Détails">
                  <TextArea value={form.differentiation_details} onChange={set('differentiation_details')} rows={2} />
                </Field>
              </div>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Approches de l'apprentissage (AdA)">
              <CheckboxGroup
                options={ADA_OPTIONS}
                selected={form.ada_competences}
                onChange={setCheck('ada_competences')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Précisions / Détails">
                  <TextArea value={form.ada_details} onChange={set('ada_details')} rows={2} />
                </Field>
              </div>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Langue et apprentissage">
              <CheckboxGroup
                options={LANGUE_OPTIONS}
                selected={form.langue_apprentissage}
                onChange={setCheck('langue_apprentissage')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Détails">
                  <TextArea value={form.langue_details} onChange={set('langue_details')} rows={2} />
                </Field>
              </div>
            </SubSection>

            <SubSection title="Théorie de la connaissance (TdC)">
              <CheckboxGroup
                options={TDC_OPTIONS}
                selected={form.tdc}
                onChange={setCheck('tdc')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Détails">
                  <TextArea value={form.tdc_details} onChange={set('tdc_details')} rows={2} />
                </Field>
              </div>
            </SubSection>

            <SubSection title="Créativité, Activité, Service (CAS)">
              <CheckboxGroup
                options={CAS_OPTIONS}
                selected={form.cas}
                onChange={setCheck('cas')}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <Field label="Détails">
                  <TextArea value={form.cas_details} onChange={set('cas_details')} rows={2} />
                </Field>
              </div>
            </SubSection>
          </FormCard>

          <FormCard>
            <SubSection title="Ressources">
              <Field label="Ressource 22">
                <TextInput value={form.ressource_22} onChange={set('ressource_22')} placeholder="Titre, auteur, URL…" />
              </Field>
              <Field label="Ressource 23">
                <TextInput value={form.ressource_23} onChange={set('ressource_23')} placeholder="Titre, auteur, URL…" />
              </Field>
            </SubSection>
          </FormCard>
        </div>
      )}

      {/* Phase 3 — Réflexion */}
      {currentPhase === 3 && (
        <div>
          <FormCard>
            <SectionHeader
              phase="PHASE 3 — RÉFLEXION"
              title="Examen de la planification et de l'impact"
              phaseColor={PHASE_COLORS[3]}
            />

            <Field label="Ce qui a bien fonctionné">
              <TextArea value={form.ce_qui_a_bien_fonctionne} onChange={set('ce_qui_a_bien_fonctionne')} rows={4} placeholder="- …&#10;- …" />
            </Field>
            <Field label="Ce qui n'a pas bien fonctionné">
              <TextArea value={form.ce_qui_na_pas_bien_fonctionne} onChange={set('ce_qui_na_pas_bien_fonctionne')} rows={4} placeholder="- …&#10;- …" />
            </Field>
            <Field label="Remarques & Suggestions">
              <TextArea value={form.remarques_suggestions} onChange={set('remarques_suggestions')} rows={4} placeholder="- …&#10;- …" />
            </Field>

            <SubSection title="Réflexion sur les objectifs de transfert">
              <Field label="Dans quelle mesure les élèves ont-ils atteint les objectifs de transfert à la fin de l'unité ?">
                <TextArea value={form.reflexion_transfert} onChange={set('reflexion_transfert')} rows={5} placeholder="Évaluez l'atteinte des objectifs…" />
              </Field>
            </SubSection>
          </FormCard>
        </div>
      )}

      {/* Barre d'actions */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'rgba(248,247,244,0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #e8e6e0',
        padding: '1rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentPhase > 0 && (
            <button onClick={() => setCurrentPhase(p => p - 1)} style={{
              padding: '10px 18px', background: '#fff', color: '#333',
              border: '1px solid #ddd', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600
            }}>← Précédent</button>
          )}
          {!isLastPhase && (
            <button onClick={() => setCurrentPhase(p => p + 1)} style={{
              padding: '10px 18px', background: '#1a3a5c', color: '#fff',
              border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600
            }}>Suivant →</button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveError && (
            <span style={{ fontSize: 13, color: '#e53e3e' }}>Erreur : {saveError}</span>
          )}
          {saved && (
            <span style={{ fontSize: 13, color: '#1a6b4a', fontWeight: 600 }}>✓ Sauvegardé</span>
          )}
          <button
            onClick={() => savePlan('brouillon')}
            disabled={saving}
            style={{
              padding: '10px 18px', background: '#fff', color: '#333',
              border: '1px solid #ddd', borderRadius: 7, cursor: saving ? 'default' : 'pointer',
              fontSize: 14, fontWeight: 600, opacity: saving ? 0.6 : 1
            }}
          >{saving ? 'Sauvegarde…' : 'Enregistrer brouillon'}</button>
          <button
            onClick={() => savePlan('publié')}
            disabled={saving}
            style={{
              padding: '10px 18px', background: '#1a6b4a', color: '#fff',
              border: 'none', borderRadius: 7, cursor: saving ? 'default' : 'pointer',
              fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1
            }}
          >{saving ? 'Sauvegarde…' : 'Publier le plan'}</button>
        </div>
      </div>
    </div>
  )
}
