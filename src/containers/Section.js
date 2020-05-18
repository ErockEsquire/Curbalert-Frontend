import React, { useState } from 'react'
import Dashboard from '../components/dashboard'
import Active from '../components/active'

export default function Section({ items, onSortEnd }) {

  const [active, setActive] = useState(false)

  return (
    <section className="section">
      <Dashboard items={items} onSortEnd={onSortEnd}/>
      <Active/>
    </section>
  )
}