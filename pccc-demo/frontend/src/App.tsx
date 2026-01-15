import './index.css'
import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { InputView } from './components/features/InputView'
import { ReportView } from './components/features/ReportView'
import { ComplianceCheckView } from './components/features/ComplianceCheckView'
import { RegulationsView } from './components/features/RegulationsView'
import { useCompliance } from './hooks/useCompliance'

function App() {
  const [currentView, setCurrentView] = useState('input')
  const { data: reportData, analyze, isLoading, error, reset } = useCompliance()

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleInputSubmit = async (description: string) => {
    const result = await analyze({ description })
    if (result) {
      setCurrentView('report-escape') // Navigate to first tab after analysis
    }
  }

  const handleNewAnalysis = () => {
    reset()
    setCurrentView('input')
  }

  const renderContent = () => {
    if (currentView === 'input') {
      return (
        <InputView 
          onSubmit={handleInputSubmit} 
          isLoading={isLoading}
          error={error}
        />
      )
    }

    // All report views handled by ReportView with internal tab state
    if (currentView === 'report' || currentView.startsWith('report-')) {
      return (
        <ReportView 
          initialTab={currentView}
          data={reportData}
          onNewAnalysis={handleNewAnalysis}
          onNavigateToInput={() => handleNavigate('input')}
        />
      )
    }

    if (currentView === 'compliance') {
      return <ComplianceCheckView />
    }

    if (currentView === 'regulations') {
      return <RegulationsView />
    }

    return <div>View not found</div>
  }

  return (
    <AppLayout currentView={currentView} onNavigate={handleNavigate}>
      {renderContent()}
    </AppLayout>
  )
}

export default App
