import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from "react-router-dom";
import {Button} from 'semantic-ui-react'

export default class Register extends React.Component {
  state = {
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: ""
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.state.password === this.state.password_confirmation) {
      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
      })
      .then(r => {
        if (!r.ok) {
          alert('hey you did something wrong')
          throw r
        }
        return r.json()
      })
      .then(user => { // console.log(user) add logic here to make sure user gets re rendered to register page if invalid sign up
        this.props.history.push("/login")
      })
      .catch(console.error)
    } else {
      alert("Your passwords do not match.")
    }
  }

  render() {
    const { email, username, first_name, last_name, password, password_confirmation } = this.state
    return (
      <div className="form-container">
      {this.props.user !== "pending" && <Redirect to="/home" />}
        <h1 className="header-title">CurbAlert</h1>
        <div className="entry-form">
          <h3>Register</h3>
          <Button className="login-register-button" type='submit'><Link to="/login">Login</Link></Button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>Email:</label>
          <input type="text" placeholder="example@exp.com" name="email" onChange={this.handleInputChange} value={email} />
          <label>Username:</label>
          <input type="text" placeholder="username" name="username" onChange={this.handleInputChange} value={username} maxlength="12"/>
          <label>First Name:</label>
          <input type="text" placeholder="e.g. John" name="first_name" onChange={this.handleInputChange} value={first_name} />
          <label>Last Name:</label>
          <input type="text" placeholder="e.g. Doe" name="last_name" onChange={this.handleInputChange} value={last_name} />
          <label>Password:</label>
          <input type="password" placeholder="Must have 8 to 20 characters" name="password" onChange={this.handleInputChange} value={password} />
          <label> Confirm Password:</label>
          <input type="password" placeholder="Please don't use 'password'"name="password_confirmation" onChange={this.handleInputChange} value={password_confirmation} />
          <Button type='submit'>Submit</Button>
        </form>
      </div>
    )
  }
}