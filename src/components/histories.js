import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import { Search } from 'semantic-ui-react'
import History from './history'

export default class Histories extends React.Component {

  state = {
    searchTerm: "",
    histories: []
  }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps) {
      this.setState({
        histories: this.props.histories
      })
    }
  }

  handleSearch = (event) => {
    console.log(event.target)
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
    return this.filterHistories(this.state.histories).reverse().map(history => <History key={history.id} history={history} checkDate={this.props.checkDate}/>)
  }
  
  render() {
    const { tab, handleClick } = this.props
    console.log(this.state)
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>History</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <Search
          placeholder="Search History"
          value={this.state.searchTerm}
          onChange={this.handleSearch}
          />
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