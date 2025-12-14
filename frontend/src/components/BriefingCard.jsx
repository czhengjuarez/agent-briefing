import { useTheme } from '../contexts/ThemeContext'

const BriefingCard = ({ briefing, onView, onEdit, onDelete, onDuplicate }) => {
  const { isDarkMode } = useTheme()
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }
  
  const truncate = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {briefing.title}
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Created {formatDate(briefing.createdAt)}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onDuplicate(briefing)}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            } transition-colors`}
            title="Duplicate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button
            onClick={() => onEdit(briefing)}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            } transition-colors`}
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(briefing)}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400'
                : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
            } transition-colors`}
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Objective Preview */}
      <div className="mb-4">
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {truncate(briefing.objective)}
        </p>
      </div>
      
      {/* Field Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {briefing.context && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            📄 Context
          </span>
        )}
        {briefing.boundaries && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            🚧 Boundaries
          </span>
        )}
        {briefing.escalation && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            ⚠️ Escalation
          </span>
        )}
        {briefing.stakeholders && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            👥 Stakeholders
          </span>
        )}
        {briefing.successCriteria && (
          <span className={`text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            ✅ Success Criteria
          </span>
        )}
      </div>
      
      {/* View Details Button */}
      <button
        onClick={() => onView(briefing)}
        className={`w-full py-2 rounded-lg font-medium ${
          isDarkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } transition-colors`}
      >
        View Details
      </button>
    </div>
  )
}

export default BriefingCard
