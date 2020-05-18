import React from 'react'

export default function Navitem({ handleClick, text, open, children }) {

  return (
    <li className="nav-item">
      <div className="nav-tab" onClick={handleClick}>
        {children}
        <span className={open ? "nav-text-open":"nav-text-close"}>{text}</span>
      </div>
    </li>
  )
}
