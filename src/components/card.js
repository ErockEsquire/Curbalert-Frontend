import React, { useState } from 'react'
import { Modal, Icon, Label, Popup, Button } from 'semantic-ui-react'
import UIfx from 'uifx';
import Sound from '../sounds/switch-click.mp3'

export default function Card({ user, item, checkDate, checkDistance, addToDashboard, handleClaim, fetchLocation }) {
  const [open, setOpen] = useState(false)
  const [badClaim, setBadClaim] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  const switchClick = new UIfx(Sound);

  const handleCard = () => {
    setShowClaim(false)
    setBadClaim(false)
    setOpen(!open)
  }

  const tagIt = (date) => {
    const days = checkDate(date)
    if(days <= 1) {
      return <Label as='a' color='red' tag>Active</Label>
    } else if(days <= 2) {
      return <Label as='a' color='orange' tag>Active</Label>
    } else if(days <= 3) {
      return <Label as='a' color='blue' tag>Active</Label>
    } else {
      return null
    }
  }

  const verifyClaim = (item) =>{
    if(checkDistance(item) < 0.6){
      handleClaim(item)
    } else {
      setBadClaim(true)
    }
  }

  return (
    <div className="active-item">
      <div className="active-image-container">
        <img className="active-image" src={item.image_url} alt={item.name} onClick={() => handleCard()}/>
        <Modal basic size='mini' trigger={<Icon name="search plus"/>}>
          <Modal.Content image>
            <img className={"image-modal"} src={item.image_url} alt={item.name}/>
          </Modal.Content>
        </Modal>
        <Popup 
          position='right center'
          content='Add to Dashboard'
          size='tiny'
          trigger={<Icon className="from-active" name="add square" onClick={() => {addToDashboard(item); switchClick.play()}}/>}
        />
      </div>
      <div className="active-header" onClick={() => handleCard()}>
        <p className="active-name">{item.name}</p>
        <div className="history-datetime">
          <span><strong>{item.date} | {item.time}</strong></span>
          {tagIt(item.date)}
        </div>
      </div>
      <div className={open ? "active-content-open":"active-content-close"}>
        <div className={open ? "card-open":"card-close"}>
          <div className="card-details">
            <div className="card-left">
              <span>{item.street_address}, {item.city_address}, {item.state_address} {item.zip_address} </span>
            </div>
            <div className="card-right">
              <span>{item.quality}</span>
              <span>{item.category}</span>
            </div>
          </div>
          <p className="dash-comment">{item.comment}</p>
          <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
          <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
          {user.id === item.users[0].id && !item.claimed ? 
            <div className="claim-button">
              <Button onClick={() => { setShowClaim(!showClaim); fetchLocation() }}>Claim</Button>
              <div>{showClaim ? <Button onMouseLeave={() => setShowClaim(false)} onClick={() => { verifyClaim(item); setShowClaim(false) }}>Confirm!</Button>:null}</div>
              {(badClaim && !showClaim) && <div className="error">You are too far to claim this!</div>}
            </div>
            :null
          }
        </div>
      </div>
    </div>
  )
}