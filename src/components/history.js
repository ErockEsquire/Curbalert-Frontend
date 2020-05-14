import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'

export default class Post extends React.Component {

  render() {
    const { tab, handleClick } = this.props
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>History</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <form className="post-form">
            
          </form>
        </div>
      </div>
    )
  }
}