'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface BookmarkButtonProps {
  articleId: string
  className?: string
}

export default function BookmarkButton({ articleId, className = '' }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // Check if article is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(articleId))
  }, [articleId])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((id: string) => id !== articleId)
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setIsBookmarked(false)
    } else {
      const newBookmarks = [...bookmarks, articleId]
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setIsBookmarked(true)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ${className}`}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-yellow-500" />
      ) : (
        <Bookmark className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
      )}
    </button>
  )
}
