'use client'

import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, Clock, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { NewsArticle } from '@/types/news'
import BookmarkButton from './BookmarkButton'

interface NewsGridProps {
  articles: NewsArticle[]
  isLoading: boolean
}

export default function NewsGrid({ articles, isLoading }: NewsGridProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="news-card p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more news.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Latest News ({articles.length} articles)
        </h2>
        <div className="text-sm text-gray-600">
          Updated {formatDistanceToNow(new Date())} ago
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <article key={article.id} className="news-card p-6">
            <div className="flex space-x-4">
              <div className="w-32 h-24 flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <BookmarkButton articleId={article.id} />
                    {article.factChecked && (
                      <div title="Fact-checked">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    {getSentimentIcon(article.sentiment)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="source-badge bg-gray-100 text-gray-700">
                      {article.source.name}
                    </span>
                    <span className="category-tag bg-neutral-blue text-white">
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(article.publishedAt)} ago</span>
                    </div>
                  </div>
                  
                  <a
                    href={article.url}
                    className="flex items-center space-x-1 text-neutral-blue hover:text-neutral-purple transition-colors"
                  >
                    <span className="text-sm font-medium">Read more</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
