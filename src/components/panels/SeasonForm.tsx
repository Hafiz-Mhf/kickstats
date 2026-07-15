import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'

function LoadingCard({ title }: { title: string }) {
  return <div className="card"><h2 style={{ fontFamily: 'var(--font-stat)', fontWeight: 700 }}>{title}</h2><div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Loading...</div></div>
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return <div className="card"><h2 style={{ fontFamily: 'var(--font-stat)', fontWeight: 700 }}>{title}</h2><div style={{ color: 'var(--color-danger)', marginTop: '1rem', fontSize: '13px' }}>{message === 'RATE_LIMIT' ? '⚠️ Rate limit reached. Showing cached data.' : `Error: ${message}`}</div></div>
}

export function SeasonForm() {
  const { data: matches, isLoading, error } = useTeamMatches(2024)
  const { teamId, teamColor } = useTeam()

  const chartData = useMemo(() => {
    if (!matches || !teamId) return []
    let points = 0
    return matches
      .filter(m => m.status === 'FINISHED')
      .map((m, i) => {
        const isHome = m.homeTeam.id === teamId
        const gf = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
        const ga = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
        const result = gf > ga ? 'W' : gf === ga ? 'D' : 'L'
        points += result === 'W' ? 3 : result === 'D' ? 1 : 0
        return {
          matchday: i + 1, points, result,
          opponent: isHome ? m.awayTeam.name : m.homeTeam.name,
          score: `${gf}\u2013${ga}`,
          date: new Date(m.utcDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        }
      })
  }, [matches, teamId])

  if (isLoading) return <LoadingCard title="📈 Season Form" />
  if (error) return <ErrorCard title="📈 Season Form" message={error.message} />

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📈 Season Form</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '1.5rem' }}>Cumulative points over the season</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="matchday" stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '13px' }}
            formatter={(value, _name, props) => [`${value} pts`, `vs ${props.payload.opponent} (${props.payload.score}) — ${props.payload.result}`]}
            labelFormatter={label => `Match ${label}`}
          />
          <Line type="monotone" dataKey="points" stroke={teamColor} strokeWidth={2.5} dot={{ r: 3, fill: teamColor }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '4px', marginTop: '1rem', flexWrap: 'wrap' }}>
        {chartData.map((d, i) => (
          <span key={i} className={`badge badge-${d.result === 'W' ? 'win' : d.result === 'D' ? 'draw' : 'loss'}`} title={`${d.date} vs ${d.opponent} ${d.score}`}>{d.result}</span>
        ))}
      </div>
    </div>
  )
}
