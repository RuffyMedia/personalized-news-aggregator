import { Newspaper, Search, Settings } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-charcoal shadow-lg border-b border-slate">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Newspaper className="w-8 h-8 text-lavender" />
            <div>
              <h1 className="text-2xl font-bold text-soft-white">Personalized News</h1>
              <p className="text-sm text-moonlight">Your curated feed with diverse perspectives</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-moonlight" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-darker-card border border-slate rounded-lg text-soft-white placeholder-moonlight focus:ring-2 focus:ring-lavender focus:border-transparent"
              />
            </div>
            
            <DarkModeToggle />
            
            <button className="p-2 text-moonlight hover:text-soft-white hover:bg-slate rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
