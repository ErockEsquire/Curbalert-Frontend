import React from 'react'

export default function Welcome({ user }) {

  return (
    <section id="welcome">
      <div className="welcome-line">
        <h1 className="welcome-first">Welcome</h1>
        <h1 className="welcome-fourth">{user.username}</h1>
      </div>
      <h1 className="welcome-second">to</h1>
      <h1 className="welcome-third">CurbAlert</h1>
    </section>
  )
}