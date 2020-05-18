import React from 'react'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

export default function Dashboard({ items, onSortEnd }) {
  const SortableItemContainer = sortableContainer(({ children }) => <div className="dash-container">{children}</div>);
  const SortableItem = sortableElement(({ item }) => 
  <div className="dash-item">
    <img className="dash-image" src={item.image_url} alt={item.name}/>
    <div className="dash-content">
      <div className="dash-datetime">
        <span>{item.date}</span>
        <span>{item.time}</span>
      </div>
      <p className="dash-name">{item.name}</p>
      <div className="dash-datetime">
        <span>{item.quality}</span>
        <span>{item.category}</span>
      </div>
      <p className="dash-comment">{item.comment}</p>
    </div>
  </div>)

  const renderItems = () => {
    return items.map((item, index) => <SortableItem index={index} item={item}/>)
  }

  return(
    <div className="dashboard">
      <SortableItemContainer axis="y" onSortEnd={onSortEnd}>
        {renderItems()}
      </SortableItemContainer>
    </div>
  )
}