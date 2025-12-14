import AgentBriefing from './components/AgentBriefing'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AgentBriefing />
    </ThemeProvider>
  )
}

export default App
