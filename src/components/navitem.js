import React from 'react'

export default function Navitem({ handleClick, text, children }) {

  return (
    <li className="nav-item">
      <div className="nav-tab" onClick={handleClick}>
        {children}
        <span className="nav-text">{text}</span>
      </div>
    </li>
  )
}