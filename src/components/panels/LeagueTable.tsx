import { useMemo } from 'react'
import { useStandings } from '../../hooks/useStandings'
import { useTeam } from '../../context/TeamContext'

export function LeagueTable() {
  const { data: standingsList, isLoading, error } = useStandings(2024)
  const { teamId, teamColor } = useTeam()

  const tableData = useMemo(() => {
    if (!standingsList) return []
    // Find the TOTAL table standings (not home/away splits)
    const totalStandings = standingsList.find(s => s.type === 'TOTAL')
    return totalStandings ? totalStandings.table : []
  }, [standingsList])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading standings...</p></div>
  if (error) return <div className="card"><p style={{ color: 'var(--color-danger)' }}>Error: {error.message}</p></div>

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>🏆 League Table</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '1.5rem' }}>Current season standings</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', width: '40px', textAlign: 'center' }}>Pos</th>
              <th style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)' }}>Club</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '50px' }}>GP</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '40px' }}>W</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '40px' }}>D</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '40px' }}>L</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '60px' }}>GD</th>
              <th style={{ padding: '0.6rem 0.5rem', color: 'var(--color-text-muted)', textAlign: 'center', width: '60px', fontWeight: 600 }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(row => {
              const isActive = row.team.id === teamId
              return (
                <tr
                  key={row.team.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: isActive ? 'var(--color-accent-dim)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'background 0.2s ease',
                  }}
                >
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} className="stat-number">{row.position}</td>
                  <td style={{ padding: '0.75rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={row.team.crest} alt={row.team.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '14px' }}>{row.team.shortName || row.team.name}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} className="stat-number">{row.playedGames}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} className="stat-number">{row.won}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} className="stat-number">{row.draw}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} className="stat-number">{row.lost}</td>
                  <td
                    style={{
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      color: isActive ? teamColor : row.goalDifference > 0 ? '#22c55e' : row.goalDifference < 0 ? '#ef4444' : 'var(--color-text)',
                    }}
                    className="stat-number"
                  >
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '14px' }} className="stat-number">{row.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
