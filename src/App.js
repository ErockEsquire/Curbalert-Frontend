import React, { useState } from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'

class App extends React.Component {

  state = {
    user: 1,
    currentLat: 0,
    currentLong: 0,
    street_address: "",
    city_address: "",
    state_address: "",
    zip_address: "",
    items: [],
    histories: []
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {(this.geolocationCallback(position))}
    )
    fetch(`http://localhost:3000/items`)
      .then(response => response.json())
      .then(items => {
        this.setState({
          ...this.state,
          items: items
        })
      })
    fetch(`http://localhost:3000/items/${this.state.user}`)
      .then(response => response.json())
      .then(items => {
        this.setState({
          ...this.state,
          histories: items
        })
      })
  }

  geolocationCallback(position) {
    this.setState({
      ...this.state,
      currentLat:position.coords.latitude,
      currentLong:position.coords.longitude,
    }, () => this.geoCodeLocation())
  }
  
  geoCodeLocation = () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLat},${this.state.currentLong}&key=${process.env.REACT_APP_GOOGLE_API}`)
      .then(r => r.json())
      .then(object => {
        console.log(object)
        const address = object.results[0].formatted_address.split(', ')
        console.log(address)
        this.setState({
          ...this.state, 
          street_address: address[0],
          city_address: address[1],
          state_address: address[2].split(' ')[0],
          zip_address: address[2].split(' ')[1]
      })
    })
  }

  handleNewItem = (item) => {
    this.setState({
      items: [item, ...this.state.items],
      histories: [item, ...this.state.histories]
    }, () => console.log(this.state))
  }

  render() {
    console.log(this.state)
    return (
      <section id="app">
        <Navbar
        user={this.state.user} 
        handleNewItem={this.handleNewItem} 
        histories={this.state.histories}
        street={this.state.street_address}
        city={this.state.city_address}
        state={this.state.state_address}
        zip={this.state.zip_address}
        latitude={this.state.currentLat}
        longitude={this.state.currentLong}
        />
        <Main currentLat={this.state.currentLat} currentLong={this.state.currentLong} items={this.state.items}/>
      </section>
    );
  }
}

export default App;
