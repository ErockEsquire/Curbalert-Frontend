import React from 'react'
import Card from '../components/card'

export default function Active({ user, items, checkDate, addToDashboard, handleClaim, handleSearchActive, searchActive, fetchLocation, checkDistance }) {

  const filterActives = (items) => {
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return typeof item[key] === 'string' && item[key].toLowerCase().includes(searchActive.toLowerCase())})
    })
  }

  const renderItemsEven = () => {
    const activeItems = filterActives(items)
    const evenItems = activeItems.filter((item, index) => index % 2 === 0)
    return evenItems.map(item => <Card user={user} item={item} addToDashboard={addToDashboard} checkDate={checkDate} handleClaim={handleClaim} fetchLocation={fetchLocation} checkDistance={checkDistance}/>)
  }

  const renderItemsOdd = () => {
    const activeItems = filterActives(items)
    const oddItems = activeItems.filter((item, index) => index % 2 !== 0)
    return oddItems.map(item => <Card user={user} item={item} addToDashboard={addToDashboard} checkDate={checkDate} handleClaim={handleClaim} fetchLocation={fetchLocation} checkDistance={checkDistance}/>)
  }

  return(
    <div className="active-div">
      <div className="active-search">
        <div className="ui icon input">
          <input
          className="prompt"
          placeholder="Search Active Items"
          value={searchActive}
          onChange={handleSearchActive}
          />
          <i className="search icon" />
        </div>
      </div>
      <div className="active-container">
        <div className="column-one">
          {renderItemsEven()}
        </div>
        <div className="column-two">
          {renderItemsOdd()}
      </div>
      </div>
    </div>
  )
}