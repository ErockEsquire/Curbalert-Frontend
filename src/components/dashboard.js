import React, { useEffect } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { Modal, Icon } from 'semantic-ui-react'

export default function Dashboard({ items, dashboard, onSortEnd, removeFromDashboard }) {

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
          <Icon className="dash-drag" name="minus square" onClick={()=>removeFromDashboard(item.id)}/>
        </div>
      </div>
      <p className="dash-name">{item.name}</p>
      <div className="dash-datetime">
        <span>{item.quality}</span>
        <span>{item.category}</span>
      </div>
      <p className="dash-comment">{item.comment}</p>
    </div>
  </div>)


  const renderDashboard = () => {
    return dashboard.map((item, index) => <SortableItem index={index} item={item}/>)
  }

  return(
    <div className="dashboard">
      <SortableItemContainer axis="y" onSortEnd={onSortEnd} useDragHandle>
        {renderDashboard()}
      </SortableItemContainer>
    </div>
  )
}