import React from 'react'

export default function Welcome({ user }) {

  return (
    <section id="welcome">
      <h1 className="welcome-first">Welcome</h1>
      <h1 className="welcome-second">to</h1>
      <h1 className="welcome-third">CurbAlert</h1>
      <h1 className="welcome-fourth">{user.username}</h1>
    </section>
  )
}