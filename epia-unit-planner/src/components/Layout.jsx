import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: '#1a3a5c',
        color: '#fff',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#e8b84b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#1a3a5c'
          }}>IB</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>EPIA Lomé</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: -2 }}>Programme du Diplôme</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <NavLink to="/plans" active={location.pathname === '/plans'}>
            Tous les plans
          </NavLink>
          <Link to="/plans/new" style={{
            background: '#e8b84b',
            color: '#1a3a5c',
            textDecoration: 'none',
            padding: '7px 16px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
          }}>
            + Nouveau plan
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      <footer style={{
        background: '#1a3a5c',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        padding: '1rem',
        fontSize: 13
      }}>
        © 2025 L'E.P.I.A. — École Pilote Innovante Alpha de Lomé, Togo
      </footer>
    </div>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      color: active ? '#e8b84b' : 'rgba(255,255,255,0.8)',
      textDecoration: 'none',
      fontSize: 14,
      padding: '6px 12px',
      borderRadius: 6,
      background: active ? 'rgba(232,184,75,0.12)' : 'transparent',
    }}>
      {children}
    </Link>
  )
}
