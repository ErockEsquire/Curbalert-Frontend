import React, { Fragment } from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'
import Login from './components/login'
import Register from './components/register'
import Welcome from './components/welcome'
import arrayMove from 'array-move';
import { checkDate, checkRecent, getTime, getDate} from './components/utils'

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

const BASE_URL = `https://curbalert-api.herokuapp.com/`

class App extends React.Component {

  state = {
    user: "pending",
    show: false,
    items: [],
    histories: [],
    dashboard: [],
    currentLat: 0,
    currentLong: 0,
    searchHistory: "",
    searchActive: "",
    polyline: [],
    route: {},
    routeId: 0,
    plot: [],
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
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
      image: null,
      preview: null,
      claimed: false
    }
  }



  componentDidMount() {
    fetch(BASE_URL + `autologin`, {
      credentials: "include"
    })
      .then(r => {
        if (!r.ok) {
          throw r
        }
        return r.json()
      })
      .then(user => {
        this.setState({
          user: user,
          histories: checkRecent(user.items)
        })
      })
    this.fetchLocation()
    this.fetchItems()
    setTimeout(()=> {
      this.setState({
        show: true
      })
    }, 3000)
  }

  componentDidUpdate(prevProps,prevState,snapshot) {
    if (this.state.user !== prevState.user && this.state.user !== "pending") {
      this.setState({
        histories: checkRecent(this.state.user.items),
        show: false,
        dashboard: checkRecent(this.state.user.dashboard_items),
        currentLat: 0,
        currentLong: 0,
        searchHistory: "",
        searchActive: "",
        polyline: [],
        plot: [],
        route: {},
        routeId: 0,
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
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
          image: null,
          preview: null,
          claimed: false
        }
      })
      this.fetchLocation()
      this.fetchItems()
      setTimeout(()=> {
        this.setState({
          show: true
        })
      }, 3000)
    }
  }

  handleUpdateUser = (user) => {
    this.setState({
      user: user
    })
  }

  fetchItems = () => {
    fetch(BASE_URL + `items`)
    .then(response => response.json())
    .then(items => {
      let activeItems = items.filter(item => checkDate(item.date) <= 3)
      activeItems = checkRecent(activeItems)
      this.setState({
        items: activeItems
      })
    })
  }

  fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {(this.geolocationCallback(position))}
    )
  }

  geolocationCallback(position) {
    this.setState({
      currentLat:position.coords.latitude,
      currentLong:position.coords.longitude,
      form: {
        ...this.state.form,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    }, () => this.geoCodeLocation())
  }
  
  geoCodeLocation = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLat},${this.state.currentLong}&key=${process.env.REACT_APP_GOOGLE_API}`)
    .then(r => r.json())
    .then(object => {
      const address = object.results[0].formatted_address.split(', ')
      this.setState(prevState => ({
        address: {
          ...prevState.form,
          street: address[0],
          city: address[1],
          state: address[2].split(' ')[0],
          zip: address[2].split(' ')[1],
        },
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

  fetchDirections = (item, mode) => {
    var polyUtil = require('polyline-encoded');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {(geolocationCall(position))}
    )

    const geolocationCall = (position) => {
      this.setState({
        currentLat: position.coords.latitude,
        currentLong: position.coords.longitude,
        form: {
          ...this.state.form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      }, () => directionsCall())
    }

    const directionsCall = () => {
      const transitUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.currentLat},${this.state.currentLong}&destination=${item.latitude},${item.longitude}&mode=${mode}&transit_mode=subway&key=${process.env.REACT_APP_GOOGLE_API}`
      const allUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.currentLat},${this.state.currentLong}&destination=${item.latitude},${item.longitude}&mode=${mode}&key=${process.env.REACT_APP_GOOGLE_API}`

      fetch(mode === "transit" ? transitUrl : allUrl)
      .then(r => r.json())
      .then(object => {
        let encoded = object.routes[0].overview_polyline.points
        let polyline = polyUtil.decode(encoded)
        this.setState({
          polyline: polyline,
          route: object.routes[0],
          routeId: item.id
        })
      })
    }
  }

  checkDistance = (item) => {
    function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {
      const R = 6371;
      const dLat = deg2rad(lat2-lat1);
      const dLng = deg2rad(lng2-lng1); 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2)
        ;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c;
      return d;
    }
  
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
  
    return getDistanceFromLatLonInKm(this.state.currentLat, this.state.currentLong, item.latitude, item.longitude)
  }

  plotMarker = (item) => {
    this.setState({
      plot: item
    }, () => setTimeout(this.setState({
      plot: []
    }), 3000))
  }

  addToDashboard = (item) => {
    if(this.state.dashboard.length < 5) {
      this.setState({
        dashboard: [item, ...this.state.dashboard]
      }, () => this.saveToDashboard)
    }
  }

  removeFromDashboard = (itemId) => {
    const dash = this.state.dashboard.filter(item => item.id !== itemId)
    this.setState({
      dashboard: dash
    })
  }

  saveToDashboard = () => {
    const dashboard = this.state.dashboard
    if(dashboard.length > 0) {
      const user = this.state.user
    
      fetch(BASE_URL + `dashboard/${user}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dashboard: dashboard,
          user: user
        })
      });
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({dashboard}) => ({
      dashboard: arrayMove(dashboard, oldIndex, newIndex),
    }));
  };

  handleClaim = (item) => {
    item.claimed = true
    
    fetch(BASE_URL + `items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        claimed: item.claimed
      })
    })
    .then(response => response.json())
    .then(item => {
      this.updateItem(item)
    })
  }

  updateItem = (newItem) => {
    let newItems = this.state.items.filter(item => item.id !== newItem.id)
    let noUpdateItems = newItems.filter(item => item.users[0].id !== newItem.users[0].id)

    let itemsToUpdate = newItems.filter(item => item.users[0].id === newItem.users[0].id)
    let updateItems = itemsToUpdate.map(item => ({...item, users: newItem.users}))
    
    newItems = updateItems.concat(noUpdateItems)

    newItems.push(newItem)
    newItems = checkRecent(newItems)
    this.setState({ 
      items: newItems
    })
  }

  handleSearchHistory = (event) => {
    this.setState({
      searchHistory: event.target.value
    })
  }

  handleSearchActive = (event) => {
    this.setState({
      searchActive: event.target.value
    })
  }

  handleNewItem = (item) => {
    this.setState({
      items: [item, ...this.state.items],
      histories: [item, ...this.state.histories]
    })
  }

  handleChange = (event, value) => {
    const input = value.name
    this.setState({
      form: {
        ...this.state.form,
        [input]: value.value
      }
    })
  }

  handleUpload = (event) => {
    this.setState({
      form: {
        ...this.state.form,
        image: event.target.files[0],
        preview: URL.createObjectURL(event.target.files[0])
      }
    })
  }

  handleDelete = (itemId) => {
    fetch(BASE_URL + `items/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if(response.ok){
          const items = this.state.items.filter(item => item.id !== itemId)
          const histories = this.state.histories.filter(history => history.id !== itemId)
          this.setState({
            items: items,
            histories: histories
          })
        }
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    URL.revokeObjectURL(this.state.form.preview)

    if(this.state.form.street !== this.state.address.street) {
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
    const { name, category, street, city, state, zip, comment, quality, validation, claimed, final, latitude, longitude, image } = this.state.form
    const date = getDate()
    const time = getTime()

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
    formData.append('item[validation]', validation)
    formData.append('item[claimed]', claimed);
    formData.append('item[final]', final);
    formData.append('item[latitude]', latitude);
    formData.append('item[longitude]', longitude);
    formData.append('item[image]', image);
    formData.append('user[id]', this.state.user.id)

    fetch(BASE_URL + `items`, {
      method: "POST",
      body: formData,
      contentType: false,
    })
      .then(response => response.json())
      .then(item => {
        this.addToDashboard(item)
        this.handleNewItem(item)
        this.setState({
          ...this.state,
          form: {
            name: "",
            category: "",
            street: this.state.address.street,
            city: this.state.address.city,
            state: this.state.address.state,
            zip: this.state.address.zip,
            comment: "",
            quality: "",
            image: null,
            preview: null,
            validation: 0,
            claimed: false,
            final: false,
          }
        })
      })
  }

  render() {

    return (
      <section id="app">
        <Router>
          <Route exact path={`/home`} render={() =>
            <main id="main">
              <Welcome user={this.state.user}/>
              {this.state.show &&
              <Fragment>
              <Navbar
                user={this.state.user} 
                handleNewItem={this.handleNewItem}
                histories={this.state.histories}
                form={this.state.form}
                searchHistory={this.state.searchHistory}
                addToDashboard={this.addToDashboard}
                handleChange={this.handleChange}
                handleUpload={this.handleUpload}
                handleSubmit={this.handleSubmit}
                handleDelete={this.handleDelete}
                handleSearchHistory={this.handleSearchHistory}
                handleUpdateUser={this.handleUpdateUser}
                saveToDashboard={this.saveToDashboard}
              />
              <Main
                user={this.state.user} 
                currentLat={this.state.currentLat} 
                currentLong={this.state.currentLong} 
                items={this.state.items}
                dashboard={this.state.dashboard}
                address={this.state.address}
                onSortEnd={this.onSortEnd}
                addToDashboard={this.addToDashboard}
                removeFromDashboard={this.removeFromDashboard}
                handleClaim={this.handleClaim}
                handleAvail={this.handleAvail}
                handleSearchActive={this.handleSearchActive}
                searchActive={this.state.searchActive}
                fetchLocation={this.fetchLocation}
                checkDistance={this.checkDistance}
                fetchDirections={this.fetchDirections}
                polyline={this.state.polyline}
                route={this.state.route}
                routeId={this.state.routeId}
                plotMarker={this.plotMarker}
                plot={this.state.plot}
              />
              </Fragment>}
            </main>
          }/>
          <Route exact path={`/register`} render={routeProps => <Register {...routeProps} user={this.state.user}/>} />
          <Route exact path={`/login`} render={routeProps => <Login {...routeProps} handleUpdateUser={this.handleUpdateUser} user={this.state.user}/>}/>
        </Router>
      </section>
    );
  }
}

export default App;
