import { useQuery } from '@tanstack/react-query'

export interface NewsItem {
  title: string
  link: string
  pubDate: string
  description: string
}

export function useFootballNews() {
  return useQuery<NewsItem[], Error>({
    queryKey: ['football-news'],
    queryFn: async () => {
      const res = await fetch('/news-api/sport/football/rss.xml')
      if (!res.ok) throw new Error('Failed to fetch news feed')
      const text = await res.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/xml')
      const items = doc.querySelectorAll('item')
      const news: NewsItem[] = []
      items.forEach(item => {
        news.push({
          title: item.querySelector('title')?.textContent ?? '',
          link: item.querySelector('link')?.textContent ?? '',
          pubDate: item.querySelector('pubDate')?.textContent ?? '',
          description: item.querySelector('description')?.textContent ?? '',
        })
      })
      return news
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
