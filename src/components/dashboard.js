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
  const [showDirections, setShowDirections] = useState(false)

  const verifyClaim = (item) =>{
    if(checkDistance(item) < 0.6){
      handleClaim(item)
      setGoodClaim(true)
    } else {
      setBadClaim(true)
    }
  }

  const Claims = ({ item }) => {
    return (
      <div className={claims ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="dash-claims">
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
      </div>
    )
  }

  const Details = ({item}) => {
    return (
      <div className={details ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="dash-details">
          <div className="dash-datetime">
            <span>{item.quality}</span>
            <span>{item.category}</span>
          </div>
          <p className="dash-comment">{item.comment}</p>
          <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
          <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
        </div>
      </div>
    )
  }

  const Directions = ({ item, mode }) => {
    
    return (
      <div className={directions ? "dash-tab-active":"dash-tab-inactive"}>
        <div className="dash-directions">
          <div className="dash-direction-mode">
            {mode === "walking" ? <div className="mode-highlight"><WalkingIcon className="directions-icon-walking" onClick={(e) => {setMode("walking"); console.log(mode)}}/></div>:<WalkingIcon className="directions-icon-walking" onClick={(e) => setMode("walking")}/>}
            {mode === "transit" ? <div className="mode-highlight"><TransitIcon className="directions-icon-transit" onClick={(e) => {setMode("transit"); console.log(mode)}}/></div>:<TransitIcon className="directions-icon-transit" onClick={(e) => setMode("transit")}/>}
            {mode === "driving" ? <div className="mode-highlight"><CarIcon className="directions-icon-driving" onClick={(e) => {setMode("driving"); console.log(mode)}}/></div>:<CarIcon className="directions-icon-driving" onClick={(e) => setMode("driving")}/>}
          </div>
          <div className="dash-directions-button">
            <Button onClick={() => {fetchDirections(item, mode); setShowDirections(true)}}>Get Directions!</Button>
          </div>
          {(routeId === item.id && showDirections && Object.keys(route).length > 0) && renderDirections(route) }
        </div>
      </div>
    )
  }

  const renderDirections = (route) => {
    const steps = route.legs[0].steps

    return (
      <div className="directions">
        <div className="dash-distance-duration">
          <span>Total Distance: {route.legs[0].distance.text}</span>
          <span>Total Duration: {route.legs[0].duration.text}</span>
        </div>
        {steps.map(step => {
          return <div className="step-details">
            <p className="dash-step"><Icon name="chevron right"/>{step.html_instructions.replace(/(<([^>]+)>)/ig,"")} ({step.duration.text})</p>
              {"transit_details" in step && 
                <div className="dash-transit-details">
                  <img src={step.transit_details.line.icon} alt={step.transit_details.line.name}/>
                  <p>From <strong>{step.transit_details.departure_stop.name}</strong>, take {step.transit_details.line.name} to <strong>{step.transit_details.arrival_stop.name}</strong></p>
                </div>
              }
              {"steps" in step && <DirectionSteps steps={step.steps}/>}
            </div>
        })}
      </div>
      
    )
  }

  const DirectionSteps = ({ steps }) => {
    const [open, setOpen] = useState(false)
  
    return (
      <div className="dash-more-details" onClick={() => setOpen(!open)}>
        <Icon name={open ? 'caret down':'caret right'}/>
        <span>More Details</span>
          {open && <div className="direction-details">
            {steps.map(step => {
              return <p><Icon name="angle double right"/>{step.html_instructions.replace(/(<([^>]+)>)/ig,"")} (<strong>{step.distance.text}</strong>)</p>
            })}
          </div>}
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

