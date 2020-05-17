import React from 'react'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

export default function Section({ items, onSortEnd }) {

  return (
    <section className="section">
      <Dashboard items={items} onSortEnd={onSortEnd}/>
      <Active/>
    </section>
  )
}