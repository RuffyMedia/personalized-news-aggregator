'use client'

import { Filter, CheckCircle } from 'lucide-react'
import { NewsSource } from '@/types/news'

interface FilterPanelProps {
  categories: string[]
  sources: NewsSource[]
  selectedCategory: string
  selectedSources: string[]
  onCategoryChange: (category: string) => void
  onSourcesChange: (sources: string[]) => void
}

export default function FilterPanel({
  categories,
  sources,
  selectedCategory,
  selectedSources,
  onCategoryChange,
  onSourcesChange
}: FilterPanelProps) {
  const handleSourceToggle = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      onSourcesChange(selectedSources.filter(id => id !== sourceId))
    } else {
      onSourcesChange([...selectedSources, sourceId])
    }
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-neon-blue bg-opacity-20 text-neon-blue'
      case 'center': return 'bg-mint bg-opacity-20 text-mint'
      case 'right': return 'bg-coral bg-opacity-20 text-coral'
      default: return 'bg-moonlight bg-opacity-20 text-moonlight'
    }
  }

  return (
    <div className="w-full bg-charcoal rounded-lg shadow-lg border border-slate p-6 h-fit">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-lavender" />
        <h2 className="text-lg font-semibold text-soft-white">Filters</h2>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-moonlight mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-lavender text-charcoal'
                  : 'text-moonlight hover:bg-slate'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-moonlight mb-3">News Sources</h3>
        <div className="space-y-2">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center space-x-3">
              <button
                onClick={() => handleSourceToggle(source.id)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedSources.includes(source.id)
                    ? 'bg-lavender border-lavender'
                    : 'border-slate'
                }`}
              >
                {selectedSources.includes(source.id) && (
                  <CheckCircle className="w-3 h-3 text-charcoal" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-soft-white">
                    {source.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getBiasColor(source.bias)}`}>
                    {source.bias}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fact Check Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quality</h3>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">Fact-checked articles only</span>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          onCategoryChange('all')
          onSourcesChange([])
        }}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  )
}
