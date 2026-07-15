import { useTeamTransfers } from '../../hooks/useTeamTransfers'
import type { Transfer } from '../../types'

function TransferRow({ transfer }: { transfer: Transfer }) {
  const isArrival = transfer.type === 'IN'
  const club = isArrival ? transfer.teams.from?.name : transfer.teams.to?.name
  const fee = transfer.transferFee ?? 'Undisclosed'
  const date = transfer.transferDate
    ? new Date(transfer.transferDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
    : 'TBC'
  return (
    <div style={{ padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: '8px', border: `1px solid ${isArrival ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, marginBottom: '0.5rem' }}>
      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{transfer.playerName}</div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{isArrival ? '← From' : '→ To'} {club ?? 'Unknown'}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', color: isArrival ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
          {fee.toLowerCase() === 'free' ? 'Free Transfer' : fee.toLowerCase().includes('loan') ? '🔄 Loan' : `€${fee}`}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{date}</span>
      </div>
    </div>
  )
}

export function Transfers() {
  const { data: transfers, isLoading } = useTeamTransfers()
  const arrivals = transfers?.filter(t => t.type === 'IN') ?? []
  const departures = transfers?.filter(t => t.type === 'OUT') ?? []
  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading transfers...</p></div>
  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>🔄 Transfer Window</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '1.5rem' }}>Confirmed signings & departures — Summer 2025</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#22c55e' }}>Arrivals ({arrivals.length})</span>
          </div>
          {arrivals.length === 0
            ? <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No confirmed arrivals yet.</p>
            : arrivals.map(t => <TransferRow key={t.id} transfer={t} />)
          }
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#ef4444' }}>Departures ({departures.length})</span>
          </div>
          {departures.length === 0
            ? <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No confirmed departures yet.</p>
            : departures.map(t => <TransferRow key={t.id} transfer={t} />)
          }
        </div>
      </div>
    </div>
  )
}
