import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import { CSSTransition } from "react-transition-group";
import { Form } from 'semantic-ui-react'

const initialState = {
  name: "",
  category: "",
  address: "",
  comment: "",
  quantity: "",
  claimed: false,
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

  state = initialState
  
  handleChange = (e, { value }) => this.setState({ value })

  render() {
    const { tab, handleClick } = this.props
    const { value } = this.state
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>Post</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <CSSTransition in={tab} timeout={400} classNames="display" unmountOnExit>
            <form className="post-form">
            <Form.Group widths='equal'>
              <Form.Input placeholder="Name of item" />
              <Form.Input placeholder="Address" />
              <Form.Group inline>
                <Form.Radio label='New' value='new' checked={value === 'new'} onChange={this.handleChange}/>
                <Form.Radio label='Like New' value='like_new' checked={value === 'like_new'} onChange={this.handleChange}/>
                <Form.Radio label='Used' value='used' checked={value === 'used'} onChange={this.handleChange}/>
              </Form.Group>
              <Form.Select fluid multiple selection options={categories} placeholder="Category" value={this.state.category}/>
              <Form.TextArea placeholder="Description"/>
            </Form.Group>
            <Form.Button>Post</Form.Button>
            </form>
          </CSSTransition>
        </div>
      </div>
    )
  }
}