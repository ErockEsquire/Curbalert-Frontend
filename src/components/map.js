import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import styled from 'styled-components';
import { Modal } from 'semantic-ui-react'

export default class MapContainer extends React.Component {
  state = {
    zoom: 15,
    large: false
  }

  setLarge = () => {
    this.setState({
      ...this.state,
      large: !this.state.large
    })
  }

  render() {
    const { currentLat, currentLong, items, street, city, state, zip } = this.props
    const position = [currentLat, currentLong]
    console.log(this.props)
    return (

      <div className="map-container">
        <Map className="map" center={position} zoom={this.state.zoom} 
        style={{display: "inline-block", margin:"1rem 1rem", height: "505px", width: "800px", border:"2px solid gray", borderRadius: "10px", zIndex:"0"}}>
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
                    <div className="image-container">
                      <img className={this.state.large ? "popup-image-large":"popup-image"} src={item.image_url} alt={item.name} onClick={() => this.setLarge()}/>
                    </div>
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