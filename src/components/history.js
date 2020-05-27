import React, { useState } from 'react'
import { Accordion, Icon, Button, Modal, Popup } from 'semantic-ui-react'
import { CSSTransition } from "react-transition-group";
import UIfx from 'uifx';
import Sound from '../sounds/switch-click.mp3'
import { tagIt } from './utils'

export default function History(props) {

  const {
    name, 
    street_address, 
    city_address, 
    state_address, 
    zip_address, 
    date, 
    time, 
    quality, 
    category,
    claimed,
    comment,
    image_url,
    id
  } = props.history

  const switchClick = new UIfx(Sound);
  const { addToDashboard, handleDelete } = props
  const [open, setOpen] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteButton, setDeleteButton] = useState(false)

  return (
    <Accordion inverted>
      <Accordion.Title onClick={() => setOpen(!open)}>
        <div className="history-name">
          <p>{name}</p>
        </div>
        <div className="history-datetime">
          <Icon name={open ? 'caret down':'caret right'}/>
          <span><strong>{date} | {time}</strong></span>
          {tagIt(date)}
        </div>
      </Accordion.Title>
      <CSSTransition in={open} timeout={400} classNames="card-drop" unmountOnExit>
      <Accordion.Content active={open === true}>
        <div className="history-content">
          <div className="history-image-container">
            <img className="history-image" src={image_url} alt={name} />
            <Modal basic size='mini' trigger={<Icon name="search plus"/>}>
              <Modal.Content image>
                <img className={"image-modal"} src={image_url} alt={name}/>
              </Modal.Content>
            </Modal>
            <Popup 
              position='right center'
              content='Add to Dashboard' 
              size='tiny' 
              trigger={<Icon className="from-history" name="add square" onClick={() => {addToDashboard(props.history); switchClick.play()}}/>}
            />
          </div>

          <div className="history-details">
            <div className="card-left">
              <span>{street_address}, {city_address}, {state_address} {zip_address} </span>
            </div>
            <div className="card-right">
              <span>{quality}</span>
              <span>{category}</span>
            </div>
          </div>
          <p>{comment}</p>
          <div className="card-section">
            <div className="card-left">
              <p>Claimed: {claimed ? "Yes":"No"}</p>
            </div>
            <div className="card-right">
              {deleteButton ? <Button onClick={() => setShowDelete(!showDelete)} onMouseLeave={() => setDeleteButton(false)}>Sure?</Button>:
                <Button onMouseEnter={() => setDeleteButton(true)} onMouseLeave={() => setDeleteButton(false)} style={{backgroundColor: "#F45B69", color: "white"}}>Delete</Button>}
              <Button inverted color="red" onClick={() => handleDelete(id)} onMouseLeave={() => setShowDelete(false)} style={showDelete ? {visibility:"visible"}:{visibility:"hidden"}}>
                <span style={{lineHeight: "0px"}}>Confirm</span>
              </Button>
            </div>
          </div>
        </div>
      </Accordion.Content>
      </CSSTransition>
    </Accordion>
  )
}