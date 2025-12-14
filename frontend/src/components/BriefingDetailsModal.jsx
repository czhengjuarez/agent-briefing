import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const BriefingDetailsModal = ({ briefing, onClose, onEdit }) => {
  const { isDarkMode } = useTheme()
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState(null)
  
  if (!briefing) return null
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }
  
  // Generate briefing text for copying
  const generateBriefingText = () => {
    let text = `# ${briefing.title}\n\n`
    text += `**Created:** ${formatDate(briefing.createdAt)}\n\n`
    text += `## OBJECTIVE\n${briefing.objective}\n\n`
    text += `## CONTEXT\n${briefing.context}\n\n`
    text += `## BOUNDARIES\n${briefing.boundaries}\n\n`
    text += `## ESCALATION\n${briefing.escalation}\n\n`
    if (briefing.stakeholders) {
      text += `## STAKEHOLDERS\n${briefing.stakeholders}\n\n`
    }
    text += `## SUCCESS CRITERIA\n${briefing.successCriteria}\n\n`
    
    if (briefing.contextFiles && briefing.contextFiles.length > 0) {
      text += `## ATTACHED FILES\n`
      briefing.contextFiles.forEach(file => {
        text += `- ${file.name} (${(file.size / 1024).toFixed(1)} KB)\n`
      })
    }
    
    return text
  }
  
  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateBriefingText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  // Export as Markdown
  const handleExportMarkdown = () => {
    const text = generateBriefingText()
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${briefing.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportFormat('markdown')
    setTimeout(() => setExportFormat(null), 2000)
  }
  
  // Export as JSON
  const handleExportJSON = () => {
    const json = JSON.stringify(briefing, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${briefing.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportFormat('json')
    setTimeout(() => setExportFormat(null), 2000)
  }
  
  // Export as plain text
  const handleExportText = () => {
    const text = generateBriefingText()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${briefing.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportFormat('text')
    setTimeout(() => setExportFormat(null), 2000)
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
        } p-6`}>
          <div className="flex items-start justify-between mb-4">
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
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                copied
                  ? isDarkMode
                    ? 'bg-green-900/20 text-green-400 border border-green-800'
                    : 'bg-green-50 text-green-600 border border-green-200'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              } transition-colors`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
            
            {/* Export Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                } transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={handleExportMarkdown}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    exportFormat === 'markdown'
                      ? isDarkMode
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-green-50 text-green-600'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  } rounded-t-lg transition-colors`}
                >
                  <span>📝</span>
                  <span>Markdown (.md)</span>
                  {exportFormat === 'markdown' && <span className="ml-auto">✓</span>}
                </button>
                <button
                  onClick={handleExportJSON}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    exportFormat === 'json'
                      ? isDarkMode
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-green-50 text-green-600'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <span>💻</span>
                  <span>JSON (.json)</span>
                  {exportFormat === 'json' && <span className="ml-auto">✓</span>}
                </button>
                <button
                  onClick={handleExportText}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    exportFormat === 'text'
                      ? isDarkMode
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-green-50 text-green-600'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  } rounded-b-lg transition-colors`}
                >
                  <span>📄</span>
                  <span>Plain Text (.txt)</span>
                  {exportFormat === 'text' && <span className="ml-auto">✓</span>}
                </button>
              </div>
            </div>
          </div>
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
