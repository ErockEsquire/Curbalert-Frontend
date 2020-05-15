import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import { CSSTransition } from "react-transition-group";
import { Form } from 'semantic-ui-react'

const getTime = () => {
  let date = new Date()
  let minute = date.getMinutes()
  let meridiem = "AM"
  let hour = date.getHours()
  if(hour > 12){
    hour -= 12
    meridiem = "PM"
  } 
  return `${hour}:${minute} ${meridiem}`
}

const getDate = () => {
  let date = new Date()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let year = date.getFullYear()
  return `${month}/${day}/${year}`
}

const categories = [
  { key: 'a', text: 'Appliances', value: 'appliances'},
  { key: 'b', text: 'Books', value: 'books'},
  { key: 'c', text: 'Clothing', value: 'clothing'},
  { key: 'e', text: 'Electronics', value: 'electronics'},
  { key: 'f', text: 'Furniture', value: 'furniture'},
  { key: 'p', text: 'Plants', value: 'plants'},
  { key: 's', text: 'Sports', value: 'sports'},
  { key: 't', text: 'Toys', value: 'toys'},
  { key: 'm', text: 'Misc', value: 'misc'},
]

export default class Post extends React.Component {

  state = {
    name: "",
    category: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    latitude: "",
    longitude: "",
    comment: "",
    quality: "",
    time: getTime(),
    date: getDate(),
    image: null,
    claimed: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props !== prevProps) {
      this.setState({
        ...this.state,
        street: this.props.street,
        city: this.props.city,
        state: this.props.state,
        zip: this.props.zip,
        latitude: this.props.latitude,
        longitude: this.props.longitude
      })
    }
  }
  
  handleChange = (event, value) => {
    const input = value.name
    this.setState({
      [input]: value.value
    })
  }

  handleUpload = event => {
    this.setState({
      image: event.target.files[0]
    })
  }

  submitForm = () => {
    const formData = new FormData();
    formData.append('item[name]', this.state.name);
    formData.append('item[category]', this.state.category);
    formData.append('item[street_address]', this.state.street);
    formData.append('item[city_address]', this.state.city);
    formData.append('item[state_address]', this.state.state);
    formData.append('item[zip_address]', this.state.zip);
    formData.append('item[comment]', this.state.comment);
    formData.append('item[quality]', this.state.quality);
    formData.append('item[time]', this.state.time);
    formData.append('item[date]', this.state.date);
    formData.append('item[claimed]', this.state.claimed);
    formData.append('item[latitude]', this.state.latitude);
    formData.append('item[longitude]', this.state.longitude);
    formData.append('item[image]', this.state.image);
    formData.append('user[id]', this.props.user)
  
    fetch(`http://localhost:3000/items`, {
      method: "POST",
      body: formData,
      contentType: false,
    })
      .then(response => response.json())
      .then(item => {
        console.log(item)
        this.props.handleNewItem(item)
        this.props.handleClick(false)
        this.setState({
          name: "",
          category: "",
          street: this.props.street,
          city: this.props.city,
          state: this.props.state,
          zip: this.props.zip,
          comment: "",
          quality: "",
          time: getTime(),
          date: getDate(),
          image: null,
          claimed: false,
        })
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if(this.props.street !== this.state.street && this.props.city !== this.state.city) {
      const street = this.state.street.replace(/ /g, '+')
      const city = this.state.city.replace(/ /g, '+')
      const state = this.state.state
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=${process.env.REACT_APP_GOOGLE_API}`)
        .then(response => response.json())
        .then(object => {
          this.setState({
            latitude: object.results[0].geometry.location.lat,
            longitude: object.results[0].geometry.location.lng
          }, () => console.log(object),() => this.submitForm())
        })
    }
  }

  render() {
    const { tab, handleClick } = this.props
    const value = this.state.quality
    console.log(this.state)
    console.log(this.props)
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>Post</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <CSSTransition in={tab} timeout={400} classNames="display" unmountOnExit>
            <form className="post-form" onSubmit={this.handleSubmit}>
            <Form.Group widths='equal'>
              <Form.Input placeholder="Name of item" name="name" value={this.state.name} onChange={this.handleChange}/>
              <label>Image</label>
              <input className="field" type="file" name="image" onChange={this.handleUpload}/>
              <div className="form-address">
                <Form.Input placeholder="Street Address" name="street" value={this.state.street} onChange={this.handleChange}/>
                <Form.Input placeholder="City" name="city" value={this.state.city} onChange={this.handleChange} style={{width: '7rem', color: 'white'}}/>
                <Form.Input placeholder="State" name="state" value={this.state.state} onChange={this.handleChange} maxLength="2" style={{width: '4.5rem', color: 'white'}}/>
                <Form.Input placeholder="Zip" name="zip" value={this.state.zip} onChange={this.handleChange} maxLength="5" style={{width: '5.5rem', color: 'white'}}/>
              </div>
              <Form.Group inline>
                <Form.Radio label='New' name="quality" value="new" checked={value==="new"} onChange={this.handleChange}/>
                <Form.Radio label='Like New' name="quality" value="like new" checked={value==="like new"} onChange={this.handleChange}/>
                <Form.Radio label='Used' name="quality" value="used" checked={value==="used"} onChange={this.handleChange}/>
              </Form.Group>
              <Form.Select fluid options={categories} placeholder="Category" name="category" onChange={this.handleChange}/>
              <Form.TextArea placeholder="Description" name="comment" value={this.state.comment} onChange={this.handleChange}/>
            </Form.Group>
            <Form.Button>Post</Form.Button>
            </form>
          </CSSTransition>
        </div>
      </div>
    )
  }
}