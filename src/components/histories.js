import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import History from './history'

export default class Histories extends React.Component {

  state = {
    searchTerm: ""
  }

  handleSearch = (event) => {
    this.setState({
      searchTerm: event.target.value
    })
  }

  filterHistories = (histories) => {
    return histories.filter(history => {
      return Object.keys(history).some(key => {
        return typeof history[key] === 'string' && history[key].toLowerCase().includes(this.state.searchTerm.toLowerCase())})
    })
  }

  renderHistories = () => {
    return this.filterHistories(this.props.histories).map(history => <History key={history.id} history={history} checkDate={this.props.checkDate} addToDashboard={this.props.addToDashboard} handleDelete={this.props.handleDelete}/>)
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
          <div className="ui icon input">
            <input
            className="prompt"
            placeholder="Search History"
            value={this.state.searchTerm}
            onChange={this.handleSearch}
            />
            <i className="search icon" />
          </div>
          <div className="histories">
            <ul className="histories-list">
              {this.props.histories.length > 0 ? this.renderHistories():<h3>You have no post history</h3>}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}