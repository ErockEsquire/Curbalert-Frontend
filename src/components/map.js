import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import styled from 'styled-components';

  const HoverImage = styled.img`
   :hover{
    height: 100%;
    width: 16rem;
    transform: scale(1.25);
    position: relative;
    right: 1rem;
    top: 3rem;
  }
  `

export default class MapContainer extends React.Component {
  state = {
    zoom: 15
  }

  render() {
    const { currentLat, currentLong, items, street, city, state, zip } = this.props
    const position = [currentLat, currentLong]
    console.log(this.props)
    return (

      <div className="map-container">
        <Map className="map" center={position} zoom={this.state.zoom} 
        style={{display: "inline-block", margin:"1.5rem 1rem", height: "500px", width: "800px", border:"2px solid gray", borderRadius: "10px", zIndex:"0"}}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="popup">
                <h4>{street}, {city}, {state} {zip}</h4>
                <span>You are Here!</span>
              </div>
            </Popup>
          </Marker>

          {items.length > 0 ?
            items.map(item => {
              return <Marker key={item.id} position={[item.latitude, item.longitude]}>
                <Popup>
                  <div className="popup">
                    <h4>{item.name}</h4>
                    <HoverImage className="popup-image" src={item.image_url} alt={item.name}/>
                    <p>Posted: {item.date} <strong>{item.time}</strong></p>
                    <div className="item-one">
                      <p>{item.street_address}, {item.city_address}, {item.state_address} {item.zip_address}</p>
                      <div className="item-two">
                        <span>{item.quality}</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <p>{item.comment}</p>
                  </div>
                </Popup>
              </Marker>
            }):null
          }
        </Map>
      </div>
    )
  }
}