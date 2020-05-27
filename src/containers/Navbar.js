import React, { useState } from 'react';
import { ReactComponent as HistoryIcon } from '../icons/history.svg'
import { ReactComponent as PostIcon } from '../icons/post.svg'
import { ReactComponent as UsernameIcon } from '../icons/username.svg'
import { ReactComponent as MeteorIcon } from '../icons/meteor.svg'
import { BrowserRouter as Link } from "react-router-dom";

import Post from '../components/post'
import Histories from '../components/histories'
import Navitem from '../components/navitem'

const Username = (props) => {
  return (
    <li id="username" className="nav-item">
      <div className="nav-tab">
        <span className={props.open ? "nav-text-open":"nav-text-close"}>{props.username}</span>
        {props.children}
      </div>
    </li>
  )
}

export default function Navbar(props) {
  const { user, handleNewItem, histories, form, searchHistory, addToDashboard, handleChange, handleUpload, handleSubmit, handleDelete, handleSearchHistory, handleUpdateUser, saveToDashboard } = props
  
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState(false);
  const [history, setHistory] = useState(false);

  const handlePost = () => {
    setOpen(false)
    setHistory(false)
    setPost(!post)
  }

  const handleHistory = () => {
    setOpen(false)
    setPost(false)
    setHistory(!history)
  }

  const handleLogout = () => {
    saveToDashboard()
    fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(r => r.json())
      .then(() => {
        handleUpdateUser("pending")
      })
  }

  return (
    <nav>
      <div id="navbar" className={open ? "navbar-open":"navbar-close"} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <ul className="navbar-list">
          <Username open={open} username={user.username}><UsernameIcon/></Username>
          <Navitem handleClick={handlePost} open={open} text={"Post"}><PostIcon/></Navitem>
          <Navitem handleClick={handleHistory} open={open} text={"Post History"}><HistoryIcon/></Navitem>
          {/* <Navitem open={open} text={"Chat"}><ChatIcon/></Navitem> */}
          <Navitem handleClick={handleLogout} open={open} text={"Signout"}><Link to="/login"><MeteorIcon/></Link></Navitem>
        </ul>
      </div>

      <Post 
      tab={post} 
      handleClick={setPost} 
      user={user} 
      handleNewItem={handleNewItem}
      form={form}
      handleChange={handleChange}
      handleUpload={handleUpload}
      handleSubmit={handleSubmit}
      />
      <Histories 
      tab={history} 
      histories={histories}
      searchHistory={searchHistory}
      addToDashboard={addToDashboard}  
      handleClick={setHistory} 
      handleDelete={handleDelete}
      handleSearchHistory={handleSearchHistory}
      />
    </nav>
  )
}
