import React, { useState } from 'react';
import PointsLayer from './pointslayer'
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import { Icon } from 'semantic-ui-react'
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const DirectionSteps = ({ steps }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="more-details" onClick={() => setOpen(!open)}>
      <Icon name={open ? 'caret down':'caret right'}/>
      <span>More Details</span>
        {open && <div className="direction-details">
          {steps.map(step => {
            return <p><Icon name="angle double right"/>{step.html_instructions.replace(/(<([^>]+)>)/ig,"")} (<strong>{step.distance.text}</strong>)</p>
          })}
        </div>}
    </div>
  )
}

export default class MapContainer extends React.Component {
  state = {
    zoom: 15
  }

  map = ""

 //creates a ref specifically for a marker. This allows the button on items to center onto this marker and expand it.
  bindMap = (ref) => {
    if (ref) {
      this.map = ref.leafletElement
    }
  }

  setLarge = () => {
    this.setState({
      ...this.state,
      large: !this.state.large
    })
  }

  renderStepMarkers = (route, pinStep) => {
    const steps = route.legs[0].steps

    return steps.map((step, index) => {
        return (
        <Marker icon={pinStep} key={index} position={Object.values(step.start_location)}>
          <Popup>
          <div className="popup">
            <div className="step-distance-duration">
              <span>Distance: {step.distance.text}  </span>
              <span>Duration: {step.duration.text}</span>
            </div>
            <span className="instructions">{step.html_instructions.replace(/(<([^>]+)>)/ig,"")}</span>
              {"transit_details" in step && 
                <div className="transit-details">
                  <img src={step.transit_details.line.icon} alt={step.transit_details.line.name}/>
                  <p>From <strong>{step.transit_details.departure_stop.name}</strong>, take {step.transit_details.line.name} to <strong>{step.transit_details.arrival_stop.name}</strong></p>
                </div>
              }
              {"steps" in step && <DirectionSteps steps={step.steps}/>}
          </div>
          </Popup>
        </Marker>
        )
      })
  }

  render() {
    const { currentLat, currentLong, items, address, addToDashboard, polyline, route, plot } = this.props
    const position = [currentLat, currentLong]
    const pinU = renderToStaticMarkup(<i id="user" className="fas fa-map-pin"></i>)
    const step = renderToStaticMarkup(<i id="step" className="fas fa-map-marker-alt"></i>)
    const pinUser = divIcon({ html: pinU });
    const pinStep = divIcon({ html: step });

    return (
      <div className="map-container">
        <div className="header-name">
          <h1 className="header-title">CurbAlert</h1>
        </div>
        <Map className="map" center={position} zoom={this.state.zoom} ref={this.bindMap}
        style={{display: "inline-block", margin:"0px 1.2rem 0 .5rem", height: "90vh", width: "57vw", border:"2px solid gray", borderRadius: "10px", zIndex:"0"}}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker icon={pinUser} position={position}>
            <Popup>
              <div className="popup">
                <h4 id="current-address">{address.street}, {address.city}, {address.state} {address.zip}</h4>
                <span>You are Here!</span>
              </div>
            </Popup>
          </Marker>

          {Object.keys(route).length > 0 && this.renderStepMarkers(route, pinStep)}

          {polyline.length > 0 &&
            <Polyline positions={polyline}/>
          }

          <PointsLayer items={items} plot={plot} addToDashboard={addToDashboard}/>
        </Map>
      </div>
    )
  }
}
