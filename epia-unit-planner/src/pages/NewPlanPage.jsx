import UnitPlanForm from '../components/UnitPlanForm'
export default function NewPlanPage() {
  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Nouveau plan d'unité</h1>
        <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>Remplissez les 3 phases du plan d'unité Programme du Diplôme</p>
      </div>
      <UnitPlanForm />
    </div>
  )
}