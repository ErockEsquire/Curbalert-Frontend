import React, { useState } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Modal, Icon, Button } from 'semantic-ui-react'
import { ReactComponent as WalkingIcon } from '../icons/walking.svg'
import { ReactComponent as TransitIcon } from '../icons/subway.svg'
import { ReactComponent as CarIcon } from '../icons/car.svg'

export default function Dashboard({ user, dashboard, onSortEnd, removeFromDashboard, handleClaim, fetchLocation, checkDistance, fetchDirections, route, routeId }) {

  const [badClaim, setBadClaim] = useState(false)
  const [goodClaim, setGoodClaim] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [details, setDetails] = useState(true)
  const [directions, setDirections] = useState(false)
  const [claims, setClaims] = useState(false)
  const [mode, setMode] = useState("walking")

  const verifyClaim = (item) =>{
    if(checkDistance(item) < 0.6){
      handleClaim(item)
      setGoodClaim(true)
    } else {
      setBadClaim(true)
    }
  }

  const Claims = ({ item, claims, showClaim, setShowClaim, badClaim, goodClaim, verifyClaim, fetchLocation}) => {
    return (
      <div className={claims ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="claim-details"><p>Want to claim item?</p></div>
        <div className="claim-button">
        {(user.id !== item.users[0].id) ?
          <div className="posted-by">You cannot claim your own item!</div>:
            (item.claimed) ? 
            <div className="posted-by">This has been claimed.</div>:
            <Button onClick={() => { setShowClaim(!showClaim); fetchLocation() }}>Claim</Button>
        }
          <div>{showClaim ? <Button onMouseLeave={() => setShowClaim(false)} onClick={() => { verifyClaim(item); setShowClaim(false) }}>Confirm!</Button>:null}</div>
          {(badClaim && !showClaim) && <div className="error"><strong>You are too far to claim this!</strong></div>}
          {(goodClaim && !showClaim) && <div className="congrats">Congrats!</div>}
        </div>
      </div>
    )
  }

  const Details = ({item}) => {
    return (
      <div className={details ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="dash-datetime">
          <span>{item.quality}</span>
          <span>{item.category}</span>
        </div>
        <p className="dash-comment">{item.comment}</p>
        <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
        <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
      </div>
    )
  }

  const Directions = ({ item, mode }) => {
    const distance = route.legs[0].distance.text
    const duration = route.legs[0].duration.text
    
    return (
      <div className={directions ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="dash-direction-mode">
          {mode === "walking" ? <div className="mode-highlight"><WalkingIcon className="directions-icon-walking" onClick={(e) => {setMode("walking"); console.log(mode)}}/></div>:<WalkingIcon className="directions-icon-walking" onClick={(e) => setMode("walking")}/>}
          {mode === "transit" ? <div className="mode-highlight"><TransitIcon className="directions-icon-transit" onClick={(e) => {setMode("transit"); console.log(mode)}}/></div>:<TransitIcon className="directions-icon-transit" onClick={(e) => setMode("transit")}/>}
          {mode === "driving" ? <div className="mode-highlight"><CarIcon className="directions-icon-driving" onClick={(e) => {setMode("driving"); console.log(mode)}}/></div>:<CarIcon className="directions-icon-driving" onClick={(e) => setMode("driving")}/>}
        </div>
        <div className="dash-directions">
          <Button onClick={() => fetchDirections(item, mode)}>Get Directions!</Button>
        </div>
        {routeId === item.id && 
        <div className="directions">
          <div className="dash-datetime">
            <span>Distance: {distance}</span>
            <span>Duration : {duration}</span>
          </div>
        </div>
        }
      </div>
    )
  }

  const DragHandle = sortableHandle(() => <Icon className="dash-drag" name="angle double up"/>);
  const SortableItemContainer = sortableContainer(({ children }) => <div className="dash-container">{children}</div>);
  const SortableItem = sortableElement(({ item }) => 
  <div className="dash-item">
    <Modal basic size='mini' trigger={<img className="dash-image" src={item.image_url} alt={item.name}/>}>
      <Modal.Content image>
        <img className={"image-modal"} src={item.image_url} alt={item.name}/>
      </Modal.Content>
    </Modal>
    <div className="dash-content">
      <div className="dash-head">
        <div className="dash-top">
          <div className="dash-datetime">
            <span>{item.date}</span>
            <span>{item.time}</span>
          </div>
          <div className="dash-drag-container">
            <DragHandle />
            <Icon className="dash-drag" name="remove" onClick={()=>removeFromDashboard(item.id)}/>
          </div>
        </div>
        <p className="dash-name">{item.name}</p>
        <div className="dash-datetime">
          <span><strong>{item.street_address}, {item.city_address},</strong></span>
          <span><strong>{item.state_address} {item.zip_address}</strong></span>
        </div>
      </div>
      <div className="dash-body">
        <div className="tab">
          <div className={details ? "tab-pane-active":"tab-pane-inactive"} onClick={() => {setDetails(true); setDirections(false); setClaims(false)}}>Details</div>
          <div className={directions ? "tab-pane-active":"tab-pane-inactive"} onClick={() => {setDirections(true); setDetails(false); setClaims(false)}}>Directions</div>
          <div className={claims ? "tab-pane-active":"tab-pane-inactive"} onClick={() => {setClaims(true); setDetails(false); setDirections(false)}}>Claim</div>
        </div>
          {details && <Details item={item}/>}
          {directions && <Directions item={item} mode={mode}/>}
          {claims && <Claims item={item} claims={claims} badClaim={badClaim} goodClaim={goodClaim} showClaim={showClaim} setShowClaim={setShowClaim} verifyClaim={verifyClaim} fetchLocation={fetchLocation}/>}
      </div>
    </div>
  </div>)

  const renderDashboard = () => {
    return dashboard.map((item, index) => <SortableItem index={index} key={index} item={item}/>)
  }

  return(
    <div className="dashboard-div">
      <SortableItemContainer axis="y" onSortEnd={onSortEnd} useDragHandle>
        {dashboard.length > 0 ? renderDashboard():
        <div className="empty-dash">
          <h1 className="empty">Your dashboard is empty!</h1>
        </div>}
      </SortableItemContainer>
    </div>
  )
}

