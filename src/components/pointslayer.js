import React, { useState, useEffect, useRef } from 'react'
import { Marker, Popup} from 'react-leaflet'
import UIfx from 'uifx';
import Sound from '../sounds/switch-click.mp3'
import { Icon } from 'semantic-ui-react'
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const switchClick = new UIfx(Sound);

export default function PointsLayer({ items, plot, addToDashboard }) {
  return items.map((item, index) => (
    <PointMarker
      key={index}
      item={item}
      plot={plot}
      openPopup={item.id === plot.id}
      addToDashboard={addToDashboard}
    />
  ));
}

const PointMarker = ({ item, openPopup, addToDashboard }) => {
  const [large, setLarge] = useState(false)
  const markerRef = useRef(null);

  const pinI = renderToStaticMarkup(<i id="item" class="fas fa-map-pin"></i>)
  const pinItem = divIcon({ html: pinI });

  useEffect(() => {
    if (openPopup) markerRef.current.leafletElement.openPopup();
  }, [openPopup]);

  return (
    <Marker ref={markerRef} icon={pinItem} key={item.id} id={item.id} position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popup">
          <div className="popup-name">
            <Icon className="popup" name="add square" onClick={() => {addToDashboard(item);switchClick.play()}}/>
            <h3>{item.name}</h3>
          </div>
          <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
          <div className="image-container">
            <img className={large ? "popup-image-large":"popup-image"} src={item.image_url} alt={item.name} onClick={() => setLarge(!large)}/>
          </div>
          <p>{item.date} <strong>{item.time}</strong></p>
          <div className="card-details">
            <div className="card-left">
              <span>{item.street_address}, {item.city_address}, {item.state_address} {item.zip_address}</span>
            </div>
            <div className="card-right">
              <span>{item.quality}</span>
              <span>{item.category}</span>
            </div>
          </div>
          <span className="comment">{item.comment}</span>
          <p className="posted-by">Claimed: {item.claimed ? "Yes":"No"}</p>
        </div>
      </Popup>
    </Marker>
  )
}