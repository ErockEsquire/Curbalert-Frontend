import React, { useState } from 'react'
import { Accordion, Icon, Label, Button, Modal, Popup } from 'semantic-ui-react'

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

  const { checkDate, addToDashboard, handleDelete } = props
  const [open, setOpen] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteButton, setDeleteButton] = useState(false)

  const tagIt = (date) => {
    const days = checkDate(date)
    if(days <= 1) {
      return <Label as='a' color='red' tag>Active</Label>
    } else if(days === 2) {
      return <Label as='a' color='orange' tag>Active</Label>
    } else if(days === 3) {
      return <Label as='a' color='blue' tag>Active</Label>
    } else {
      return null
    }
  }

  return (
    <Accordion inverted>
      <Accordion.Title onClick={() => setOpen(!open)}>
        <div className="history-title">
          <p>{name}</p>
        </div>
        <div className="history-datetime">
          <Icon name={open ? 'caret down':'caret right'}/>
          <span><strong>{date} | {time}</strong></span>
          {tagIt(date)}
        </div>
      </Accordion.Title>

      <Accordion.Content active={open === true}>
        <div className="history-content">
          <div className="history-image-container">
            <img className={"history-image"} src={image_url} alt={name} />
            <Modal basic size='mini' trigger={<Icon name="search plus"/>}>
              <Modal.Content image>
                <img className={"image-modal"} src={image_url} alt={name}/>
              </Modal.Content>
            </Modal>
            <Popup 
              position='right center'
              content='Add to Dashboard' 
              size='tiny' 
              trigger={<Icon className="from-history" name="add square" onClick={() => addToDashboard(props.history)}/>}
            />
          </div>

          <div className="card-details">
            <div className="card-left">
              <span>{street_address}, {city_address}, {state_address} {zip_address} </span>
            </div>
            <div className="card-right">
              <span>{quality}</span>
              <span>{category}</span>
            </div>
          </div>
          <p>{comment}</p>
          <div className="card-details">
            <div className="card-left">
              <p>Claimed: {claimed ? "Yes":"No"}</p>
            </div>
            <div className="card-right">
              {deleteButton ? <Button onClick={() => setShowDelete(!showDelete)} onMouseLeave={() => setDeleteButton(false)}>Sure?</Button>:
                <Button onMouseEnter={() => setDeleteButton(true)} onMouseLeave={() => setDeleteButton(false)} style={{backgroundColor: "rgb(65, 204, 199)"}}>Delete</Button>}
              <Button inverted color="red" onClick={() => handleDelete(id)} onMouseLeave={() => setShowDelete(false)} style={showDelete ? {visibility:"visible"}:{visibility:"hidden"}}>
                <span style={{lineHeight: "0px"}}>Confirm</span>
              </Button>
            </div>
          </div>
        </div>
      </Accordion.Content>
    </Accordion>
  )
}