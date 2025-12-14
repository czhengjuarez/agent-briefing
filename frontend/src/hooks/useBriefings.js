import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const useBriefings = () => {
  const [briefings, setBriefings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all briefings
  const fetchBriefings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/briefings`)
      if (!response.ok) throw new Error('Failed to fetch briefings')
      const data = await response.json()
      setBriefings(data.briefings || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching briefings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create briefing
  const createBriefing = async (briefingData) => {
    try {
      const response = await fetch(`${API_URL}/api/briefings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefingData)
      })
      if (!response.ok) throw new Error('Failed to create briefing')
      const data = await response.json()
      await fetchBriefings() // Refresh list
      return data
    } catch (err) {
      console.error('Error creating briefing:', err)
      throw err
    }
  }

  // Update briefing
  const updateBriefing = async (id, briefingData) => {
    try {
      const response = await fetch(`${API_URL}/api/briefings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefingData)
      })
      if (!response.ok) throw new Error('Failed to update briefing')
      await fetchBriefings() // Refresh list
    } catch (err) {
      console.error('Error updating briefing:', err)
      throw err
    }
  }

  // Delete briefing
  const deleteBriefing = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/briefings/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete briefing')
      await fetchBriefings() // Refresh list
    } catch (err) {
      console.error('Error deleting briefing:', err)
      throw err
    }
  }

  // Get single briefing
  const getBriefing = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/briefings/${id}`)
      if (!response.ok) throw new Error('Failed to fetch briefing')
      const data = await response.json()
      return data.briefing
    } catch (err) {
      console.error('Error fetching briefing:', err)
      throw err
    }
  }

  // Load briefings on mount
  useEffect(() => {
    fetchBriefings()
  }, [])

  return {
    briefings,
    loading,
    error,
    createBriefing,
    updateBriefing,
    deleteBriefing,
    getBriefing,
    refreshBriefings: fetchBriefings
  }
}
