import React from 'react';
import Map from '../components/map'
import Section from './Section'

export default function Main({currentLat, currentLong, items, street, city, state, zip, onSortEnd}) {

  return (
    <main className="main-container">
      <div className="header">
        <h1 className="header-title">CurbAlert</h1>
        <div className="header-bar">
          <h2 className="header-text">Dashboard</h2>
          <h2 className="header-text">Active Items</h2>
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
        <Section items={items} onSortEnd={onSortEnd}/>
      </section>
    </main>
  )
}