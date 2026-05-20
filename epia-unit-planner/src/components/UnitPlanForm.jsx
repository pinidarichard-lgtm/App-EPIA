import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { EVALUATIONS_OPTIONS, APPROCHES_OPTIONS, DIFFERENTIATION_OPTIONS, ADA_OPTIONS, LANGUE_OPTIONS, TDC_OPTIONS, CAS_OPTIONS, INITIAL_FORM_STATE } from '../lib/formConfig'
import { SectionHeader, SubSection, Field, TextInput, TextArea, SelectInput, CheckboxGroup, FormCard, Grid2 } from './FormComponents'

const PHASES = [{key:0,label:'Infos generales'},{key:1,label:'Phase 1 — Recherche'},{key:2,label:'Phase 2 — Action'},{key:3,label:'Phase 3 — Reflexion'}]
const PHASE_COLORS = ['#555','#1a3a5c','#1a6b4a','#7a3e1a']

function buildPayload(form) {
  const { matiere,enseignants,annee_scolaire,dates,groupe_matieres,niveau,annee_pd,semestre,trimestre,partie_cours,description_unite,evaluations,objectif_1,objectif_2,objectif_3,connaissance_4,connaissance_5,competence_6,competence_7,concept_8,concept_9,question_factuelle_10,question_factuelle_11,question_conceptuelle_12,question_conceptuelle_13,question_ouverte_14,question_ouverte_15,approches_pedagogiques,evaluation_formative_18,evaluation_formative_19,evaluation_sommative_20,evaluation_sommative_21,differentiation,differentiation_details,ada_competences,ada_details,langue_apprentissage,langue_details,tdc,tdc_details,cas,cas_details,ressource_22,ressource_23,ce_qui_a_bien_fonctionne,ce_qui_na_pas_bien_fonctionne,remarques_suggestions,reflexion_transfert,statut } = form
  return { matiere,enseignants,annee_scolaire,dates,groupe_matieres,niveau,annee_pd,semestre,trimestre,partie_cours,description_unite,evaluations,objectif_1,objectif_2,objectif_3,connaissance_4,connaissance_5,competence_6,competence_7,concept_8,concept_9,question_factuelle_10,question_factuelle_11,question_conceptuelle_12,question_conceptuelle_13,question_ouverte_14,question_ouverte_15,approches_pedagogiques,evaluation_formative_18,evaluation_formative_19,evaluation_sommative_20,evaluation_sommative_21,differentiation,differentiation_details,ada_competences,ada_details,langue_apprentissage,langue_details,tdc,tdc_details,cas,cas_details,ressource_22,ressource_23,ce_qui_a_bien_fonctionne,ce_qui_na_pas_bien_fonctionne,remarques_suggestions,reflexion_transfert,statut }
}

