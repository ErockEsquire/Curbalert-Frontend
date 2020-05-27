import React from 'react';
import {Button} from 'semantic-ui-react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from "react-router-dom";

export default class Login extends React.Component {
  state = {
    entry: "",
    password: "",
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    fetch(`https://curbalert-api.herokuapp.com/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(r => {
        if (!r.ok) {
          alert('u no get in ')
          throw r
        }
        return r.json()
      }
      )
      .then(user => {
        console.log(this.props)
        console.log(user)
        this.props.handleUpdateUser(user)
        this.props.history.push("/home")
      })
      .catch(console.error)
  }

  render() {
    const { entry, password } = this.state
    console.log(this.props.user)
    return (
      <div id="login" className="form-container">
        {this.props.user !== "pending" && <Redirect to="/home"/>}
        <h1 className="header-title">CurbAlert</h1>
        <div className="entry-form">
          <h3>Login</h3>
          <Button className="login-register-button" type='submit'><Link to="/register">Register</Link></Button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>Email/Username:</label>
          <input type="text" name="entry" onChange={this.handleInputChange} value={entry} />
          <label>Password:</label>
          <input type="password" name="password" onChange={this.handleInputChange} value={password} />
          <Button type='submit'>Submit</Button>
        </form>
      </div>
    )
  }
}