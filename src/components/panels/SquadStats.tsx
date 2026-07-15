import { useMemo, useState } from 'react'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'

type SortKey = 'appearances' | 'goals' | 'assists' | 'yellowCards' | 'redCards'

interface PlayerRow {
  id: number; name: string; appearances: number;
  goals: number; assists: number; yellowCards: number; redCards: number;
}

export function SquadStats() {
  const { data: matches, isLoading } = useTeamMatches(2024)
  const { teamId } = useTeam()
  const [sortBy, setSortBy] = useState<SortKey>('appearances')

  const players = useMemo((): PlayerRow[] => {
    if (!matches || !teamId) return []
    const map = new Map<number, PlayerRow>()
    matches.filter(m => m.status === 'FINISHED').forEach(m => {
      const isHome = m.homeTeam.id === teamId
      const lineups: any[] = (m as any)[isHome ? 'homeTeam' : 'awayTeam']?.lineup ?? []
      lineups.forEach((p: any) => {
        const existing = map.get(p.id) ?? { id: p.id, name: p.name, appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        existing.appearances++
        map.set(p.id, existing)
      })
    })
    return Array.from(map.values()).sort((a, b) => b[sortBy] - a[sortBy])
  }, [matches, teamId, sortBy])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading squad...</p></div>

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>👥 Squad Stats</h2>
      {players.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Squad lineup data is not available on the free API tier for this team.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600 }}>Player</th>
                {(['appearances', 'goals', 'assists', 'yellowCards', 'redCards'] as SortKey[]).map(k => (
                  <th key={k} onClick={() => setSortBy(k)} style={{ padding: '0.5rem 0.75rem', textAlign: 'right', cursor: 'pointer', color: sortBy === k ? 'var(--color-accent)' : 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, userSelect: 'none' }}>
                    {{ appearances: 'Apps', goals: 'Goals', assists: 'Assists', yellowCards: 'YC', redCards: 'RC' }[k]} {sortBy === k ? '▼' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>{p.name}</td>
                  <td className="stat-number" style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{p.appearances}</td>
                  <td className="stat-number" style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{p.goals}</td>
                  <td className="stat-number" style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{p.assists}</td>
                  <td className="stat-number" style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#f59e0b' }}>{p.yellowCards}</td>
                  <td className="stat-number" style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#ef4444' }}>{p.redCards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