export default function UnitPlanForm({ initialData = null, planId = null }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialData || INITIAL_FORM_STATE)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState(planId)

  const set = (field) => (e) => { const value = e.target ? e.target.value : e; setForm(prev => ({ ...prev, [field]: value })) }
  const setCheck = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleNiveau = (val) => {
    setForm(prev => {
      const current = prev.niveau ? prev.niveau.split('/') : []
      const exists = current.includes(val)
      const next = exists ? current.filter(v => v !== val) : [...current, val].sort()
      return { ...prev, niveau: next.join('/') }
    })
  }
  const niveauArray = form.niveau ? form.niveau.split('/').filter(Boolean) : []

  async function savePlan(statut = form.statut) {
    setSaving(true); setSaveError(null); setSaved(false)
    const payload = buildPayload({ ...form, statut })
    try {
      let error
      if (currentPlanId) {
        ;({ error } = await supabase.from('unit_plans').update(payload).eq('id', currentPlanId))
      } else {
        const { data, error: err } = await supabase.from('unit_plans').insert([payload]).select().single()
        error = err
        if (!error && data) { setCurrentPlanId(data.id); navigate("/plans/" + data.id + "/edit", { replace: true }) }
      }
      if (error) throw error
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (err) { setSaveError(err.message) }
    finally { setSaving(false) }
  }

  const isLastPhase = currentPhase === PHASES.length - 1

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {PHASES.map(p => (
          <button key={p.key} onClick={() => setCurrentPhase(p.key)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, minWidth: 100, background: currentPhase === p.key ? PHASE_COLORS[p.key] : '#e8e6e0', color: currentPhase === p.key ? '#fff' : '#555' }}>{p.label}</button>
        ))}
      </div>

      {currentPhase === 0 && (
        <FormCard>
          <SectionHeader title="Informations generales" subtitle="Renseignez les metadonnees du plan d'unite" phaseColor={PHASE_COLORS[0]} />
          <Grid2>
            <Field label="Matiere" required><TextInput value={form.matiere} onChange={set('matiere')} placeholder="ex : Biologie, Histoire..." /></Field>
            <Field label="Enseignant(s)"><TextInput value={form.enseignants} onChange={set('enseignants')} placeholder="Nom(s)" /></Field>
            <Field label="Annee scolaire"><TextInput value={form.annee_scolaire} onChange={set('annee_scolaire')} placeholder="ex : 2025-2026" /></Field>
            <Field label="Date(s)"><TextInput value={form.dates} onChange={set('dates')} placeholder="ex : Sep - Oct 2025" /></Field>
            <Field label="Groupe de matieres">
              <SelectInput value={form.groupe_matieres} onChange={set('groupe_matieres')}>
                <option value="">Selectionner...</option>
                <option>Groupe 1 – Etudes en langue et litterature</option>
                <option>Groupe 2 – Acquisition de langues</option>
                <option>Groupe 3 – Individus et societes</option>
                <option>Groupe 4 – Sciences</option>
                <option>Groupe 5 – Mathematiques</option>
                <option>Groupe 6 – Arts</option>
              </SelectInput>
            </Field>
            <Field label="Niveau" hint="Cochez un ou les deux niveaux">
              <div style={{ display: 'flex', gap: '12px', paddingTop: 4 }}>
                {['NM','NS'].map(val => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: "2px solid " + (niveauArray.includes(val) ? '#1a3a5c' : '#ddd'), background: niveauArray.includes(val) ? '#eef2f7' : '#fff', color: niveauArray.includes(val) ? '#1a3a5c' : '#888', userSelect: 'none' }}>
                    <input type="checkbox" checked={niveauArray.includes(val)} onChange={() => toggleNiveau(val)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    {val === 'NM' ? 'NM — Niveau moyen' : 'NS — Niveau superieur'}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Annee du PD">
              <SelectInput value={form.annee_pd} onChange={set('annee_pd')}>
                <option value="">Selectionner...</option>
                <option value="1">1ere annee</option>
                <option value="2">2eme annee</option>
              </SelectInput>
            </Field>
            <Field label="Semestre">
              <SelectInput value={form.semestre} onChange={set('semestre')}>
                <option value="">Selectionner...</option>
                <option value="1">1er semestre</option>
                <option value="2">2e semestre</option>
              </SelectInput>
            </Field>
            <Field label="Trimestre">
              <SelectInput value={form.trimestre} onChange={set('trimestre')}>
                <option value="">Selectionner...</option>
                <option value="1">1er trimestre</option>
                <option value="2">2e trimestre</option>
                <option value="3">3e trimestre</option>
              </SelectInput>
            </Field>
          </Grid2>
        </FormCard>
      )}

      {currentPhase === 1 && (
        <div>
          <FormCard>
            <SectionHeader phase="PHASE 1 — RECHERCHE" title="Definir l'objectif de l'unite" phaseColor={PHASE_COLORS[1]} />
            <SubSection title="Informations generales sur l'unite">
              <Field label="Partie du cours et theme de l'unite"><TextInput value={form.partie_cours} onChange={set('partie_cours')} placeholder="ex : Theme 2 – Biochimie" /></Field>
              <Field label="Description de l'unite et supports"><TextArea value={form.description_unite} onChange={set('description_unite')} rows={4} placeholder="Cette unite porte sur..." /></Field>
            </SubSection>
            <SubSection title="Evaluations du Programme du Diplome">
              <CheckboxGroup options={EVALUATIONS_OPTIONS} selected={form.evaluations} onChange={setCheck('evaluations')} />
            </SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Objectifs de transfert">
              {[1,2,3].map(n => <Field key={n} label={"Objectif " + n}><TextArea value={form["objectif_" + n]} onChange={set("objectif_" + n)} rows={2} placeholder="Les eleves seront capables de..." /></Field>)}
            </SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Connaissances cles"><Grid2><Field label="Connaissance 4"><TextArea value={form.connaissance_4} onChange={set('connaissance_4')} rows={2} /></Field><Field label="Connaissance 5"><TextArea value={form.connaissance_5} onChange={set('connaissance_5')} rows={2} /></Field></Grid2></SubSection>
            <SubSection title="Competences developpees"><Grid2><Field label="Competence 6"><TextArea value={form.competence_6} onChange={set('competence_6')} rows={2} /></Field><Field label="Competence 7"><TextArea value={form.competence_7} onChange={set('competence_7')} rows={2} /></Field></Grid2></SubSection>
            <SubSection title="Concepts cles"><Grid2><Field label="Concept 8"><TextArea value={form.concept_8} onChange={set('concept_8')} rows={2} /></Field><Field label="Concept 9"><TextArea value={form.concept_9} onChange={set('concept_9')} rows={2} /></Field></Grid2></SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Questions factuelles"><Grid2><Field label="Question 10"><TextArea value={form.question_factuelle_10} onChange={set('question_factuelle_10')} rows={2} /></Field><Field label="Question 11"><TextArea value={form.question_factuelle_11} onChange={set('question_factuelle_11')} rows={2} /></Field></Grid2></SubSection>
            <SubSection title="Questions conceptuelles"><Grid2><Field label="Question 12"><TextArea value={form.question_conceptuelle_12} onChange={set('question_conceptuelle_12')} rows={2} /></Field><Field label="Question 13"><TextArea value={form.question_conceptuelle_13} onChange={set('question_conceptuelle_13')} rows={2} /></Field></Grid2></SubSection>
            <SubSection title="Questions ouvertes / debat"><Grid2><Field label="Question 14"><TextArea value={form.question_ouverte_14} onChange={set('question_ouverte_14')} rows={2} /></Field><Field label="Question 15"><TextArea value={form.question_ouverte_15} onChange={set('question_ouverte_15')} rows={2} /></Field></Grid2></SubSection>
          </FormCard>
        </div>
      )}

      {currentPhase === 2 && (
        <div>
          <FormCard>
            <SectionHeader phase="PHASE 2 — ACTION" title="Enseignement et apprentissage" phaseColor={PHASE_COLORS[2]} />
            <SubSection title="Approches pedagogiques"><CheckboxGroup options={APPROCHES_OPTIONS} selected={form.approches_pedagogiques} onChange={setCheck('approches_pedagogiques')} /></SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Evaluation formative"><Grid2><Field label="Evaluation formative 18"><TextArea value={form.evaluation_formative_18} onChange={set('evaluation_formative_18')} rows={3} /></Field><Field label="Evaluation formative 19"><TextArea value={form.evaluation_formative_19} onChange={set('evaluation_formative_19')} rows={3} /></Field></Grid2></SubSection>
            <SubSection title="Evaluation sommative"><Grid2><Field label="Evaluation sommative 20"><TextArea value={form.evaluation_sommative_20} onChange={set('evaluation_sommative_20')} rows={3} /></Field><Field label="Evaluation sommative 21"><TextArea value={form.evaluation_sommative_21} onChange={set('evaluation_sommative_21')} rows={3} /></Field></Grid2></SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Differentiation"><CheckboxGroup options={DIFFERENTIATION_OPTIONS} selected={form.differentiation} onChange={setCheck('differentiation')} /><div style={{marginTop:'0.75rem'}}><Field label="Details"><TextArea value={form.differentiation_details} onChange={set('differentiation_details')} rows={2} /></Field></div></SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Approches de l'apprentissage (AdA)"><CheckboxGroup options={ADA_OPTIONS} selected={form.ada_competences} onChange={setCheck('ada_competences')} /><div style={{marginTop:'0.75rem'}}><Field label="Details"><TextArea value={form.ada_details} onChange={set('ada_details')} rows={2} /></Field></div></SubSection>
          </FormCard>
          <FormCard>
            <SubSection title="Langue et apprentissage"><CheckboxGroup options={LANGUE_OPTIONS} selected={form.langue_apprentissage} onChange={setCheck('langue_apprentissage')} /><div style={{marginTop:'0.75rem'}}><Field label="Details"><TextArea value={form.langue_details} onChange={set('langue_details')} rows={2} /></Field></div></SubSection>
            <SubSection title="Theorie de la connaissance (TdC)"><CheckboxGroup options={TDC_OPTIONS} selected={form.tdc} onChange={setCheck('tdc')} /><div style={{marginTop:'0.75rem'}}><Field label="Details"><TextArea value={form.tdc_details} onChange={set('tdc_details')} rows={2} /></Field></div></SubSection>
            <SubSection title="CAS"><CheckboxGroup options={CAS_OPTIONS} selected={form.cas} onChange={setCheck('cas')} /><div style={{marginTop:'0.75rem'}}><Field label="Details"><TextArea value={form.cas_details} onChange={set('cas_details')} rows={2} /></Field></div></SubSection>
          </FormCard>
          <FormCard><SubSection title="Ressources"><Field label="Ressource 22"><TextInput value={form.ressource_22} onChange={set('ressource_22')} /></Field><Field label="Ressource 23"><TextInput value={form.ressource_23} onChange={set('ressource_23')} /></Field></SubSection></FormCard>
        </div>
      )}

      {currentPhase === 3 && (
        <FormCard>
          <SectionHeader phase="PHASE 3 — REFLEXION" title="Examen de la planification et de l'impact" phaseColor={PHASE_COLORS[3]} />
          <Field label="Ce qui a bien fonctionne"><TextArea value={form.ce_qui_a_bien_fonctionne} onChange={set('ce_qui_a_bien_fonctionne')} rows={4} /></Field>
          <Field label="Ce qui n'a pas bien fonctionne"><TextArea value={form.ce_qui_na_pas_bien_fonctionne} onChange={set('ce_qui_na_pas_bien_fonctionne')} rows={4} /></Field>
          <Field label="Remarques et Suggestions"><TextArea value={form.remarques_suggestions} onChange={set('remarques_suggestions')} rows={4} /></Field>
          <SubSection title="Reflexion sur les objectifs de transfert"><Field label="Dans quelle mesure les eleves ont-ils atteint les objectifs ?"><TextArea value={form.reflexion_transfert} onChange={set('reflexion_transfert')} rows={5} /></Field></SubSection>
        </FormCard>
      )}

      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(248,247,244,0.97)', backdropFilter: 'blur(8px)', borderTop: '1px solid #e8e6e0', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentPhase > 0 && <button onClick={() => setCurrentPhase(p => p - 1)} style={{ padding: '10px 18px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>← Precedent</button>}
          {!isLastPhase && <button onClick={() => setCurrentPhase(p => p + 1)} style={{ padding: '10px 18px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Suivant →</button>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveError && <span style={{ fontSize: 13, color: '#e53e3e', maxWidth: 300 }}>Erreur : {saveError}</span>}
          {saved && <span style={{ fontSize: 13, color: '#1a6b4a', fontWeight: 600 }}>✓ Sauvegarde</span>}
          <button onClick={() => savePlan('brouillon')} disabled={saving} style={{ padding: '10px 18px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600, opacity: saving ? 0.6 : 1 }}>{saving ? 'Sauvegarde...' : 'Enregistrer brouillon'}</button>
          <button onClick={() => savePlan('publié')} disabled={saving} style={{ padding: '10px 18px', background: '#1a6b4a', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>{saving ? 'Sauvegarde...' : 'Publier le plan'}</button>
        </div>
      </div>
    </div>
  )
}
