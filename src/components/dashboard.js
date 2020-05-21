import React, { useState } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Modal, Icon, Button } from 'semantic-ui-react'

export default function Dashboard({ dashboard, onSortEnd, removeFromDashboard, handleClaim, fetchLocation, checkDistance }) {

  const [badClaim, setBadClaim] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  const verifyClaim = (item) =>{
    if(checkDistance(item) < 0.6){
      handleClaim(item)
    } else {
      setBadClaim(true)
    }
  }

  const DragHandle = sortableHandle(() => <Icon className="dash-drag" name="redriver"/>);
  const SortableItemContainer = sortableContainer(({ children }) => <div className="dash-container">{children}</div>);
  const SortableItem = sortableElement(({ item }) => 
  <div className="dash-item">
    <Modal basic size='mini' trigger={<img className="dash-image" src={item.image_url} alt={item.name}/>}>
      <Modal.Content image>
        <img className={"image-modal"} src={item.image_url} alt={item.name}/>
      </Modal.Content>
    </Modal>
    <div className="dash-content">
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
        <span><strong>{item.street_address}, {item.city_address}, {item.state_address} {item.zip_address}</strong></span>
        <span>{item.quality}</span>
        <span>{item.category}</span>
      </div>
      <p className="dash-comment">{item.comment}</p>
      <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
      <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
      {!item.claimed ? 
        <div className="claim-button">
          <Button onClick={() => { setShowClaim(!showClaim); fetchLocation() }}>Claim</Button>
          <div>{showClaim ? <Button onClick={() => { verifyClaim(item); setShowClaim(false) }}>Confirm!</Button>:null}</div>
          {(badClaim && !showClaim) && <div className="error">You are too far to claim this!</div>}
        </div>
        :null
      }
    </div>
  </div>)

  const renderDashboard = () => {
    return dashboard.map((item, index) => <SortableItem index={index} key={index} item={item}/>)
  }

  return(
    <div className="dashboard">
      <SortableItemContainer axis="y" onSortEnd={onSortEnd} useDragHandle>
        {dashboard.length > 0 ? renderDashboard():
        <div className="empty-dash">
          <h1 className="empty">Your dashboard is empty!</h1>
        </div>}
      </SortableItemContainer>
    </div>
  )
}