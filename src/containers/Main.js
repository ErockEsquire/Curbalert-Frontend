import React from 'react';
import Map from '../components/map'

export default function Main({currentLat, currentLong, items, street, city, state, zip}) {

  return (
    <main className="main-container">
      <div className="header">
        <h1>CurbAlert</h1>
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
        <div></div>
      </section>
    </main>
  )
}