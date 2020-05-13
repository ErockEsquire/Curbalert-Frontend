import React, { useState } from 'react';
import { ReactComponent as ChatIcon } from '../icons/chat.svg'
import { ReactComponent as HistoryIcon } from '../icons/history.svg'
import { ReactComponent as PostIcon } from '../icons/post.svg'
import { ReactComponent as UsernameIcon } from '../icons/username.svg'
import { ReactComponent as SettingsIcon } from '../icons/settings.svg'
import Post from '../components/post'
import Navitem from '../components/navitem'

const Username = (props) => {
  return (
    <li id="username" className="nav-item">
      <div className="nav-tab">
        <span className="nav-text">{props.username}</span>
        <UsernameIcon/>
      </div>
    </li>
  )
}

export default function Navbar() {

  const [post, setPost] = useState(false);

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <Username username={"Erocknine"}/>
        <Navitem text={"Post"} handleClick={() => setPost(!post)}><PostIcon/></Navitem>
        {post && <Post/>}
        <Navitem text={"Post History"}><HistoryIcon/></Navitem>
        <Navitem text={"Chat"}><ChatIcon/></Navitem>
        <Navitem text={"Settings"}><SettingsIcon/></Navitem>
      </ul>
    </div>
  )
}