import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Icon } from 'semantic-ui-react'

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
    const { currentLat, currentLong, items, street, city, state, zip, addToDashboard } = this.props
    const position = [currentLat, currentLong]
    return (

      <div className="map-container">
        <Map className="map" center={position} zoom={this.state.zoom} 
        style={{display: "inline-block", margin:"0 0.5rem", height: "87.5vh", width: "58vw", border:"2px solid gray", borderRadius: "10px", zIndex:"0"}}>
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
                    <div className="popup-name">
                      <Icon className="popup" name="add square" onClick={() => addToDashboard(item)}/>
                      <h3>{item.name}</h3>
                    </div>
                    <p className="posted-by">Posted: <span className="username"><strong>{item.users[0].username}</strong></span> <Icon name="star"/>{item.users[0].rating}</p>
                    <div className="image-container">
                      <img className={this.state.large ? "popup-image-large":"popup-image"} src={item.image_url} alt={item.name} onClick={() => this.setLarge()}/>
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
            }):null
          }
        </Map>
      </div>
    )
  }
}