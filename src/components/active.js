import React from 'react'
import Card from '../components/card'

export default function Active({ user, items, checkDate, addToDashboard, handleClaim, fetchLocation, checkDistance }) {

  const renderItems = () => {
    return items.map(item => <Card user={user} item={item} addToDashboard={addToDashboard} checkDate={checkDate} handleClaim={handleClaim} fetchLocation={fetchLocation} checkDistance={checkDistance}/>)
  }

  return(
    <div className="active-div">
      {renderItems()}
    </div>
  )
}