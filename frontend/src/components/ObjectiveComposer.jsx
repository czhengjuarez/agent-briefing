import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ObjectiveComposer = ({ value, onChange, error }) => {
  const { isDarkMode } = useTheme()
  const [showAI, setShowAI] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'
  
  // Get clarifying questions from AI
  const handleRefineClick = async () => {
    if (!value || value.trim().length === 0) {
      setAiError('Please enter an initial objective first')
      return
    }
    
    setLoading(true)
    setAiError(null)
    
    try {
      const response = await fetch(`${API_URL}/api/ai/refine-objective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: value })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get clarifying questions')
      }
      
      const data = await response.json()
      setQuestions(data.questions || [])
      setAnswers({})
      setShowAI(true)
    } catch (err) {
      console.error('AI error:', err)
      setAiError(err.message || 'Failed to connect to AI service. Make sure the worker is running.')
    } finally {
      setLoading(false)
    }
  }
  
  // Generate refined objective from answers
  const handleGenerateRefined = async () => {
    setLoading(true)
    setAiError(null)
    
    try {
      const response = await fetch(`${API_URL}/api/ai/refine-objective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          objective: value,
          answers 
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to refine objective')
      }
      
      const data = await response.json()
      onChange(data.refined)
      setShowAI(false)
      setQuestions([])
      setAnswers({})
    } catch (err) {
      console.error('AI error:', err)
      setAiError(err.message || 'Failed to refine objective')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({ ...prev, [question]: answer }))
  }
  
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => answers[q] && answers[q].trim().length > 0)
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          OBJECTIVE *
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {value.length} characters
          </span>
          {!showAI && value.length > 5 && (
            <button
              type="button"
              onClick={handleRefineClick}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                isDarkMode
                  ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              } transition-colors disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Refining...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>AI Refine</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
        What you're trying to achieve and why
      </p>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your goal clearly and specifically..."
        rows={4}
        disabled={showAI}
        className={`w-full px-4 py-3 rounded-lg border ${
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : isDarkMode
            ? 'border-gray-600 bg-gray-700 text-white'
            : 'border-gray-300 bg-white text-gray-900'
        } focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none disabled:opacity-50`}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {aiError && (
        <div className={`mt-2 p-3 rounded-lg ${
          isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
        </div>
      )}
      
      {/* AI Refinement Panel */}
      {showAI && questions.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg border-2 ${
          isDarkMode 
            ? 'bg-gray-700/50 border-secondary/30' 
            : 'bg-primary/5 border-primary/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Goal Refiner
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAI(false)
                setQuestions([])
                setAnswers({})
              }}
              className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cancel
            </button>
          </div>
          
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Answer these questions to create a more specific objective:
          </p>
          
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index}>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {question}
                </label>
                <input
                  type="text"
                  value={answers[question] || ''}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  placeholder="Your answer..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-500'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleGenerateRefined}
            disabled={!allQuestionsAnswered || loading}
            className={`mt-4 w-full py-2 rounded-lg font-medium ${
              isDarkMode
                ? 'bg-secondary text-white hover:bg-secondary/90'
                : 'bg-primary text-white hover:bg-primary/90'
            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Refined Objective</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ObjectiveComposer
