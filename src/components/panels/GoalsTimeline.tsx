import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'

export function GoalsTimeline() {
  const { data: matches, isLoading, error } = useTeamMatches(2024)
  const { teamId, teamColor } = useTeam()

  const chartData = useMemo(() => {
    if (!matches || !teamId) return []
    return matches
      .filter(m => m.status === 'FINISHED')
      .map((m, i) => {
        const isHome = m.homeTeam.id === teamId
        const gf = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
        const ga = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
        return { match: i + 1, GF: gf, GA: ga, opponent: isHome ? m.awayTeam.name : m.homeTeam.name,
          date: new Date(m.utcDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }
      })
  }, [matches, teamId])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading Goals...</p></div>
  if (error) return <div className="card"><p style={{ color: 'var(--color-danger)' }}>Error: {error.message}</p></div>

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>⚽ Goals Timeline</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '1.5rem' }}>Goals scored (GF) vs goals conceded (GA) per match</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="match" stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} />
          <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '13px' }}
            labelFormatter={(label, payload) => payload?.[0]?.payload ? `Match ${label} vs ${payload[0].payload.opponent}` : `Match ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Bar dataKey="GF" fill={teamColor} radius={[4,4,0,0]} />
          <Bar dataKey="GA" fill="#ef4444" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
