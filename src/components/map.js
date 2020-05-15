import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export default class MapContainer extends React.Component {
  state = {
    zoom: 15
  }

  render() {
    const { currentLat, currentLong, items } = this.props
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
              {/* You are near {this.context.currentLocation} */}
            </Popup>
          </Marker>

          {items.length > 0 ?
            items.map(item => {
              return <Marker position={item.latitude, item.longitude}>
                <Popup>
                  <h3>{item.name}</h3>
                </Popup>
              </Marker>
            }):null
          }
        </Map>
      </div>
    )
  }
}