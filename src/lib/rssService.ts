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
    console.log(`Fetching RSS feed: ${feedUrl}`)
    
    // Try multiple CORS proxies
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
      `https://cors-anywhere.herokuapp.com/${feedUrl}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
    ]
    
    let lastError = null
    
    for (const proxyUrl of proxies) {
      try {
        console.log(`Trying proxy: ${proxyUrl}`)
        const response = await fetch(proxyUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        const content = data.contents || data.content || data
        
        if (content) {
          const feed = await parser.parseString(content)
          console.log(`Successfully parsed feed with ${feed.items?.length || 0} items`)
          
          return (feed.items || []).slice(0, 5).map((item: any) => {
            // Clean the item data to remove problematic keys
            const cleanItem = JSON.parse(JSON.stringify(item, (key, value) => {
              // Remove keys that cause React errors
              if (key === '_' || key === '$') {
                return undefined
              }
              return value
            }))
            
            return {
              title: cleanItem.title || 'No title',
              description: cleanItem.contentSnippet || cleanItem.description || 'No description',
              link: cleanItem.link || '#',
              pubDate: cleanItem.pubDate ? new Date(cleanItem.pubDate) : new Date(),
              category: cleanItem.categories?.[0] || 'General',
              imageUrl: cleanItem.enclosure?.url || cleanItem['media:content']?.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'
            }
          })
        }
      } catch (proxyError) {
        console.error(`Proxy failed: ${proxyError}`)
        lastError = proxyError
        continue
      }
    }
    
    throw lastError || new Error('All proxies failed')
    
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
  
  // Try to fetch from a few reliable feeds first
  const reliableFeeds = RSS_FEEDS.slice(0, 3) // Start with first 3 feeds
  
  for (const feed of reliableFeeds) {
    try {
      console.log(`Fetching from ${feed.name}...`)
      const articles = await fetchRSSFeed(feed.url)
      
      if (articles.length > 0) {
        const articlesWithSource = articles.map(article => ({
          ...article,
          source: {
            id: feed.id,
            name: feed.name,
            bias: feed.bias
          }
        }))
        allArticles.push(...articlesWithSource)
        console.log(`Successfully fetched ${articles.length} articles from ${feed.name}`)
      }
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error)
    }
  }
  
  // If we got some articles, return them. Otherwise, return empty array to trigger fallback
  if (allArticles.length > 0) {
    console.log(`Total RSS articles fetched: ${allArticles.length}`)
    return allArticles
  } else {
    console.log('No RSS articles fetched, will use mock data')
    return []
  }
}
