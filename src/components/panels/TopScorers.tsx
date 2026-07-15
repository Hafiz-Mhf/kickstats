import { useState } from 'react'
import { useTopScorers } from '../../hooks/useTopScorers'
import { useTeam } from '../../context/TeamContext'

export function TopScorers() {
  const { data: scorers, isLoading } = useTopScorers(2024)
  const { teamId, teamColor } = useTeam()
  const [filter, setFilter] = useState<'all' | 'team'>('all')
  const displayed = scorers ? (filter === 'team' ? scorers.filter(s => s.team.id === teamId) : scorers) : []
  const maxGoals = displayed[0]?.goals ?? 1
  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading scorers...</p></div>
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700 }}>🏆 Top Scorers</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'team'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: filter === f ? 'var(--color-accent-dim)' : 'transparent', color: filter === f ? teamColor : 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {f === 'all' ? 'All Teams' : 'This Team'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayed.map((s, i) => (
          <div key={s.player.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="stat-number" style={{ width: '24px', color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'right' }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: s.team.id === teamId ? teamColor : 'var(--color-text)' }}>{s.player.name}</span>
                <span className="stat-number" style={{ fontSize: '14px' }}>
                  {s.goals} <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>G</span>
                  {s.assists != null && <> · {s.assists} <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>A</span></>}
                </span>
              </div>
              <div style={{ height: '4px', background: 'var(--color-surface-2)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(s.goals / maxGoals) * 100}%`, background: s.team.id === teamId ? teamColor : 'var(--color-text-muted)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '3px' }}>{s.team.name}</div>
            </div>
          </div>
        ))}
        {displayed.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No scorers found for this team.</p>}
      </div>
    </div>
  )
}
