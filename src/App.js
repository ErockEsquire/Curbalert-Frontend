import React from 'react';
import './App.css';
import Main from './containers/Main'
import Navbar from './containers/Navbar'
import arrayMove from 'array-move';

class App extends React.Component {

  getTime = () => {
    let date = new Date()
    let minute = date.getMinutes()
    if(minute < 10){
      minute = "0" + minute
    }
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
      preview: null,
      claimed: false
    }
  }

  componentDidMount() {
    this.fetchLocation()
    this.fetchItems()
  }

  fetchItems = () => {
    fetch(`http://localhost:3000/items`)
    .then(response => response.json())
    .then(items => {
      let userItems = items.filter(item => item.users[0].id === this.state.user)
      userItems = this.checkRecent(userItems)
      let activeItems = items.filter(item => this.checkDate(item.date) <= 3)
      activeItems = this.checkRecent(activeItems)
      this.setState({
        ...this.state,
        items: activeItems,
        histories: userItems
      }, () => console.log(this.state))
    })
  }

  fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {(this.geolocationCallback(position))}
    )
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
    }, () => this.geoCodeLocation())
  }


  geoCodeLocation = () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLat},${this.state.currentLong}&key=${process.env.REACT_APP_GOOGLE_API}`)
      .then(r => r.json())
      .then(object => {
        const address = object.results[0].formatted_address.split(', ')
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

  checkDate = (date) => {
    const date1 = new Date(date);
    const date2 = new Date();
    return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  checkTime = (time) => {
    let hour = time.match(/\d+/)
    hour = parseInt(hour[0])
    let minute = time.match(/(?<=:)\d+/)
    minute = parseInt(minute[0])
    let meridiem = time.match(/\w+$/ig)
    if(meridiem[0] === "PM"){
        hour += 12
    }
    hour = hour * 60
    let minutes = minute + hour
    return minutes
  }

  checkRecent = (items) => {
    let sorted = items.sort((a,b) => ((this.checkDate(b.date) * 24 * 60) + (this.checkTime(b.time))) - ((this.checkDate(a.date) * 24 * 60) + (this.checkTime(a.time))))
    return sorted
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

  addToDashboard = (item) => {
    if(this.state.dashboard.length < 5) {
      this.setState({
        dashboard: [item, ...this.state.dashboard]
      })
    }
  }

  removeFromDashboard = (itemId) => {
    const dash = this.state.dashboard.filter(item => item.id !== itemId)
    this.setState({
      ...this.state,
      dashboard: dash
    })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({dashboard}) => ({
      ...this.state,
      dashboard: arrayMove(dashboard, oldIndex, newIndex),
    }));
  };

  handleClaim = (item) => {
    item.claimed = true
    
    fetch(`http://localhost:3000/items/${item.id}`, {
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
    newItems = this.checkRecent(newItems)
    this.setState({ 
      items: newItems
    })
  }

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
    URL.revokeObjectURL(this.state.form.preview)

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
    const { name, category, street, city, state, zip, comment, quality, time, date, validation, claimed, final, latitude, longitude, image } = this.state.form
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
    formData.append('user[id]', this.state.user)

    fetch(`http://localhost:3000/items`, {
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
            street: this.state.street_address,
            city: this.state.city_address,
            state: this.state.state_address,
            zip: this.state.zip_address,
            comment: "",
            quality: "",
            time: this.getTime(),
            date: this.getDate(),
            image: null,
            preview: null,
            validation: 0,
            claimed: false,
            final: false,
          }
        }, () => console.log(this.state))
      })
  }

  render() {
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
        user={this.state.user} 
        currentLat={this.state.currentLat} 
        currentLong={this.state.currentLong} 
        items={this.state.items}
        dashboard={this.state.dashboard}
        street={this.state.street_address}
        city={this.state.city_address}
        state={this.state.state_address}
        zip={this.state.zip_address}
        onSortEnd={this.onSortEnd}
        addToDashboard={this.addToDashboard}
        removeFromDashboard={this.removeFromDashboard}
        checkDate={this.checkDate}
        handleClaim={this.handleClaim}
        handleAvail={this.handleAvail}
        fetchLocation={this.fetchLocation}
        checkDistance={this.checkDistance}
        />
      </section>
    );
  }
}

export default App;
