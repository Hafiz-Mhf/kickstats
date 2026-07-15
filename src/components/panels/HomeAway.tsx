import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'
import type { Match } from '../../types'

function computeSplit(matches: Match[], teamId: number, venue: 'home' | 'away') {
  const subset = matches.filter(m =>
    m.status === 'FINISHED' &&
    (venue === 'home' ? m.homeTeam.id === teamId : m.awayTeam.id === teamId)
  )
  let wins = 0, draws = 0, gf = 0, ga = 0
  subset.forEach(m => {
    const isHome = m.homeTeam.id === teamId
    const myGF = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
    const myGA = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
    gf += myGF; ga += myGA
    if (myGF > myGA) wins++
    else if (myGF === myGA) draws++
  })
  const losses = subset.length - wins - draws
  return { total: subset.length, wins, draws, losses, gf, ga }
}

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444']

function SplitSection({ title, data, icon }: { title: string; data: ReturnType<typeof computeSplit>; icon: string }) {
  const pieData = useMemo(() => [
    { name: 'Wins', value: data.wins },
    { name: 'Draws', value: data.draws },
    { name: 'Losses', value: data.losses },
  ], [data])

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, marginBottom: '1rem' }}>{icon} {title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          ['Wins', data.wins],
          ['Draws', data.draws],
          ['Losses', data.losses],
          ['GF', data.gf],
          ['GA', data.ga],
          ['Games', data.total]
        ].map(([label, value]) => (
          <div key={label} style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
            <div className="stat-number" style={{ fontSize: '1.5rem' }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
            {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} games`, name]} contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function HomeAway() {
  const { data: matches, isLoading } = useTeamMatches(2024)
  const { teamId } = useTeam()
  const home = useMemo(() => matches && teamId ? computeSplit(matches, teamId, 'home') : null, [matches, teamId])
  const away = useMemo(() => matches && teamId ? computeSplit(matches, teamId, 'away') : null, [matches, teamId])
  if (isLoading || !home || !away) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></div>
  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>🏠 Home vs Away Performance</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <SplitSection title="Home" data={home} icon="🏠" />
        <div style={{ width: '1px', background: 'var(--color-border)' }} />
        <SplitSection title="Away" data={away} icon="✈️" />
      </div>
    </div>
  )
}
