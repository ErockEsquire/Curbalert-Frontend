import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import History from './history'

export default class Histories extends React.Component {

  renderHistories = () => {
    return this.props.histories.map(history => <History history={history}/>)
  }

  render() {
    const { tab, handleClick } = this.props
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>History</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <div className="histories">
            {this.props.histories.length > 0 ? this.renderHistories():<h3>You have no post history</h3>}
          </div>
        </div>
      </div>
    )
  }
}