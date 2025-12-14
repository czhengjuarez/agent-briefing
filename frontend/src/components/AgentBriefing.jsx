import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useBriefings } from '../hooks/useBriefings'
import BriefingForm from './BriefingForm'
import BriefingList from './BriefingList'
import BriefingDetailsModal from './BriefingDetailsModal'

const AgentBriefing = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [currentView, setCurrentView] = useState('welcome') // 'welcome', 'list', 'form'
  const [editingBriefing, setEditingBriefing] = useState(null)
  const [viewingBriefing, setViewingBriefing] = useState(null)
  const [deletingBriefing, setDeletingBriefing] = useState(null)
  
  // Use API hook instead of localStorage
  const { 
    briefings, 
    loading, 
    error,
    createBriefing, 
    updateBriefing, 
    deleteBriefing: deleteBriefingAPI,
    refreshBriefings 
  } = useBriefings()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-bg' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Agent Briefing Canvas
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Define your delegation clearly
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'welcome' && briefings.length === 0 ? (
          <div className="text-center py-16">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            } mb-4`}>
              <svg className={`w-8 h-8 ${isDarkMode ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome to Agent Briefing
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create clear, structured briefings for AI agents
            </p>
            
            <button
              onClick={() => setCurrentView('form')}
              className="bg-primary hover:bg-opacity-90 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Create New Briefing
            </button>
            
            <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left`}>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-primary bg-opacity-10'} flex items-center justify-center mb-3`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Smart Objective Composer
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI helps refine vague goals into clear, actionable objectives
                </p>
              </div>
              
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-primary bg-opacity-10'} flex items-center justify-center mb-3`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Context Upload
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload PDFs, docs, and files to provide rich context
                </p>
              </div>
              
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className={`w-10 h-10 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-primary bg-opacity-10'} flex items-center justify-center mb-3`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Agent Chaining
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Coming soon: Chain multiple agents into workflows
                </p>
              </div>
            </div>
          </div>
        ) : currentView === 'list' || (currentView === 'welcome' && briefings.length > 0) ? (
          <BriefingList
            briefings={briefings}
            onView={(briefing) => setViewingBriefing(briefing)}
            onEdit={(briefing) => {
              setEditingBriefing(briefing)
              setCurrentView('form')
            }}
            onDelete={(briefing) => setDeletingBriefing(briefing)}
            onDuplicate={async (briefing) => {
              const duplicate = {
                ...briefing,
                id: `briefing-${Date.now()}`,
                title: `${briefing.title} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              await createBriefing(duplicate)
            }}
            onCreateNew={() => {
              setEditingBriefing(null)
              localStorage.removeItem('briefingDraft') // Clear any existing draft
              setCurrentView('form')
            }}
          />
        ) : currentView === 'form' ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingBriefing ? 'Edit Briefing' : 'New Agent Briefing'}
              </h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Define your delegation clearly
              </p>
            </div>
            
            <BriefingForm
              initialData={editingBriefing}
              onCancel={() => {
                setEditingBriefing(null)
                setCurrentView(briefings.length > 0 ? 'list' : 'welcome')
              }}
              onSave={async (briefing) => {
                try {
                  if (editingBriefing) {
                    // Update existing
                    await updateBriefing(briefing.id, briefing)
                  } else {
                    // Add new
                    await createBriefing(briefing)
                  }
                  setEditingBriefing(null)
                  setCurrentView('list')
                } catch (err) {
                  console.error('Error saving briefing:', err)
                  alert('Failed to save briefing. Please try again.')
                }
              }}
            />
          </div>
        ) : null}
      </main>
      
      {/* Modals */}
      {viewingBriefing && (
        <BriefingDetailsModal
          briefing={viewingBriefing}
          onClose={() => setViewingBriefing(null)}
          onEdit={(briefing) => {
            setEditingBriefing(briefing)
            setViewingBriefing(null)
            setCurrentView('form')
          }}
        />
      )}
      
      {deletingBriefing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}>
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Briefing?
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you sure you want to delete "{deletingBriefing.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingBriefing(null)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteBriefingAPI(deletingBriefing.id)
                    setDeletingBriefing(null)
                    // Clear any draft that might be saved
                    localStorage.removeItem('briefingDraft')
                    if (briefings.length === 1) {
                      setCurrentView('welcome')
                    }
                  } catch (err) {
                    console.error('Error deleting briefing:', err)
                    alert('Failed to delete briefing. Please try again.')
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentBriefing
