import { Link } from 'react-router-dom'

const CARDS = [
  { to: '/plans', color: '#1a3a5c', icon: '📋', title: "Plans d'unité", desc: "Créez et consultez les plans d'unité PD en 3 phases." },
  { to: '/cahier', color: '#1a6b4a', icon: '📒', title: 'Cahier de textes', desc: 'Enregistrez le contenu des cours et les devoirs par matière.' },
  { to: '/eleves', color: '#2a5280', icon: '👥', title: 'Listes élèves', desc: 'Gérez les promotions D1 (2024–2025) et D2 (2025–2026).' },
  { to: '/appel', color: '#7a3e1a', icon: '✅', title: "Feuilles d'appel", desc: "Faites l'appel par cours et consultez l'historique des présences." },
]

export default function HomePage() {
  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #2a5280 100%)',
        borderRadius: 16, padding: '3rem', color: '#fff',
        marginBottom: '2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(232,184,75,0.1)' }} />
        <div style={{ display: 'inline-block', background: '#e8b84b', color: '#1a3a5c', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: '1rem', letterSpacing: 1 }}>
          PROGRAMME DU DIPLÔME IB
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Gestion EPIA — Lomé
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 480, lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Plans d'unité, cahier de textes, listes d'élèves et appels pour les promotions D1 et D2.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/plans/new" style={{ background: '#e8b84b', color: '#1a3a5c', textDecoration: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 15 }}>
            Créer un plan d'unité
          </Link>
          <Link to="/plans" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.3)' }}>
            Consulter les plans
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {CARDS.map(card => (
          <Link key={card.to} to={card.to} style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e8e6e0', textDecoration: 'none', display: 'block' }}>
            <div style={{ background: card.color, color: '#fff', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: '1rem' }}>
              {card.icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: '0.5rem', color: '#1a1a1a' }}>{card.title}</h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
