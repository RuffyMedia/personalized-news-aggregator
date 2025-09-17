import Parser from 'rss-parser'

export interface RSSFeed {
  id: string
  name: string
  url: string
  bias: 'left' | 'center' | 'right'
  category: string
}

export const RSS_FEEDS: RSSFeed[] = [
  // Conservative Sources
  {
    id: 'fox-news-rss',
    name: 'Fox News',
    url: 'https://feeds.foxnews.com/foxnews/latest',
    bias: 'right',
    category: 'Politics'
  },
  {
    id: 'daily-wire-rss',
    name: 'The Daily Wire',
    url: 'https://www.dailywire.com/feeds/rss.xml',
    bias: 'right',
    category: 'Politics'
  },
  {
    id: 'breitbart-rss',
    name: 'Breitbart',
    url: 'https://feeds.feedburner.com/breitbart',
    bias: 'right',
    category: 'Politics'
  },
  // Gun Rights Sources
  {
    id: 'nra-ila-rss',
    name: 'NRA-ILA',
    url: 'https://www.nraila.org/feed/',
    bias: 'right',
    category: 'Gun Rights'
  },
  {
    id: 'ammo-land-rss',
    name: 'AmmoLand News',
    url: 'https://www.ammoland.com/feed/',
    bias: 'right',
    category: 'Gun Rights'
  },
  // Center Sources
  {
    id: 'reuters-rss',
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/topNews',
    bias: 'center',
    category: 'World'
  },
  {
    id: 'ap-rss',
    name: 'Associated Press',
    url: 'https://feeds.apnews.com/rss/ap/topnews',
    bias: 'center',
    category: 'World'
  },
  // Left Sources
  {
    id: 'cnn-rss',
    name: 'CNN',
    url: 'http://rss.cnn.com/rss/edition.rss',
    bias: 'left',
    category: 'Politics'
  },
  {
    id: 'msnbc-rss',
    name: 'MSNBC',
    url: 'https://feeds.nbcnews.com/nbcnews/public/news',
    bias: 'left',
    category: 'Politics'
  }
]

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
})

export async function fetchRSSFeed(feedUrl: string): Promise<any[]> {
  try {
    // Use CORS proxy for client-side RSS parsing
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.contents) {
      const feed = await parser.parseString(data.contents)
      return feed.items.slice(0, 5).map((item: any) => ({
        title: item.title || 'No title',
        description: item.contentSnippet || item.description || 'No description',
        link: item.link || '#',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        category: item.categories?.[0] || 'General',
        imageUrl: item.enclosure?.url || item['media:content']?.['$']?.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    // Return fallback mock data if RSS fails
    return [
      {
        title: 'RSS Feed Temporarily Unavailable',
        description: 'This feed is currently being updated. Please check back later.',
        link: '#',
        pubDate: new Date(),
        category: 'General',
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'
      }
    ]
  }
}

export async function fetchAllFeeds(): Promise<any[]> {
  const allArticles = []
  
  for (const feed of RSS_FEEDS) {
    try {
      const articles = await fetchRSSFeed(feed.url)
      const articlesWithSource = articles.map(article => ({
        ...article,
        source: {
          id: feed.id,
          name: feed.name,
          bias: feed.bias
        }
      }))
      allArticles.push(...articlesWithSource)
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error)
    }
  }
  
  return allArticles
}
