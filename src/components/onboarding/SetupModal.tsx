import { useState } from 'react'
import { createApiClient } from '../../lib/api'
import { useTeam } from '../../context/TeamContext'
import { COMPETITIONS } from '../../lib/competitions'
import type { TeamInfo } from '../../types'

type Step = 'api-key' | 'league' | 'team'

export function SetupModal() {
  const { setApiKey, setTeamId, setCompetitionId } = useTeam()
  const [step, setStep] = useState<Step>('api-key')
  const [inputKey, setInputKey] = useState('')
  const [validatedKey, setValidatedKey] = useState('')
  const [validating, setValidating] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [selectedCompId, setSelectedCompId] = useState<number | null>(null)
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [loadingTeams, setLoadingTeams] = useState(false)

  async function handleValidateKey() {
    setValidating(true); setKeyError('')
    try {
      const valid = await createApiClient(inputKey).validateKey()
      if (valid) {
        setValidatedKey(inputKey); setApiKey(inputKey); setStep('league')
      } else {
        setKeyError('Invalid API key. Please check and try again.')
      }
    } catch {
      setKeyError('Could not connect. Check your internet connection.')
    }
    setValidating(false)
  }

  async function handleSelectLeague(compId: number) {
    setSelectedCompId(compId); setLoadingTeams(true)
    try {
      const teamList = await createApiClient(validatedKey).getCompetitionTeams(compId)
      setTeams(teamList); setStep('team')
    } catch {
      setTeams([])
    }
    setLoadingTeams(false)
  }

  function handleSelectTeam(team: TeamInfo) {
    setCompetitionId(selectedCompId!); setTeamId(team.id)
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
  const modalStyle: React.CSSProperties = {
    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
    borderRadius: '16px', padding: '2rem', width: '560px', maxWidth: '95vw',
    maxHeight: '80vh', overflowY: 'auto',
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Welcome to <span style={{ color: 'var(--color-accent)' }}>KickStats</span>
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '2rem' }}>
          {step === 'api-key' && 'Enter your free API key from football-data.org to get started.'}
          {step === 'league'  && 'Choose a league to explore.'}
          {step === 'team'    && 'Pick your team.'}
        </div>

        {step === 'api-key' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              id="setup-api-key"
              type="text"
              placeholder="Paste your API key here..."
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-text)', fontSize: '14px', outline: 'none', width: '100%' }}
            />
            {keyError && <div style={{ color: 'var(--color-danger)', fontSize: '13px' }}>{keyError}</div>}
            <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontSize: '13px' }}>Get a free API key →</a>
            <button
              id="setup-validate-btn"
              onClick={handleValidateKey}
              disabled={!inputKey || validating}
              style={{ background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '14px', cursor: 'pointer', opacity: (!inputKey || validating) ? 0.5 : 1 }}
            >
              {validating ? 'Validating...' : 'Continue →'}
            </button>
          </div>
        )}

        {step === 'league' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
            {COMPETITIONS.map(c => (
              <button key={c.id} id={`league-${c.code}`} onClick={() => handleSelectLeague(c.id)} disabled={loadingTeams}
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', cursor: 'pointer', textAlign: 'left', color: 'var(--color-text)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{c.flag}</span>{c.name}
              </button>
            ))}
          </div>
        )}

        {step === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {teams.map(team => (
              <button key={team.id} id={`team-${team.id}`} onClick={() => handleSelectTeam(team)}
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem 0.75rem', cursor: 'pointer', color: 'var(--color-text)', fontSize: '12px', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img src={team.crest} alt={team.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                {team.shortName || team.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
