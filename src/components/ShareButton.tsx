'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Link, Copy } from 'lucide-react'

interface ShareButtonProps {
  article: {
    title: string
    description: string
    url: string
  }
  className?: string
}

export default function ShareButton({ article, className = '' }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + article.url : article.url
  const shareText = `${article.title} - ${article.description}`
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing: ', err)
      }
    } else {
      setShowMenu(true)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={shareNative}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Share article"
      >
        <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2 z-50">
          <div className="space-y-1">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>Twitter</span>
            </a>
            
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </a>
            
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span>LinkedIn</span>
            </a>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded w-full"
            >
              {copied ? (
                <>
                  <Copy className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 text-gray-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          
          <button
            onClick={() => setShowMenu(false)}
            className="w-full mt-2 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
