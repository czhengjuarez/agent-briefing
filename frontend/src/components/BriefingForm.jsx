import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import ObjectiveComposer from './ObjectiveComposer'
import ContextUploader from './ContextUploader'

const BriefingForm = ({ initialData, onCancel, onSave }) => {
  const { isDarkMode } = useTheme()
  
  // Form state
  const [formData, setFormData] = useState(initialData || {
    title: '',
    objective: '',
    context: '',
    boundaries: '',
    escalation: '',
    stakeholders: '',
    successCriteria: ''
  })
  
  const [contextFiles, setContextFiles] = useState(initialData?.contextFiles || [])
  
  // Update contextFiles when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData?.contextFiles) {
      setContextFiles(initialData.contextFiles)
    }
  }, [initialData])
  
  const [errors, setErrors] = useState({})
  const [isDirty, setIsDirty] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  
  // Auto-save to localStorage (only for new briefings, not edits)
  useEffect(() => {
    if (!initialData) {
      const draft = localStorage.getItem('briefingDraft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setFormData(parsed)
        } catch (e) {
          console.error('Failed to load draft:', e)
        }
      }
    }
  }, [initialData])
  
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem('briefingDraft', JSON.stringify(formData))
    }
  }, [formData, isDirty])
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  // Validate form
  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.objective.trim()) {
      newErrors.objective = 'Objective is required'
    }
    
    if (!formData.context.trim()) {
      newErrors.context = 'Context is required'
    }
    
    if (!formData.boundaries.trim()) {
      newErrors.boundaries = 'Boundaries are required'
    }
    
    if (!formData.escalation.trim()) {
      newErrors.escalation = 'Escalation criteria are required'
    }
    
    if (!formData.successCriteria.trim()) {
      newErrors.successCriteria = 'Success criteria are required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      const briefing = initialData ? {
        ...formData,
        contextFiles,
        updatedAt: new Date().toISOString()
      } : {
        ...formData,
        contextFiles,
        id: `briefing-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      onSave(briefing)
      if (!initialData) {
        localStorage.removeItem('briefingDraft')
      }
      setIsDirty(false)
    }
  }
  
  // Generate context summary from files
  const handleFilesProcessed = (newFiles) => {
    const filesSummary = newFiles.map(f => {
      return `\n\n[File: ${f.name}]\n${f.preview}`
    }).join('')
    
    // Append file summaries to context
    if (filesSummary) {
      const currentContext = formData.context
      const separator = currentContext ? '\n\n---\n\nUploaded Files:' : 'Uploaded Files:'
      handleChange('context', currentContext + separator + filesSummary)
    }
  }
  
  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (isDirty) {
      setShowUnsavedWarning(true)
    } else {
      onCancel()
    }
  }
  
  const confirmCancel = () => {
    localStorage.removeItem('briefingDraft')
    setShowUnsavedWarning(false)
    onCancel()
  }
  
  // Character count helper
  const getCharCount = (text) => text.length
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Briefing Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Blog Post - Cloudflare Workers"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.title
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        {/* Objective Field with AI Composer */}
        <ObjectiveComposer
          value={formData.objective}
          onChange={(value) => handleChange('objective', value)}
          error={errors.objective}
        />
        
        {/* Context Field with File Upload */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              CONTEXT *
            </label>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {getCharCount(formData.context)} characters
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            Environment, constraints, organizational history
          </p>
          <textarea
            value={formData.context}
            onChange={(e) => handleChange('context', e.target.value)}
            placeholder="Provide relevant background information, constraints, and context..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.context
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
          />
          {errors.context && (
            <p className="mt-1 text-sm text-red-500">{errors.context}</p>
          )}
          
          {/* File Upload Section */}
          <div className="mt-4">
            <p className={`text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              📎 Upload Context Files (Optional)
            </p>
            <ContextUploader
              files={contextFiles}
              onFilesChange={setContextFiles}
              onFilesProcessed={handleFilesProcessed}
            />
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>
              Upload PDFs, documents, code files, or reports to provide additional context. File content will be automatically added to the context field.
            </p>
          </div>
        </div>
        
        {/* Boundaries Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              BOUNDARIES *
            </label>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {getCharCount(formData.boundaries)} characters
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            What the agent can cannot do
          </p>
          <textarea
            value={formData.boundaries}
            onChange={(e) => handleChange('boundaries', e.target.value)}
            placeholder="Define clear boundaries and limitations..."
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.boundaries
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
          />
          {errors.boundaries && (
            <p className="mt-1 text-sm text-red-500">{errors.boundaries}</p>
          )}
        </div>
        
        {/* Escalation Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              ESCALATION *
            </label>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {getCharCount(formData.escalation)} characters
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            When to stop and ask for guidance
          </p>
          <textarea
            value={formData.escalation}
            onChange={(e) => handleChange('escalation', e.target.value)}
            placeholder="Specify when the agent should escalate to you..."
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.escalation
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
          />
          {errors.escalation && (
            <p className="mt-1 text-sm text-red-500">{errors.escalation}</p>
          )}
        </div>
        
        {/* Stakeholders Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              STAKEHOLDERS
            </label>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {getCharCount(formData.stakeholders)} characters
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            Who needs to know or approve
          </p>
          <textarea
            value={formData.stakeholders}
            onChange={(e) => handleChange('stakeholders', e.target.value)}
            placeholder="List relevant stakeholders (optional)..."
            rows={2}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
          />
        </div>
        
        {/* Success Criteria Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              SUCCESS CRITERIA *
            </label>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {getCharCount(formData.successCriteria)} characters
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            How you'll know it worked
          </p>
          <textarea
            value={formData.successCriteria}
            onChange={(e) => handleChange('successCriteria', e.target.value)}
            placeholder="Define measurable success criteria..."
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.successCriteria
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
          />
          {errors.successCriteria && (
            <p className="mt-1 text-sm text-red-500">{errors.successCriteria}</p>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className={`px-6 py-2 rounded-lg font-medium ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Draft auto-saved
              </span>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-opacity-90 text-white font-semibold px-8 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Brief Agent
            </button>
          </div>
        </div>
      </form>
      
      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Unsaved Changes
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You have unsaved changes. Are you sure you want to leave? Your draft will be lost.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Keep Editing
              </button>
              <button
                onClick={confirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BriefingForm
