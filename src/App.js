import React, { useState } from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'
import arrayMove from 'array-move';

class App extends React.Component {

  getTime = () => {
    let date = new Date()
    let minute = date.getMinutes()
    let meridiem = "AM"
    let hour = date.getHours()
    if(hour > 12){
      hour -= 12
      meridiem = "PM"
    } else if(hour === 0) {
      hour = 12
    }
    return `${hour}:${minute} ${meridiem}`
  }
  
  getDate = () => {
    let date = new Date()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  state = {
    user: 1,
    currentLat: 0,
    currentLong: 0,
    items: [],
    histories: [],
    dashboard: [],
    street_address: "",
    city_address: "",
    state_address: "",
    zip_address: "",
    form: {
      name: "",
      category: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      latitude: 0,
      longitude: 0,
      comment: "",
      quality: "",
      time: this.getTime(),
      date: this.getDate(),
      image: null,
      claimed: false,
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {(this.geolocationCallback(position))}
    )
    this.fetchItems()
    this.fetchHistories()
  }

  geolocationCallback(position) {
    this.setState({
      ...this.state,
      currentLat:position.coords.latitude,
      currentLong:position.coords.longitude,
      form: {
        ...this.state.form,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    })
  }

  // , () => this.geoCodeLocation()
  
  geoCodeLocation = () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLat},${this.state.currentLong}&key=${process.env.REACT_APP_GOOGLE_API}`)
      .then(r => r.json())
      .then(object => {
        console.log(object)
        const address = object.results[0].formatted_address.split(', ')
        console.log(address)
        this.setState(prevState => ({
          street_address: address[0],
          city_address: address[1],
          state_address: address[2].split(' ')[0],
          zip_address: address[2].split(' ')[1],
          form: {
            ...prevState.form,
            street: address[0],
            city: address[1],
            state: address[2].split(' ')[0],
            zip: address[2].split(' ')[1]
          }
        }))
    })
  }

  fetchItems = () => {
    fetch(`http://localhost:3000/items`)
    .then(response => response.json())
    .then(items => {
      const activeItems = items.filter(item => this.checkDate(item.date) <= 3)
      this.setState({
        ...this.state,
        items: activeItems.reverse()
      })
    })
  }

  fetchHistories = () => {
    fetch(`http://localhost:3000/${this.state.user}/items`)
    .then(response => response.json())
    .then(items => {
      this.setState({
        ...this.state,
        histories: items.reverse()
      })
    })
  }

  checkDate = (date) => {
    const date1 = new Date(date);
    const date2 = new Date();
    return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  addToDashboard = () => {

  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      ...this.state,
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };

  handleNewItem = (item) => {
    this.setState({
      items: [item, ...this.state.items],
      histories: [item, ...this.state.histories]
    }, () => console.log(this.state))
  }

  handleChange = (event, value) => {
    const input = value.name
    this.setState({
      form: {
        ...this.state.form,
        [input]: value.value
      }
    }, () => console.log(this.state))
  }

  handleUpload = event => {
    this.setState({
      form: {
        ...this.state.form,
        image: event.target.files[0]
      }
    })
  }

  handleDelete = (itemId) => {
    fetch(`http://localhost:3000/items/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if(response.ok){
          const items = this.state.items.filter(item => item.id !== itemId)
          const histories = this.state.histories.filter(history => history.id !== itemId)
          this.setState({
            ...this.state,
            items: items,
            histories: histories
          })
        }
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log(this.state.form)
    console.log(this.state.form.street)
    console.log(this.state.street_address)
    if(this.state.form.street !== this.state.street_address) {
      const street = this.state.form.street.replace(/ /g, '+')
      const city = this.state.form.city.replace(/ /g, '+')
      const state = this.state.form.state
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=${process.env.REACT_APP_GOOGLE_API}`)
        .then(response => response.json())
        .then(object => {
          this.setState({
            form: {
              ...this.state.form,
              latitude: object.results[0].geometry.location.lat,
              longitude: object.results[0].geometry.location.lng
            }
          }, () => this.submitForm())
        })
    } else {
      this.submitForm()
    }
  }

  submitForm = () => {
    const { name, category, street, city, state, zip, comment, quality, time, date, claimed, latitude, longitude, image } = this.state.form
    const formData = new FormData();
    formData.append('item[name]', name);
    formData.append('item[category]', category);
    formData.append('item[street_address]', street);
    formData.append('item[city_address]', city);
    formData.append('item[state_address]', state);
    formData.append('item[zip_address]', zip);
    formData.append('item[comment]', comment);
    formData.append('item[quality]', quality);
    formData.append('item[time]', time);
    formData.append('item[date]', date);
    formData.append('item[claimed]', claimed);
    formData.append('item[latitude]', latitude);
    formData.append('item[longitude]', longitude);
    formData.append('item[image]', image);
    formData.append('user[id]', this.state.user)
    console.log(formData)

    fetch(`http://localhost:3000/items`, {
      method: "POST",
      body: formData,
      contentType: false,
    })
      .then(response => response.json())
      .then(item => {
        console.log(item)
        this.handleNewItem(item)
        this.setState({
          ...this.state,
          form: {
            name: "",
            category: "",
            street: this.state.street_address,
            city: this.state.city_address,
            state: this.state.state_address,
            zip: this.state.zip_address,
            comment: "",
            quality: "",
            time: this.getTime(),
            date: this.getDate(),
            image: null,
            claimed: false,
            ...this.state.form
          }
        }, () => console.log(this.state))
      })
  }

  render() {
    console.log(this.state)
    return (
      <section id="app">
        <Navbar
        user={this.state.user} 
        handleNewItem={this.handleNewItem}
        checkDate={this.checkDate}
        histories={this.state.histories}
        form={this.state.form}
        latitude={this.state.currentLat}
        longitude={this.state.currentLong}
        addToDashboard={this.addToDashboard}
        handleChange={this.handleChange}
        handleUpload={this.handleUpload}
        handleSubmit={this.handleSubmit}
        handleDelete={this.handleDelete}
        />
        <Main 
        currentLat={this.state.currentLat} 
        currentLong={this.state.currentLong} 
        items={this.state.items}
        street={this.state.street_address}
        city={this.state.city_address}
        state={this.state.state_address}
        zip={this.state.zip_address}
        onSortEnd={this.onSortEnd}
        />
      </section>
    );
  }
}

export default App;
