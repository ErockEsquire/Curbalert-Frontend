import React from 'react';
import Map from '../components/map'

export default function Main({currentLat, currentLong}) {

  return (
    <main className="main-container">
      <div className="title">
        <h1>CurbAlert</h1>
      </div>
      <Map currentLat={currentLat} currentLong={currentLong}/>
    </main>
  )
}