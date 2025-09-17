'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import NewsGrid from '@/components/NewsGrid'
import FilterPanel from '@/components/FilterPanel'
import PersonalizationPanel from '@/components/PersonalizationPanel'
import { NewsArticle, NewsSource } from '@/types/news'
import { analytics } from '@/lib/analytics'
import { fetchAllFeeds } from '@/lib/rssService'

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [preferredSources, setPreferredSources] = useState<string[]>(['charlie-kirk', 'tucker-carlson', 'nra-ila', 'gun-news'])
  const [biasBalance, setBiasBalance] = useState<'balanced' | 'left-leaning' | 'right-leaning' | 'custom'>('right-leaning')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock news data - in real app, this would come from news APIs
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Global Climate Summit Reaches Historic Agreement',
      description: 'World leaders have reached a landmark agreement on carbon reduction targets, marking a significant step forward in climate action.',
      url: 'https://www.reuters.com/business/environment/global-climate-summit-reaches-historic-agreement-2024-01-15/',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T10:30:00Z'),
      source: { id: 'reuters', name: 'Reuters', bias: 'center' },
      category: 'Environment',
      factChecked: true,
      sentiment: 'neutral'
    },
    {
      id: '2',
      title: 'New Economic Data Shows Mixed Signals',
      description: 'Latest economic indicators present a complex picture of recovery, with some sectors showing strong growth while others face challenges.',
      url: 'https://apnews.com/article/economy-inflation-federal-reserve-interest-rates-2024-01-15',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T09:15:00Z'),
      source: { id: 'ap', name: 'Associated Press', bias: 'center' },
      category: 'Economy',
      factChecked: true,
      sentiment: 'neutral'
    },
    {
      id: '3',
      title: 'Breakthrough in Medical Research Announced',
      description: 'Scientists have made significant progress in developing new treatments for previously incurable diseases.',
      url: 'https://www.bbc.com/news/health/medical-research-breakthrough-2024',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T08:45:00Z'),
      source: { id: 'bbc', name: 'BBC News', bias: 'center' },
      category: 'Health',
      factChecked: true,
      sentiment: 'positive'
    },
    {
      id: '4',
      title: 'Technology Sector Faces New Regulations',
      description: 'Government announces new framework for tech industry oversight, balancing innovation with consumer protection.',
      url: 'https://www.wsj.com/articles/technology-sector-faces-new-regulations-2024-01-15',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T07:20:00Z'),
      source: { id: 'wsj', name: 'Wall Street Journal', bias: 'center' },
      category: 'Technology',
      factChecked: true,
      sentiment: 'neutral'
    },
    {
      id: '5',
      title: 'International Trade Relations Show Improvement',
      description: 'Recent diplomatic efforts have led to positive developments in global trade partnerships.',
      url: 'https://www.cnn.com/2024/01/15/politics/international-trade-relations-improvement/index.html',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T06:30:00Z'),
      source: { id: 'cnn', name: 'CNN', bias: 'center' },
      category: 'Politics',
      factChecked: true,
      sentiment: 'positive'
    },
    {
      id: '6',
      title: 'Space Exploration Reaches New Milestone',
      description: 'Latest space mission achieves unprecedented success, opening new possibilities for scientific discovery.',
      url: 'https://www.npr.org/2024/01/15/space-exploration-milestone-achievement',
      imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T05:15:00Z'),
      source: { id: 'npr', name: 'NPR', bias: 'center' },
      category: 'Science',
      factChecked: true,
      sentiment: 'positive'
    },
    {
      id: '7',
      title: 'The Real Story Behind Campus Free Speech',
      description: 'Charlie Kirk discusses the ongoing battle for free speech on college campuses and the importance of diverse viewpoints in education.',
      url: 'https://www.turningpointusa.com/news/campus-free-speech-battle/',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T04:30:00Z'),
      source: { id: 'charlie-kirk', name: 'Charlie Kirk', bias: 'right' },
      category: 'Politics',
      factChecked: false,
      sentiment: 'neutral'
    },
    {
      id: '8',
      title: 'Tucker Carlson Tonight: The Media Industrial Complex',
      description: 'Tucker Carlson examines the relationship between corporate media and political power, questioning mainstream narratives.',
      url: 'https://tuckercarlson.com/media-industrial-complex/',
      imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T03:45:00Z'),
      source: { id: 'tucker-carlson', name: 'Tucker Carlson', bias: 'right' },
      category: 'Politics',
      factChecked: false,
      sentiment: 'negative'
    },
    {
      id: '9',
      title: 'Economic Freedom vs. Government Control',
      description: 'Charlie Kirk breaks down the fundamental differences between free market principles and government intervention in the economy.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T02:20:00Z'),
      source: { id: 'charlie-kirk', name: 'Charlie Kirk', bias: 'right' },
      category: 'Economy',
      factChecked: false,
      sentiment: 'neutral'
    },
    {
      id: '10',
      title: 'The Truth About American History',
      description: 'Tucker Carlson explores how American history is being taught in schools and the importance of preserving historical accuracy.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T01:10:00Z'),
      source: { id: 'tucker-carlson', name: 'Tucker Carlson', bias: 'right' },
      category: 'Politics',
      factChecked: false,
      sentiment: 'neutral'
    },
    {
      id: '11',
      title: 'Second Amendment Under Attack: New Legislation Threatens Gun Rights',
      description: 'NRA-ILA reports on proposed legislation that could significantly impact law-abiding gun owners and the constitutional right to bear arms.',
      url: 'https://www.nraila.org/articles/20240115/second-amendment-under-attack-new-legislation-threatens-gun-rights',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-15T00:45:00Z'),
      source: { id: 'nra-ila', name: 'NRA-ILA', bias: 'right' },
      category: 'Gun Rights',
      factChecked: true,
      sentiment: 'negative'
    },
    {
      id: '12',
      title: 'Concealed Carry Reciprocity: A Win for Gun Rights',
      description: 'Gun News Daily celebrates the passage of concealed carry reciprocity legislation, making it easier for law-abiding citizens to protect themselves across state lines.',
      url: 'https://www.gunnewsdaily.com/concealed-carry-reciprocity-win-gun-rights/',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T23:30:00Z'),
      source: { id: 'gun-news', name: 'Gun News Daily', bias: 'right' },
      category: 'Second Amendment',
      factChecked: true,
      sentiment: 'positive'
    },
    {
      id: '13',
      title: 'Self-Defense Success Stories: How Guns Save Lives',
      description: 'AmmoLand News highlights recent cases where law-abiding citizens used firearms to protect themselves and others from violent criminals.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T22:15:00Z'),
      source: { id: 'ammo-land', name: 'AmmoLand News', bias: 'right' },
      category: 'Gun Rights',
      factChecked: true,
      sentiment: 'positive'
    },
    {
      id: '14',
      title: 'Gun Control Advocates Push for New Restrictions',
      description: 'The Gun Grabbers organization calls for stricter background checks and assault weapon bans, citing recent statistics on gun violence.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T21:00:00Z'),
      source: { id: 'the-gun-grabbers', name: 'The Gun Grabbers', bias: 'left' },
      category: 'Gun Rights',
      factChecked: true,
      sentiment: 'negative'
    },
    {
      id: '15',
      title: 'Charlie Kirk: The Real Cost of Gun Control',
      description: 'Charlie Kirk breaks down the economic and constitutional implications of proposed gun control measures, arguing they disproportionately affect law-abiding citizens.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T20:30:00Z'),
      source: { id: 'charlie-kirk', name: 'Charlie Kirk', bias: 'right' },
      category: 'Second Amendment',
      factChecked: false,
      sentiment: 'negative'
    },
    {
      id: '16',
      title: 'Ben Shapiro: The Left\'s War on Free Speech',
      description: 'Ben Shapiro discusses how cancel culture and political correctness are threatening the fundamental right to free expression in America.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T19:15:00Z'),
      source: { id: 'ben-shapiro', name: 'Ben Shapiro', bias: 'right' },
      category: 'Politics',
      factChecked: false,
      sentiment: 'negative'
    },
    {
      id: '17',
      title: 'Jordan Peterson: The Importance of Personal Responsibility',
      description: 'Jordan Peterson explores how individual responsibility and traditional values are essential for a functioning society.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T18:45:00Z'),
      source: { id: 'jordan-peterson', name: 'Jordan Peterson', bias: 'right' },
      category: 'Politics',
      factChecked: false,
      sentiment: 'neutral'
    },
    {
      id: '18',
      title: 'Steven Crowder: Climate Change Facts vs. Hysteria',
      description: 'Steven Crowder presents data-driven analysis questioning mainstream climate change narratives and their policy implications.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=250&fit=crop',
      publishedAt: new Date('2024-01-14T17:30:00Z'),
      source: { id: 'steven-crowder', name: 'Steven Crowder', bias: 'right' },
      category: 'Environment',
      factChecked: false,
      sentiment: 'negative'
    }
  ]

  const categories = ['all', 'Politics', 'Economy', 'Health', 'Environment', 'Technology', 'Science', 'World', 'Gun Rights', 'Second Amendment']
  const sources: NewsSource[] = [
    { id: 'reuters', name: 'Reuters', bias: 'center' },
    { id: 'ap', name: 'Associated Press', bias: 'center' },
    { id: 'bbc', name: 'BBC News', bias: 'center' },
    { id: 'wsj', name: 'Wall Street Journal', bias: 'center' },
    { id: 'cnn', name: 'CNN', bias: 'center' },
    { id: 'npr', name: 'NPR', bias: 'center' },
    { id: 'charlie-kirk', name: 'Charlie Kirk', bias: 'right' },
    { id: 'tucker-carlson', name: 'Tucker Carlson', bias: 'right' },
    { id: 'ben-shapiro', name: 'Ben Shapiro', bias: 'right' },
    { id: 'jordan-peterson', name: 'Jordan Peterson', bias: 'right' },
    { id: 'steven-crowder', name: 'Steven Crowder', bias: 'right' },
    { id: 'fox-news', name: 'Fox News', bias: 'right' },
    { id: 'msnbc', name: 'MSNBC', bias: 'left' },
    { id: 'nytimes', name: 'New York Times', bias: 'left' },
    { id: 'washington-post', name: 'Washington Post', bias: 'left' },
    { id: 'nra-ila', name: 'NRA-ILA', bias: 'right' },
    { id: 'gun-news', name: 'Gun News Daily', bias: 'right' },
    { id: 'ammo-land', name: 'AmmoLand News', bias: 'right' },
    { id: 'the-gun-grabbers', name: 'The Gun Grabbers', bias: 'left' },
    { id: 'gun-violence-archive', name: 'Gun Violence Archive', bias: 'left' }
  ]

  // Load initial articles
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true)
      console.log('Loading articles...')
      
      try {
        // Temporarily use only mock data to ensure articles load
        console.log('Using mock data for reliable loading...')
        setArticles(mockArticles)
        setFilteredArticles(mockArticles)
        
        // Try to fetch real RSS feeds in background
        console.log('Attempting to fetch RSS feeds in background...')
        const rssArticles = await fetchAllFeeds()
        console.log(`RSS articles fetched: ${rssArticles.length}`)
        
        if (rssArticles.length > 0) {
          console.log('RSS articles received:', rssArticles)
          
          // Convert RSS articles to NewsArticle format
          const formattedArticles: NewsArticle[] = rssArticles.map((article, index) => {
            console.log(`Processing article ${index}:`, article)
            return {
              id: `rss-${index}-${Date.now()}`,
              title: article.title || 'No title',
              description: article.description || 'No description',
              url: article.link || '#',
              imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop',
              publishedAt: article.pubDate || new Date(),
              source: article.source || { id: 'unknown', name: 'Unknown Source', bias: 'center' },
              category: article.category || 'General',
              factChecked: false,
              sentiment: 'neutral' as const
            }
          })
          
          console.log('Formatted articles:', formattedArticles)
          
          // Replace with RSS articles if successful
          const allArticles = [...formattedArticles, ...mockArticles.slice(0, 3)]
          console.log(`Total articles loaded: ${allArticles.length}`)
          setArticles(allArticles)
          setFilteredArticles(allArticles)
        }
      } catch (error) {
        console.error('Error loading articles:', error)
        // Fallback to mock data
        console.log('Error occurred, using mock data fallback')
        setArticles(mockArticles)
        setFilteredArticles(mockArticles)
      }
      
      setLastUpdated(new Date())
      setIsLoading(false)
    }
    
    loadArticles()
  }, [])

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshArticles()
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [])

  // Refresh articles function
  const refreshArticles = async () => {
    setIsRefreshing(true)
    try {
      // Fetch real RSS feeds
      const rssArticles = await fetchAllFeeds()
      
      // Convert RSS articles to NewsArticle format
      const formattedArticles: NewsArticle[] = rssArticles.map((article, index) => ({
        id: `rss-${index}-${Date.now()}`,
        title: article.title,
        description: article.description,
        url: article.link,
        imageUrl: article.imageUrl,
        publishedAt: article.pubDate,
        source: article.source,
        category: article.category,
        factChecked: false, // RSS articles aren't pre-fact-checked
        sentiment: 'neutral' // Default sentiment
      }))
      
      // Combine with mock articles for fallback
      const allArticles = [...formattedArticles, ...mockArticles.slice(0, 5)]
      setArticles(allArticles)
      setLastUpdated(new Date())
      analytics.pageView('refresh_articles')
    } catch (error) {
      console.error('Error refreshing articles:', error)
      // Fallback to mock data if RSS fails
      setArticles(mockArticles)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    let filtered = articles

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
      analytics.categoryFilter(selectedCategory)
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter(article => 
        selectedSources.includes(article.source.id)
      )
      analytics.sourceFilter(selectedSources)
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      analytics.search(searchQuery, filtered.length)
    }

    setFilteredArticles(filtered)
  }, [articles, selectedCategory, selectedSources, searchQuery])

  return (
    <div className="min-h-screen bg-midnight text-soft-white">
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-lavender text-charcoal text-center py-2 text-sm font-medium">
          🔄 Fetching latest news from RSS feeds...
        </div>
      )}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 space-y-6">
            <FilterPanel
              categories={categories}
              sources={sources}
              selectedCategory={selectedCategory}
              selectedSources={selectedSources}
              onCategoryChange={setSelectedCategory}
              onSourcesChange={setSelectedSources}
            />
            
            <PersonalizationPanel
              sources={sources}
              preferredSources={preferredSources}
              onPreferredSourcesChange={setPreferredSources}
              biasBalance={biasBalance}
              onBiasBalanceChange={setBiasBalance}
            />
          </div>
          
          <div className="flex-1">
            <NewsGrid 
              articles={filteredArticles} 
              isLoading={isLoading}
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              onRefresh={refreshArticles}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
