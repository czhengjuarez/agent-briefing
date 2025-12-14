import { useTheme } from '../contexts/ThemeContext'
import BriefingCard from './BriefingCard'

const BriefingList = ({ briefings, onView, onEdit, onDelete, onDuplicate, onCreateNew }) => {
  const { isDarkMode } = useTheme()
  
  if (briefings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        } mb-4`}>
          <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          No briefings yet
        </h3>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Create your first agent briefing to get started
        </p>
        
        <button
          onClick={onCreateNew}
          className="bg-primary hover:bg-opacity-90 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          Create New Briefing
        </button>
      </div>
    )
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Briefings
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {briefings.length} briefing{briefings.length !== 1 ? 's' : ''} total
          </p>
        </div>
        
        <button
          onClick={onCreateNew}
          className="bg-primary hover:bg-opacity-90 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          + New Briefing
        </button>
      </div>
      
      {/* Briefing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefings.map((briefing) => (
          <BriefingCard
            key={briefing.id}
            briefing={briefing}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </div>
  )
}

export default BriefingList
