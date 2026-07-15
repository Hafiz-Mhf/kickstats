import { useMemo } from 'react'
import { useFootballNews } from '../../hooks/useFootballNews'
import { useTeam } from '../../context/TeamContext'
import { useTeamInfo } from '../../hooks/useTeamInfo'
import { ExternalLink, Flame } from 'lucide-react'

export function NewsFeed() {
  const { data: news, isLoading, error } = useFootballNews()
  const { teamColor } = useTeam()
  const { data: teamInfo } = useTeamInfo()

  const teamName = teamInfo?.shortName || teamInfo?.name || ''

  const processedNews = useMemo(() => {
    if (!news) return []
    return news.map(item => {
      const isAboutTeam = teamName && (
        item.title.toLowerCase().includes(teamName.toLowerCase()) ||
        item.description.toLowerCase().includes(teamName.toLowerCase())
      )
      return { ...item, isAboutTeam }
    })
  }, [news, teamName])

  if (isLoading) return <div className="card"><p style={{ color: 'var(--color-text-muted)' }}>Loading latest news...</p></div>
  if (error) return <div className="card"><p style={{ color: 'var(--color-danger)' }}>Error loading news feed.</p></div>

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'var(--font-stat)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>📰 Latest News</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '1.5rem' }}>Real-time updates from BBC Sport</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {processedNews.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              background: 'var(--color-surface-2)',
              borderRadius: '10px',
              border: item.isAboutTeam ? `1px solid ${teamColor}` : '1px solid var(--color-border)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                {item.isAboutTeam && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: teamColor,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    <Flame size={12} fill={teamColor} />
                    {teamName} Topic
                  </span>
                )}
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {new Date(item.pubDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <ExternalLink size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 0.5rem 0', lineHeight: 1.4, color: item.isAboutTeam ? teamColor : 'var(--color-text)' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
