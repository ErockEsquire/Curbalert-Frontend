import React, { useState } from 'react';
import Map from '../components/map'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

export default function Main({ user, currentLat, currentLong, items, dashboard, street, city, state, zip, onSortEnd, addToDashboard, removeFromDashboard, checkDate, handleClaim, handleAvail, handleSearchActive, searchActive, fetchLocation, checkDistance, fetchDirections, polyline, route, routeId }) {

  const [dash, setDash] = useState(false)
  return (
    <main className="main-container">
      {user === "pending" && <Redirect to="/login"/>}
      <div className="header">
        <h1 className="header-title">CurbAlert</h1>
        <div className="header-bar">
          <h2 className={dash ? "header-text-large":"header-text"} onClick={() => setDash(true)}>Dashboard</h2>
          <h2 className={dash ? "header-text":"header-text-large"} onClick={() => setDash(false)}>Active Items</h2>
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
        polyline={polyline}
        route={route}
        />
        <section className="section">
          {dash ? <Dashboard user={user} dashboard={dashboard} onSortEnd={onSortEnd} removeFromDashboard={removeFromDashboard} handleClaim={handleClaim} fetchLocation={fetchLocation} checkDistance={checkDistance} fetchDirections={fetchDirections} route={route} routeId={routeId}/>:
          <Active user={user} items={items} checkDate={checkDate} addToDashboard={addToDashboard} handleClaim={handleClaim} handleAvail={handleAvail} handleSearchActive={handleSearchActive} searchActive={searchActive} fetchLocation={fetchLocation} checkDistance={checkDistance}/>}
        </section>
      </section>
    </main>
  )
}