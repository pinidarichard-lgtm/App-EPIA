import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #2a5280 100%)',
        borderRadius: 16,
        padding: '3rem',
        color: '#fff',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(232,184,75,0.1)'
        }} />
        <div style={{
          display: 'inline-block',
          background: '#e8b84b',
          color: '#1a3a5c',
          fontSize: 12,
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 20,
          marginBottom: '1rem',
          letterSpacing: 1
        }}>PROGRAMME DU DIPLÔME IB</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Plans d'unité en ligne
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 480, lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Créez, consultez et gérez les plans d'unité du Programme du Diplôme de l'EPIA. 
          Une interface adaptée aux 3 phases : Recherche, Action et Réflexion.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/plans/new" style={{
            background: '#e8b84b',
            color: '#1a3a5c',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
          }}>
            Créer un plan d'unité
          </Link>
          <Link to="/plans" style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            Consulter les plans
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {[
          {
            color: '#2a5280', num: '01',
            title: 'Phase 1 — Recherche',
            desc: 'Définissez les objectifs de transfert, les compréhensions essentielles et les questions de recherche de l\'unité.'
          },
          {
            color: '#1a6b4a', num: '02',
            title: 'Phase 2 — Action',
            desc: 'Planifiez l\'enseignement : approches pédagogiques, évaluations formatives et sommatives, différenciation.'
          },
          {
            color: '#7a3e1a', num: '03',
            title: 'Phase 3 — Réflexion',
            desc: 'Documentez ce qui a bien fonctionné, les axes d\'amélioration et la mesure de l\'atteinte des objectifs.'
          }
        ].map(card => (
          <div key={card.num} style={{
            background: '#fff',
            borderRadius: 12,
            padding: '1.5rem',
            border: '1px solid #e8e6e0',
          }}>
            <div style={{
              background: card.color,
              color: '#fff',
              width: 36, height: 36,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13,
              marginBottom: '1rem'
            }}>{card.num}</div>
            <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: '0.5rem', color: '#1a1a1a' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
