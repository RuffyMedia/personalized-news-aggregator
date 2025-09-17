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
      case 'left': return 'bg-blue-100 text-blue-800'
      case 'center': return 'bg-green-100 text-green-800'
      case 'right': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-fit">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-neutral-blue" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-neutral-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">News Sources</h3>
        <div className="space-y-2">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center space-x-3">
              <button
                onClick={() => handleSourceToggle(source.id)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedSources.includes(source.id)
                    ? 'bg-neutral-blue border-neutral-blue'
                    : 'border-gray-300'
                }`}
              >
                {selectedSources.includes(source.id) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
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
