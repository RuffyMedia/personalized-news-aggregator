import { track } from '@vercel/analytics'

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    track(event, properties)
  }
}

// Predefined events for common actions
export const analytics = {
  // Article interactions
  articleClick: (articleId: string, source: string, category: string) => {
    trackEvent('article_click', {
      article_id: articleId,
      source,
      category
    })
  },
  
  articleBookmark: (articleId: string, action: 'add' | 'remove') => {
    trackEvent('article_bookmark', {
      article_id: articleId,
      action
    })
  },
  
  articleShare: (articleId: string, platform: string) => {
    trackEvent('article_share', {
      article_id: articleId,
      platform
    })
  },
  
  // Search and filtering
  search: (query: string, resultsCount: number) => {
    trackEvent('search', {
      query,
      results_count: resultsCount
    })
  },
  
  categoryFilter: (category: string) => {
    trackEvent('category_filter', {
      category
    })
  },
  
  sourceFilter: (sources: string[]) => {
    trackEvent('source_filter', {
      sources: sources.join(',')
    })
  },
  
  // Personalization
  personalizeFeed: (biasBalance: string, preferredSources: string[]) => {
    trackEvent('personalize_feed', {
      bias_balance: biasBalance,
      preferred_sources: preferredSources.join(',')
    })
  },
  
  // Theme
  themeToggle: (theme: 'light' | 'dark') => {
    trackEvent('theme_toggle', {
      theme
    })
  },
  
  // Page views
  pageView: (page: string) => {
    trackEvent('page_view', {
      page
    })
  }
}

