import React, { useState } from 'react';
import Map from '../components/map'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

export default function Main({currentLat, currentLong, items, street, city, state, zip, onSortEnd}) {

  const [dashboard, setDashboard] = useState(true)
  
  return (
    <main className="main-container">
      <div className="header">
        <h1 className="header-title">CurbAlert</h1>
        <div className="header-bar">
          {dashboard ? <div className="color-block"><h2 className="header-text" onClick={() => setDashboard(true)}>Dashboard</h2></div>:<h2 className="header-text" onClick={() => setDashboard(true)}>Dashboard</h2>}
          {dashboard ? <h2 className="header-text" onClick={() => setDashboard(false)}>Active Items</h2>:<div className="color-block"><h2 className="header-text" onClick={() => setDashboard(false)}>Active Items</h2></div>}
        </div>
      </div>
      <section className="main">
        <Map 
        currentLat={currentLat} 
        currentLong={currentLong} 
        items={items}
        street={street}
        city={city}
        state={state}
        zip={zip}
        />
        <section className="section">
          {dashboard ? <Dashboard items={items} onSortEnd={onSortEnd}/>:
          <Active/>}
        </section>
      </section>
    </main>
  )
}