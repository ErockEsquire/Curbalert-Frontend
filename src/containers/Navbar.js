import React, { useState } from 'react';
import { ReactComponent as ChatIcon } from '../icons/chat.svg'
import { ReactComponent as HistoryIcon } from '../icons/history.svg'
import { ReactComponent as PostIcon } from '../icons/post.svg'
import { ReactComponent as UsernameIcon } from '../icons/username.svg'
import { ReactComponent as SettingsIcon } from '../icons/settings.svg'

import Post from '../components/post'
import History from '../components/history'
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

export default function Navbar() {

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

  return (
    <nav>
      <div id="navbar" className={open ? "navbar-open":"navbar-close"} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <ul className="navbar-list">
          <Username open={open} username={"Erocknine"}><UsernameIcon/></Username>
          <Navitem handleClick={handlePost} open={open} text={"Post"}><PostIcon/></Navitem>
          <Navitem handleClick={handleHistory} open={open} text={"Post History"}><HistoryIcon/></Navitem>
          <Navitem open={open} text={"Chat"}><ChatIcon/></Navitem>
          <Navitem open={open} text={"Settings"}><SettingsIcon/></Navitem>
        </ul>
      </div>

      <Post tab={post} handleClick={setPost}/>
      <History tab={history} handleClick={setHistory}/>
    </nav>
  )
}

{/* <div className={post ? "postbar-open":"postbar-close"}>
  <div className="post">
    <div className="post-header">
      <span>Post </span>
      <div className="xicon" onClick={() => setPost(false)}><XIcon/></div>
    </div>
    <form className="post-form">

    </form>
  </div>
</div> */}