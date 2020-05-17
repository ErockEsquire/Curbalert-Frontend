import React, { useState } from 'react'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';


export default function Dashboard({ items, onSortEnd }) {

  const SortableItemContainer = sortableContainer(({ children }) => <div className="dash-container">{children}</div>);
  const SortableItem = sortableElement(({item}) => <div className="dash-item"><img className="dash-image" src={item.image_url}/></div>)

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