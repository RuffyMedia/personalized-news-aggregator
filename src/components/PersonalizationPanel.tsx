'use client'

import { useState } from 'react'
import { User, Star, Settings, TrendingUp } from 'lucide-react'
import { NewsSource } from '@/types/news'

interface PersonalizationPanelProps {
  sources: NewsSource[]
  preferredSources: string[]
  onPreferredSourcesChange: (sources: string[]) => void
  biasBalance: 'balanced' | 'left-leaning' | 'right-leaning' | 'custom'
  onBiasBalanceChange: (balance: 'balanced' | 'left-leaning' | 'right-leaning' | 'custom') => void
}

export default function PersonalizationPanel({
  sources,
  preferredSources,
  onPreferredSourcesChange,
  biasBalance,
  onBiasBalanceChange
}: PersonalizationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSourceToggle = (sourceId: string) => {
    if (preferredSources.includes(sourceId)) {
      onPreferredSourcesChange(preferredSources.filter(id => id !== sourceId))
    } else {
      onPreferredSourcesChange([...preferredSources, sourceId])
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

  const getBiasCount = (bias: string) => {
    return sources.filter(source => source.bias === bias).length
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-lavender text-charcoal rounded-lg hover:bg-mint hover:text-charcoal transition-colors"
      >
        <User className="w-4 h-4" />
        <span>Personalize Feed</span>
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-charcoal rounded-lg shadow-lg border border-slate p-6 z-50">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-5 h-5 text-lavender" />
            <h2 className="text-lg font-semibold text-soft-white">Personalize Your Feed</h2>
          </div>

          {/* Bias Balance */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Political Balance</h3>
            <div className="space-y-2">
              {[
                { value: 'balanced', label: 'Balanced (Equal representation)' },
                { value: 'left-leaning', label: 'Left-leaning (More liberal sources)' },
                { value: 'right-leaning', label: 'Right-leaning (More conservative sources)' },
                { value: 'custom', label: 'Custom (Choose your own mix)' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onBiasBalanceChange(option.value as 'balanced' | 'left-leaning' | 'right-leaning' | 'custom')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    biasBalance === option.value
                      ? 'bg-neutral-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Preferences */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preferred Sources</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSourceToggle(source.id)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      preferredSources.includes(source.id)
                        ? 'bg-neutral-blue border-neutral-blue'
                        : 'border-gray-300'
                    }`}
                  >
                    {preferredSources.includes(source.id) && (
                      <Star className="w-3 h-3 text-white" />
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

          {/* Bias Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Mix</h3>
            <div className="flex space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Left: {getBiasCount('left')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Center: {getBiasCount('center')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Right: {getBiasCount('right')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onPreferredSourcesChange(['charlie-kirk', 'tucker-carlson', 'fox-news'])
                  onBiasBalanceChange('right-leaning')
                }}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Conservative Focus
              </button>
              <button
                onClick={() => {
                  onPreferredSourcesChange(['reuters', 'ap', 'bbc', 'wsj'])
                  onBiasBalanceChange('balanced')
                }}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Balanced Mix
              </button>
            </div>
            <button
              onClick={() => {
                onPreferredSourcesChange(['charlie-kirk', 'tucker-carlson', 'nra-ila', 'gun-news', 'ammo-land', 'fox-news'])
                onBiasBalanceChange('right-leaning')
              }}
              className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              🎯 Pro-Gun & Conservative
            </button>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
