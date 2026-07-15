import { useMemo, useState } from 'react'
import { useTeamMatches } from '../../hooks/useTeamMatches'
import { useTeam } from '../../context/TeamContext'

export function HeadToHead() {
  const { data: matches, isLoading } = useTeamMatches(2024)
  const { teamId, teamColor } = useTeam()
  const [selectedOpp, setSelectedOpp] = useState<number | null>(null)

  const opponents = useMemo(() => {
    if (!matches || !teamId) return []
    const seen = new Map<number, string>()
    matches.filter(m => m.status === 'FINISHED').forEach(m => {
      const opp = m.homeTeam.id === teamId ? m.awayTeam : m.homeTeam
      if (!seen.has(opp.id)) seen.set(opp.id, opp.name)
    })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [matches, teamId])

  const h2hMatches = useMemo(() => {
    if (!matches || !teamId || !selectedOpp) return []
    return matches.filter(m => m.status === 'FINISHED' && (m.homeTeam.id === selectedOpp || m.awayTeam.id === selectedOpp))
  }, [matches, teamId, selectedOpp])

  const record = useMemo(() => {
    let w = 0, d = 0, l = 0, gf = 0, ga = 0
    h2hMatches.forEach(m => {
      const isHome = m.homeTeam.id === teamId
      const myGF = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
      const myGA = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
      gf += myGF; ga += myGA
      if (myGF > myGA) w++; else if (myGF === myGA) d++; else l++
    })
    return { w, d, l, gf, ga }
  }, [h2hMatches, teamId])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></div>

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>⚔️ Head-to-Head</h2>
      <select id="h2h-opponent-select" value={selectedOpp ?? ''} onChange={e => setSelectedOpp(Number(e.target.value))}
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: 'var(--color-text)', fontSize: '13px', marginBottom: '1.5rem', width: '100%', maxWidth: '300px' }}>
        <option value="">Select opponent...</option>
        {opponents.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
      {selectedOpp && h2hMatches.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Wins', value: record.w, color: '#22c55e' },
              { label: 'Draws', value: record.d, color: '#f59e0b' },
              { label: 'Losses', value: record.l, color: '#ef4444' },
              { label: 'GF', value: record.gf, color: teamColor },
              { label: 'GA', value: record.ga, color: '#ef4444' }
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', flex: 1 }}>
                <div className="stat-number" style={{ fontSize: '1.5rem', color }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {h2hMatches.map(m => {
              const isHome = m.homeTeam.id === teamId
              const gf = isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0)
              const ga = isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0)
              const result = gf > ga ? 'W' : gf === ga ? 'D' : 'L'
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--color-surface-2)', borderRadius: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{new Date(m.utcDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                  <span>{m.homeTeam.name} {m.score.fullTime.home}–{m.score.fullTime.away} {m.awayTeam.name}</span>
                  <span className={`badge badge-${result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss'}`}>{result}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
      {selectedOpp && h2hMatches.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No finished matches found against this opponent.</p>}
    </div>
  )
}
