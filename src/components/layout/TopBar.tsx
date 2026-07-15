import { useTeamInfo } from '../../hooks/useTeamInfo'
import { useTeam } from '../../context/TeamContext'

export function TopBar() {
  const { data: team } = useTeamInfo()
  const { teamColor } = useTeam()
  return (
    <header style={{ height: '60px', minHeight: '60px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
      {team ? (
        <>
          <img src={team.crest} alt={team.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: '15px', color: teamColor }}>{team.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Season 2024/25</div>
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Select a team to get started</div>
      )}
    </header>
  )
}
