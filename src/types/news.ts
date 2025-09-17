export interface NewsSource {
  id: string
  name: string
  bias: 'left' | 'center' | 'right'
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  publishedAt: Date
  source: NewsSource
  category: string
  factChecked: boolean
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface FilterOptions {
  category: string
  sources: string[]
  dateRange: string
  factChecked: boolean
}
