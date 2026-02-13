import { useState } from 'react'
import MapView from './pages/MapView'
import NodesDashboard from './pages/NodesDashboard'
import Schedules from './pages/Schedules'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('map')

  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapView />
      case 'dashboard':
        return <NodesDashboard />
      case 'schedules':
        return <Schedules />
      default:
        return <MapView />
    }
  }

  return (
    <div className="app">
      <nav className="navigation">
        <h1>Spicy Merkaat</h1>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentPage('map')}
            className={currentPage === 'map' ? 'active' : ''}
          >
            Map View
          </button>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={currentPage === 'dashboard' ? 'active' : ''}
          >
            Nodes Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('schedules')}
            className={currentPage === 'schedules' ? 'active' : ''}
          >
            Schedules
          </button>
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
