import React from 'react'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

export default function Dashboard({ items, onSortEnd }) {

  const SortableItemContainer = sortableContainer(({ children }) => <div className="dash-container">{children}</div>);
  const SortableItem = sortableElement(({ item, index }) => 
  <div className="dash-item">
    <img className="dash-image" src={item.image_url}/>
    <p className="dash-name">{item.name}</p>
    {console.log(item)}
    {console.log(index)}
    <div className="dash-datetime">
      <span>{item.date}</span>
      <span>{item.time}</span>
    </div>
    <p className="dash-comment">{item.comment}</p>
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