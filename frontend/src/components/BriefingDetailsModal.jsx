import { useTheme } from '../contexts/ThemeContext'

const BriefingDetailsModal = ({ briefing, onClose, onEdit }) => {
  const { isDarkMode } = useTheme()
  
  if (!briefing) return null
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } p-6 flex items-start justify-between`}>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {briefing.title}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Created {formatDate(briefing.createdAt)}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            } transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Objective */}
          <div>
            <h3 className={`text-xs font-semibold uppercase mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Objective
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
              {briefing.objective}
            </p>
          </div>
          
          {/* Context */}
          <div>
            <h3 className={`text-xs font-semibold uppercase mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Context
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
              {briefing.context}
            </p>
            
            {/* Show uploaded files */}
            {briefing.contextFiles && briefing.contextFiles.length > 0 && (
              <div className="mt-3">
                <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  📎 Attached Files ({briefing.contextFiles.length})
                </p>
                <div className="space-y-2">
                  {briefing.contextFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <span>📄</span>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {file.name}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Boundaries */}
          <div>
            <h3 className={`text-xs font-semibold uppercase mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Boundaries
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
              {briefing.boundaries}
            </p>
          </div>
          
          {/* Escalation */}
          <div>
            <h3 className={`text-xs font-semibold uppercase mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Escalation
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
              {briefing.escalation}
            </p>
          </div>
          
          {/* Stakeholders */}
          {briefing.stakeholders && (
            <div>
              <h3 className={`text-xs font-semibold uppercase mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Stakeholders
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                {briefing.stakeholders}
              </p>
            </div>
          )}
          
          {/* Success Criteria */}
          <div>
            <h3 className={`text-xs font-semibold uppercase mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Success Criteria
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
              {briefing.successCriteria}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`sticky bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } p-6 flex items-center justify-between`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Close
          </button>
          
          <button
            onClick={() => {
              onEdit(briefing)
              onClose()
            }}
            className="bg-primary hover:bg-opacity-90 text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Edit Briefing
          </button>
        </div>
      </div>
    </div>
  )
}

export default BriefingDetailsModal
