import './index.css'
import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { InputView } from './components/features/InputView'
import { ReportView } from './components/features/ReportView'
import { ComplianceCheckView } from './components/features/ComplianceCheckView'
import { RegulationsView } from './components/features/RegulationsView'
import { useCompliance, type ComplianceResponse } from './hooks/useCompliance'

function App() {
  const [currentView, setCurrentView] = useState('input')
  const [reportData, setReportData] = useState<ComplianceResponse | null>(null)
  const { analyze, isLoading, error, reset } = useCompliance()

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleInputSubmit = async (description: string) => {
    const result = await analyze({ description })
    if (result) {
      setReportData(result)
      setCurrentView('report-escape')
    }
  }

  const handleNewAnalysis = () => {
    reset()
    setReportData(null)
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

    if (currentView.startsWith('report')) {
      return (
        <ReportView 
          activeTab={currentView} 
          onTabChange={handleNavigate}
          data={reportData}
          onNewAnalysis={handleNewAnalysis}
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
