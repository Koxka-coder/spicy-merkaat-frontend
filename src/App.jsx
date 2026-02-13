import { useState } from 'react'
import MapView from './pages/MapView'
import NodesDashboard from './pages/NodesDashboard'
import Schedules from './pages/Schedules'
import SensorsControl from './pages/SensorsControl'
import useWebSocket from './hooks/useWebSocket'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('map')
  const { connected, zoneStates, nodeStatuses } = useWebSocket()

  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapView zoneStates={zoneStates} connected={connected} />
      case 'dashboard':
        return <NodesDashboard nodeStatuses={nodeStatuses} connected={connected} />
      case 'schedules':
        return <Schedules />
      case 'sensors':
        return <SensorsControl />
      default:
        return <MapView zoneStates={zoneStates} connected={connected} />
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
          <button
            onClick={() => setCurrentPage('sensors')}
            className={currentPage === 'sensors' ? 'active' : ''}
          >
            Sensores
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
