export const EVALUATIONS_OPTIONS = [
  { id: 'epreuve1a', label: 'Épreuve 1a – Questions à choix multiple (QCM)' },
  { id: 'epreuve2_bref', label: 'Épreuve 2 – Questions à réponse brève' },
  { id: 'epreuve2_dev', label: 'Épreuve 2 – Questions à développement' },
  { id: 'epreuve2_donnees', label: "Épreuve 2 – Questions s'appuyant sur des données" },
  { id: 'epreuve1b', label: 'Épreuve 1b – Questions de sciences expérimentales' },
  { id: 'tp', label: 'Travaux pratiques (TP)' },
  { id: 'memoire', label: 'Mémoire (Extended Essay)' },
]
export const APPROCHES_OPTIONS = [
  { id: 'cours_magistral', label: 'Cours magistral' },
  { id: 'socratique', label: 'Dialogue socratique' },
  { id: 'binome_groupe', label: 'Travail en binôme / petits groupes' },
  { id: 'notes_presentation', label: 'Notes sur présentation (PowerPoint, etc.)' },
  { id: 'presentations_indiv', label: 'Présentations individuelles' },
  { id: 'presentations_groupe', label: 'Présentations en groupes' },
  { id: 'cours_eleves', label: 'Cours ou activité menés par les élèves' },
  { id: 'interdisciplinaire', label: 'Apprentissage interdisciplinaire' },
  { id: 'recherche_ligne', label: 'Recherche et activité en ligne' },
  { id: 'discussion', label: 'Discussion en classe' },
]
export const DIFFERENTIATION_OPTIONS = [
  { id: 'identite', label: "Affirmation de l'identité et construction de l'estime de soi" },
  { id: 'connaissances_ant', label: 'Valorisation des connaissances antérieures' },
  { id: 'etayage', label: 'Étayage' },
  { id: 'elargissement', label: 'Élargissement du champ de connaissances' },
  { id: 'adaptation', label: 'Adaptation pour les élèves en difficulté' },
  { id: 'enrichissement', label: 'Enrichissement pour les élèves avancés' },
]
export const ADA_OPTIONS = [
  { id: 'pensee', label: 'Compétences de pensée (pensée critique, créative)' },
  { id: 'sociales', label: 'Compétences sociales (collaboration, respect)' },
  { id: 'communication', label: 'Compétences de communication (écoute, expression écrite et orale)' },
  { id: 'autogestion', label: "Compétences d'autogestion (organisation, gestion du temps)" },
  { id: 'recherche', label: "Compétences de recherche (gestion de l'information, médias)" },
]
export const LANGUE_OPTIONS = [
  { id: 'connaissances_prealables', label: 'Exploitation des connaissances préalables' },
  { id: 'etayage_nouvel', label: 'Étayage du nouvel apprentissage' },
  { id: 'acquisition', label: 'Acquisition par la pratique' },
  { id: 'manifestation', label: 'Manifestation de la maîtrise' },
]
export const TDC_OPTIONS = [
  { id: 'connaissances_perso', label: 'Connaissances personnelles et partagées' },
  { id: 'modes', label: 'Modes de la connaissance' },
  { id: 'domaines', label: 'Domaines de la connaissance' },
  { id: 'cadre', label: 'Cadre conceptuel de la connaissance' },
]
export const CAS_OPTIONS = [
  { id: 'creativite', label: 'Créativité' },
  { id: 'activite', label: 'Activité' },
  { id: 'service', label: 'Service' },
]
export const INITIAL_FORM_STATE = {
  matiere: '', enseignants: '', annee_scolaire: '', dates: '',
  groupe_matieres: '', niveau: '', annee_pd: '', semestre: '', trimestre: '',
  partie_cours: '', description_unite: '', evaluations: [],
  objectif_1: '', objectif_2: '', objectif_3: '',
  connaissance_4: '', connaissance_5: '', competence_6: '', competence_7: '',
  concept_8: '', concept_9: '',
  question_factuelle_10: '', question_factuelle_11: '',
  question_conceptuelle_12: '', question_conceptuelle_13: '',
  question_ouverte_14: '', question_ouverte_15: '',
  approches_pedagogiques: [],
  evaluation_formative_18: '', evaluation_formative_19: '',
  evaluation_sommative_20: '', evaluation_sommative_21: '',
  differentiation: [], differentiation_details: '',
  ada_competences: [], ada_details: '',
  langue_apprentissage: [], langue_details: '',
  tdc: [], tdc_details: '', cas: [], cas_details: '',
  ressource_22: '', ressource_23: '',
  ce_qui_a_bien_fonctionne: '', ce_qui_na_pas_bien_fonctionne: '',
  remarques_suggestions: '', reflexion_transfert: '',
  statut: 'brouillon',
}
