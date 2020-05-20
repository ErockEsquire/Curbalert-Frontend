import React from 'react'
import Card from '../components/card'

export default function Active({ user, items, checkDate, addToDashboard, handleClaim, handleAvail }) {

  const renderItems = () => {
    return items.map(item => <Card user={user} item={item} addToDashboard={addToDashboard} checkDate={checkDate} handleClaim={handleClaim}/>)
  }

  return(
    <div className="active-div">
      {renderItems()}
    </div>
  )
}