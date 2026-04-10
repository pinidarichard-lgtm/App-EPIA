// Composants réutilisables pour le formulaire du plan d'unité

export function SectionHeader({ phase, phaseColor, title, subtitle }) {
  return (
    <div style={{
      background: phaseColor,
      borderRadius: 10,
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      color: '#fff'
    }}>
      {phase && (
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: 0.75, marginBottom: 4 }}>
          {phase}
        </div>
      )}
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4, margin: 0 }}>{subtitle}</p>}
    </div>
  )
}

export function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{
        fontSize: 13,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#888',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #eee'
      }}>{title}</h3>
      {children}
    </div>
  )
}

export function Field({ label, hint, children, required }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: 14,
        fontWeight: 600,
        color: '#333',
        marginBottom: '6px'
      }}>
        {label}
        {required && <span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 12, color: '#888', marginBottom: 6, marginTop: -2 }}>{hint}</p>}
      {children}
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, ...props }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '9px 12px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 14,
        background: '#fff',
        outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#1a3a5c'}
      onBlur={e => e.target.style.borderColor = '#ddd'}
      {...props}
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 3, ...props }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '9px 12px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 14,
        background: '#fff',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
        lineHeight: 1.6,
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#1a3a5c'}
      onBlur={e => e.target.style.borderColor = '#ddd'}
      {...props}
    />
  )
}

export function SelectInput({ value, onChange, children, ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '9px 12px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 14,
        background: '#fff',
        outline: 'none',
      }}
      {...props}
    >
      {children}
    </select>
  )
}

export function CheckboxGroup({ options, selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          cursor: 'pointer', fontSize: 14, color: '#333'
        }}>
          <input
            type="checkbox"
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            style={{ marginTop: 2, flexShrink: 0, width: 16, height: 16, cursor: 'pointer' }}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export function FormCard({ children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 10,
      border: '1px solid #e8e6e0',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {children}
    </div>
  )
}

export function Grid2({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
      {children}
    </div>
  )
}
