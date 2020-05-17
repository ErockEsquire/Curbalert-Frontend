import React, { useState } from 'react'
import { Accordion, Icon, Label, Button } from 'semantic-ui-react'

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
  const [large, setLarge] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteButton, setDeleteButton] = useState(false)

  return (
    <Accordion inverted>
        <Accordion.Title
          onClick={() => setOpen(!open)}
          >
          <div className="history-title">
          <p>{name}</p>
          {checkDate(date) <= 3 ? 
            <Label as='a' color='orange' tag>
              Active
            </Label>:null}
          </div>
          <Icon name='dropdown' />
          <span><strong>{date} | {time}</strong></span>
        </Accordion.Title>
        <Accordion.Content active={open === true}>
          <div className="history">
            <img className={large ? "history-image-large":"history-image"} src={image_url} alt={name} onClick={() => setLarge(!large)}/>
            <div className="history-details">
              <div className="history-left">
                <span>{street_address}, {city_address}, {state_address} {zip_address} </span>
              </div>
              <div className="history-right">
                <span>{quality}</span>
                <span>{category}</span>
              </div>
            </div>
            <p>{comment}</p>
            <div className="history-details">
              <div className="history-left">
                <p>Claimed: {claimed ? "Yes":"No"}</p>
              </div>
              <div className="history-right">
                {deleteButton ? <Button onClick={() => setShowDelete(true)} onMouseLeave={() => setDeleteButton(false)}>Sure?</Button>:
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