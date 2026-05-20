import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Layout({ children }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/apropos', label: 'À propos' },
    { to: '/plans', label: '📋 Plans d\'unité' },
    { to: '/cahier', label: '📒 Cahier de textes' },
    { to: '/eleves', label: '👥 Élèves' },
    { to: '/appel', label: '✅ Appel' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: '#1a3a5c', color: '#fff',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo-epia.png" alt="Logo EPIA" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>EPIA Lomé</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: -2 }}>Programme du Diplôme</div>
          </div>
        </Link>

        {/* Navigation desktop */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} active={location.pathname.startsWith(link.to)}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/plans/new" style={{
            background: '#e8b84b', color: '#1a3a5c', textDecoration: 'none',
            padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 700, marginLeft: 4
          }}>+ Nouveau plan</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      <footer style={{
        background: '#1a3a5c', color: 'rgba(255,255,255,0.5)',
        textAlign: 'center', padding: '1rem', fontSize: 13
      }}>
        © 2025 L'E.P.I.A. — École Pilote Innovante Alpha de Lomé, Togo · Programme du Diplôme IB
      </footer>
    </div>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      color: active ? '#e8b84b' : 'rgba(255,255,255,0.82)',
      textDecoration: 'none', fontSize: 13,
      padding: '6px 10px', borderRadius: 6,
      background: active ? 'rgba(232,184,75,0.12)' : 'transparent',
      fontWeight: active ? 700 : 400,
    }}>{children}</Link>
  )
}
