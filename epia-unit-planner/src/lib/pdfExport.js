import {
  EVALUATIONS_OPTIONS, APPROCHES_OPTIONS, DIFFERENTIATION_OPTIONS,
  ADA_OPTIONS, LANGUE_OPTIONS, TDC_OPTIONS, CAS_OPTIONS
} from './formConfig'

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

function row(label, value) {
  if (!value) return ''
  return `<div class="row"><div class="row-label">${label}</div><div class="row-value">${String(value).replace(/\n/g,'<br>')}</div></div>`
}
function tags(label, key, ids) {
  const l = getLabels(key, ids)
  if (!l) return ''
  return `<div class="row"><div class="row-label">${label}</div><div class="row-value tags">${l.split(', ').map(t=>`<span class="tag">${t}</span>`).join('')}</div></div>`
}
function section(color, title, content) {
  return `<div class="section"><div class="section-header" style="background:${color}">${title}</div><div class="section-body">${content}</div></div>`
}

export function exportPlanPDF(plan) {
  const dateStr = new Date(plan.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Plan d'unité PD — ${plan.matiere||'EPIA'}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#222;background:#fff;}
.page{max-width:210mm;margin:0 auto;padding:14mm 16mm;}
.header{background:#1a3a5c;color:#fff;border-radius:8px;padding:16px 20px;margin-bottom:18px;}
.header-top{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.logo-circle{background:#e8b84b;color:#1a3a5c;width:38px;height:38px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;}
.header h1{font-size:20pt;font-weight:700;margin-bottom:6px;}
.badge{background:#e8b84b;color:#1a3a5c;font-size:9pt;font-weight:700;padding:2px 10px;border-radius:20px;display:inline-block;margin-left:8px;}
.badge-green{background:#1a6b4a;color:#fff;font-size:9pt;padding:2px 10px;border-radius:20px;display:inline-block;margin-left:4px;}
.badge-gray{background:#555;color:#fff;font-size:9pt;padding:2px 10px;border-radius:20px;display:inline-block;margin-left:4px;}
.meta{font-size:10pt;opacity:.82;display:flex;flex-wrap:wrap;gap:14px;margin-top:6px;}
.section{margin-bottom:14px;page-break-inside:avoid;}
.section-header{color:#fff;padding:7px 14px;font-weight:700;font-size:11pt;border-radius:6px 6px 0 0;}
.section-body{border:1px solid #ddd;border-top:none;border-radius:0 0 6px 6px;padding:12px;}
.row{margin-bottom:9px;}
.row-label{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#aaa;margin-bottom:2px;}
.row-value{font-size:10.5pt;line-height:1.5;}
.row-value.tags{display:flex;flex-wrap:wrap;gap:4px;}
.tag{background:#eef2f7;color:#1a3a5c;font-size:8.5pt;padding:2px 8px;border-radius:20px;display:inline-block;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.subsection{font-size:9.5pt;font-weight:700;color:#1a3a5c;border-bottom:1px solid #eee;padding-bottom:4px;margin:10px 0 7px;}
.footer{text-align:center;font-size:8.5pt;color:#aaa;margin-top:20px;padding-top:8px;border-top:1px solid #eee;}
@media print{@page{margin:10mm 12mm;}.page{padding:0;}.section{page-break-inside:avoid;}}
</style></head><body><div class="page">
<div class="header">
<div class="header-top"><div class="logo-circle">IB</div><div>
<div style="font-size:10pt;opacity:.75;">L'EPIA — École Pilote Innovante Alpha de Lomé, Togo</div>
<div style="font-size:9pt;opacity:.55;">Programme du Diplôme</div></div></div>
<h1>${plan.matiere||'Plan sans titre'}${plan.niveau?`<span class="badge">${plan.niveau}</span>`:''}${plan.statut==='publié'?'<span class="badge-green">Publié</span>':'<span class="badge-gray">Brouillon</span>'}</h1>
<div class="meta">
${plan.enseignants?`<span>👤 ${plan.enseignants}</span>`:''}
${plan.groupe_matieres?`<span>📚 ${plan.groupe_matieres}</span>`:''}
${plan.annee_scolaire?`<span>📅 ${plan.annee_scolaire}</span>`:''}
${plan.annee_pd?`<span>${plan.annee_pd}ᵉ année PD</span>`:''}
${plan.semestre?`<span>Semestre ${plan.semestre}</span>`:''}
${plan.trimestre?`<span>Trimestre ${plan.trimestre}</span>`:''}
${plan.dates?`<span>${plan.dates}</span>`:''}
</div></div>
${section('#1a3a5c',"Phase 1 — Recherche : Définir l'objectif de l'unité",`
${row('Partie du cours et thème',plan.partie_cours)}
${row("Description de l'unité et supports",plan.description_unite)}
${tags('Évaluations','evaluations',plan.evaluations)}
<div class="subsection">Objectifs de transfert</div>
${row('Objectif 1',plan.objectif_1)}${row('Objectif 2',plan.objectif_2)}${row('Objectif 3',plan.objectif_3)}
<div class="subsection">Compréhensions essentielles</div>
<div class="grid2">${row('Connaissance 4',plan.connaissance_4)}${row('Connaissance 5',plan.connaissance_5)}${row('Compétence 6',plan.competence_6)}${row('Compétence 7',plan.competence_7)}${row('Concept 8',plan.concept_8)}${row('Concept 9',plan.concept_9)}</div>
<div class="subsection">Questions de recherche</div>
<div class="grid2">${row('Factuelle 10',plan.question_factuelle_10)}${row('Factuelle 11',plan.question_factuelle_11)}${row('Conceptuelle 12',plan.question_conceptuelle_12)}${row('Conceptuelle 13',plan.question_conceptuelle_13)}${row('Ouverte 14',plan.question_ouverte_14)}${row('Ouverte 15',plan.question_ouverte_15)}</div>
`)}
${section('#1a6b4a','Phase 2 — Action : Enseignement et apprentissage',`
${tags('Approches pédagogiques','approches_pedagogiques',plan.approches_pedagogiques)}
${row('Évaluation formative 18',plan.evaluation_formative_18)}${row('Évaluation formative 19',plan.evaluation_formative_19)}
${row('Évaluation sommative 20',plan.evaluation_sommative_20)}${row('Évaluation sommative 21',plan.evaluation_sommative_21)}
${tags('Différenciation','differentiation',plan.differentiation)}${row('Différenciation — Détails',plan.differentiation_details)}
${tags("Approches de l'apprentissage (AdA)",'ada_competences',plan.ada_competences)}${row('AdA — Détails',plan.ada_details)}
${tags('Langue et apprentissage','langue_apprentissage',plan.langue_apprentissage)}${row('Langue — Détails',plan.langue_details)}
${tags('Théorie de la connaissance (TdC)','tdc',plan.tdc)}${row('TdC — Détails',plan.tdc_details)}
${tags('CAS','cas',plan.cas)}${row('CAS — Détails',plan.cas_details)}
${row('Ressource 22',plan.ressource_22)}${row('Ressource 23',plan.ressource_23)}
`)}
${section('#7a3e1a','Phase 3 — Réflexion',`
${row('Ce qui a bien fonctionné',plan.ce_qui_a_bien_fonctionne)}
${row("Ce qui n'a pas bien fonctionné",plan.ce_qui_na_pas_bien_fonctionne)}
${row('Remarques & Suggestions',plan.remarques_suggestions)}
${row('Réflexion sur les objectifs de transfert',plan.reflexion_transfert)}
`)}
<div class="footer">Créé le ${dateStr} · EPIA — École Pilote Innovante Alpha · Lomé, Togo · Programme du Diplôme IB</div>
</div>
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},500);});</script>
</body></html>`

  const blob = new Blob([html],{type:'text/html;charset=utf-8'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Plan_${(plan.matiere||'EPIA').replace(/\s+/g,'_')}_${plan.annee_scolaire||''}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(()=>URL.revokeObjectURL(url),5000)
}
