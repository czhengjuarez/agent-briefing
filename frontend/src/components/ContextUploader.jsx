import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ContextUploader = ({ files, onFilesChange, onFilesProcessed }) => {
  const { isDarkMode } = useTheme()
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const MAX_FILES = 5
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json',
    'text/javascript',
    'text/x-python',
    'text/x-java-source',
    'text/html',
    'text/css'
  ]
  
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('text') || type.includes('plain')) return '📃'
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊'
    if (type.includes('json') || type.includes('javascript') || type.includes('python') || type.includes('java')) return '💻'
    return '📎'
  }
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
  
  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`
    }
    
    // Allow common text-based files even if MIME type is generic
    const extension = file.name.split('.').pop().toLowerCase()
    const textExtensions = ['txt', 'md', 'json', 'js', 'py', 'java', 'html', 'css', 'csv', 'xml', 'yaml', 'yml']
    
    if (!ALLOWED_TYPES.includes(file.type) && !textExtensions.includes(extension)) {
      return `File type "${file.type || 'unknown'}" is not supported. Please upload PDF, DOC, TXT, or code files.`
    }
    
    return null
  }
  
  const processFile = async (file) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'
    
    try {
      // Upload file to server for processing
      const formData = new FormData()
      formData.append('file', file)
      formData.append('summarize', 'true') // Request AI summarization
      
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload file')
      }
      
      const data = await response.json()
      
      return {
        id: data.file.id,
        name: data.file.name,
        type: data.file.type,
        size: data.file.size,
        r2Key: data.file.r2Key,
        preview: data.file.preview || data.file.summary || `File: ${data.file.name}`,
        summary: data.file.summary,
        uploadedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('File upload error:', error)
      // Fallback to client-side processing
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: `File: ${file.name} (upload failed, saved locally)`,
        uploadedAt: new Date().toISOString()
      }
    }
  }
  
  const handleFiles = async (fileList) => {
    setError(null)
    
    const newFiles = Array.from(fileList)
    
    // Check total file count
    if (files.length + newFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed. You have ${files.length} files already.`)
      return
    }
    
    // Validate all files
    for (const file of newFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }
    
    setUploading(true)
    
    try {
      const processedFiles = []
      
      for (const file of newFiles) {
        const processed = await processFile(file)
        if (processed) {
          processedFiles.push(processed)
        }
      }
      
      const updatedFiles = [...files, ...processedFiles]
      onFilesChange(updatedFiles)
      
      // Notify parent about processed files for context generation
      if (onFilesProcessed) {
        onFilesProcessed(processedFiles)
      }
    } catch (err) {
      setError('Failed to process files. Please try again.')
      console.error('File processing error:', err)
    } finally {
      setUploading(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }
  
  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    onFilesChange(updatedFiles)
  }
  
  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? isDarkMode
              ? 'border-secondary bg-secondary/10'
              : 'border-primary bg-primary/10'
            : isDarkMode
            ? 'border-gray-600 hover:border-gray-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.json,.js,.py,.java,.html,.css"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || files.length >= MAX_FILES}
        />
        
        <div className="pointer-events-none">
          <svg
            className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing files...
              </span>
            ) : files.length >= MAX_FILES ? (
              <span className="text-yellow-600 dark:text-yellow-500">Maximum {MAX_FILES} files reached</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            TXT, MD, CSV, Code files get full content extraction. PDF/DOC show file info. (max 10MB each, {MAX_FILES} files total)
          </p>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Uploaded Files ({files.length}/{MAX_FILES})
          </p>
          
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {file.name}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className={`ml-3 p-1 rounded-lg flex-shrink-0 ${
                  isDarkMode
                    ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400'
                    : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                } transition-colors`}
                title="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContextUploader
