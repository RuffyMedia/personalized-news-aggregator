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

export async function fetchRSSFeed(feedUrl: string): Promise<any[]> {
  try {
    // In a real app, you'd need a CORS proxy or backend service
    // For now, we'll return mock data that simulates RSS content
    const mockRSSData = [
      {
        title: 'Breaking: Major Political Development',
        description: 'Latest updates on current political events affecting the nation.',
        link: '#',
        pubDate: new Date().toISOString(),
        category: 'Politics'
      },
      {
        title: 'Second Amendment Rights Under Review',
        description: 'New legislation proposed that could impact gun ownership rights.',
        link: '#',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        category: 'Gun Rights'
      },
      {
        title: 'Economic Indicators Show Mixed Signals',
        description: 'Latest economic data presents complex picture of recovery.',
        link: '#',
        pubDate: new Date(Date.now() - 7200000).toISOString(),
        category: 'Economy'
      }
    ]
    
    return mockRSSData
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return []
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
