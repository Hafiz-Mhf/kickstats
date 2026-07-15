import { useMemo } from 'react'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'

export function Fixtures() {
  const { data: matches, isLoading } = useTeamMatches(2024)
  const { teamId, teamColor } = useTeam()

  const upcoming = useMemo(() => {
    if (!matches || !teamId) return []
    return matches.filter(m => ['SCHEDULED', 'LIVE', 'IN_PLAY'].includes(m.status)).slice(0, 5)
  }, [matches, teamId])

  const formGuide = useMemo(() => {
    if (!matches || !teamId) return []
    return matches.filter(m => m.status === 'FINISHED').slice(-5).map(m => {
      const isHome = m.homeTeam.id === teamId
      const gf = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
      const ga = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
      return gf > ga ? 'W' : gf === ga ? 'D' : 'L'
    })
  }, [matches, teamId])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading fixtures...</p></div>

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700 }}>📅 Upcoming Fixtures</h2>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginRight: '4px' }}>Form:</span>
          {formGuide.map((r, i) => <span key={i} className={`badge badge-${r === 'W' ? 'win' : r === 'D' ? 'draw' : 'loss'}`}>{r}</span>)}
        </div>
      </div>
      {upcoming.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No upcoming fixtures scheduled.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {upcoming.map(m => {
            const isHome = m.homeTeam.id === teamId
            const opponent = isHome ? m.awayTeam : m.homeTeam
            const matchDate = new Date(m.utcDate)
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                <div style={{ textAlign: 'center', minWidth: '48px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{matchDate.toLocaleDateString('en-GB', { month: 'short' })}</div>
                  <div className="stat-number" style={{ fontSize: '1.3rem', lineHeight: 1 }}>{matchDate.getDate()}</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'var(--color-border)' }} />
                <img src={opponent.crest} alt={opponent.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>vs {opponent.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • <span style={{ color: isHome ? teamColor : 'var(--color-text-muted)', fontWeight: isHome ? 600 : 400 }}>{isHome ? 'Home' : 'Away'}</span>
                  </div>
                </div>
                {m.status !== 'SCHEDULED' && <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '4px' }}>LIVE</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
