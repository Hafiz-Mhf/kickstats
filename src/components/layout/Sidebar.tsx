import { NavLink } from 'react-router-dom'
import { TrendingUp, Target, Home, Trophy, ListOrdered, Swords, Calendar, Newspaper } from 'lucide-react'
import { useTeam } from '../../context/TeamContext'

const NAV_ITEMS = [
  { path: '/form',      icon: TrendingUp,     label: 'Season Form' },
  { path: '/goals',     icon: Target,         label: 'Goals' },
  { path: '/homeaway',  icon: Home,           label: 'Home / Away' },
  { path: '/scorers',   icon: Trophy,         label: 'Top Scorers' },
  { path: '/table',     icon: ListOrdered,    label: 'League Table' },
  { path: '/h2h',       icon: Swords,         label: 'Head-to-Head' },
  { path: '/fixtures',  icon: Calendar,       label: 'Fixtures' },
  { path: '/news',      icon: Newspaper,      label: 'Latest News' },
]

export function Sidebar() {
  const { teamColor } = useTeam()
  return (
    <aside style={{ width: '220px', minWidth: '220px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', padding: '1.25rem 0' }}>
      <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-stat)', fontWeight: 800, fontSize: '1.4rem', color: teamColor }}>
          Kick<span style={{ color: 'var(--color-text)' }}>Stats</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Football Analytics</div>
      </div>
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            id={`nav-${path.slice(1)}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', borderRadius: '8px', marginBottom: '2px',
              textDecoration: 'none', fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? teamColor : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-accent-dim)' : 'transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
