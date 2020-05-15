import React from 'react';
import Map from '../components/map'

export default function Main({currentLat, currentLong, items}) {

  return (
    <main className="main-container">
      <div className="title">
        <h1>CurbAlert</h1>
      </div>
      <section className="main">
        <Map currentLat={currentLat} currentLong={currentLong} items={items}/>
        <div></div>
      </section>
    </main>
  )
}