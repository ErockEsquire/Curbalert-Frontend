import React, { useState } from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'

class App extends React.Component {

  state = {
    currentLat: 0,
    currentLong: 0,
    currentLocation: ""
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {(this.geolocationCallback(position))}
    )
  }

  geolocationCallback(position) {
    this.setState({
      currentLat:position.coords.latitude,
      currentLong:position.coords.longitude,
    })
  }

  // geoCodeLocation = () => {
  //     fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLat},${this.state.currentLong}&key=${process.env.REACT_APP_GOOGLE_API}`)
  //     .then(r => r.json())
  //     .then(object => {
  //       console.log(object)
  //       this.setState({
  //       ...this.state, currentLocation: object.results[0].formatted_address
  //     })
  //   })
  // }

  render() {
    return (
      <section id="app">
        <Navbar/>
        <Main currentLat={this.state.currentLat} currentLong={this.state.currentLong}/>
      </section>
    );
  }
}

export default App;
