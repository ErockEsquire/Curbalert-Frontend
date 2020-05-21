import React, { useState } from 'react';
import Map from '../components/map'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

export default function Main({ user, currentLat, currentLong, items, dashboard, street, city, state, zip, onSortEnd, addToDashboard, removeFromDashboard, checkDate, handleClaim, handleAvail, fetchLocation, checkDistance }) {

  const [dash, setDash] = useState(false)
  return (
    <main className="main-container">
      <div className="header">
        <h1 className="header-title">CurbAlert</h1>
        <div className="header-bar">
          {dash ? <div className="color-block"><h2 className="header-text" onClick={() => setDash(true)}>Dashboard</h2></div>:<h2 className="header-text" onClick={() => setDash(true)}>Dashboard</h2>}
          {dash ? <h2 className="header-text" onClick={() => setDash(false)}>Active Items</h2>:<div className="color-block"><h2 className="header-text" onClick={() => setDash(false)}>Active Items</h2></div>}
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
        addToDashboard={addToDashboard}
        fetchLocation={fetchLocation} 
        checkDistance={checkDistance}
        />
        <section className="section">
          {dash ? <Dashboard dashboard={dashboard} onSortEnd={onSortEnd} removeFromDashboard={removeFromDashboard} handleClaim={handleClaim} fetchLocation={fetchLocation} checkDistance={checkDistance}/>:
          <Active user={user} items={items} checkDate={checkDate} addToDashboard={addToDashboard} handleClaim={handleClaim} handleAvail={handleAvail} fetchLocation={fetchLocation} checkDistance={checkDistance}/>}
        </section>
      </section>
    </main>
  )
}