import React from 'react'
import { ReactComponent as XIcon } from '../icons/x.svg'
import { CSSTransition } from "react-transition-group";
import { Form } from 'semantic-ui-react'

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

  render() {
    const { tab, handleClick, handleChange, handleUpload, handleSubmit } = this.props
    const { name, street, city, state, zip, comment, quality } = this.props.form
    return (
      <div className={tab ? "postbar-open":"postbar-close"}>
        <div className={tab ? "post-open":"post-close"}>
          <div className="post-header">
            <span>Post</span>
            <div className="xicon" onClick={() => handleClick(false)}><XIcon/></div>
          </div>
          <CSSTransition in={tab} timeout={400} classNames="display" unmountOnExit>
            <form className="post-form" onSubmit={handleSubmit}>
            <Form.Group widths='equal'>
              <Form.Input placeholder="Name of item" name="name" value={name} onChange={handleChange}/>
              <label>Image</label>
              <input className="field" type="file" name="image" onChange={handleUpload}/>
              <div className="form-address">
                <Form.Input placeholder="Street Address" name="street" value={street} onChange={handleChange}/>
                <Form.Input placeholder="City" name="city" value={city} onChange={handleChange} style={{width: '7rem', color: 'white'}}/>
                <Form.Input placeholder="State" name="state" value={state} onChange={handleChange} maxLength="2" style={{width: '4.5rem', color: 'white'}}/>
                <Form.Input placeholder="Zip" name="zip" value={zip} onChange={handleChange} maxLength="5" style={{width: '5.5rem', color: 'white'}}/>
              </div>
              <Form.Group inline>
                <Form.Radio label='New' name="quality" value="new" checked={quality==="new"} onChange={handleChange}/>
                <Form.Radio label='Like New' name="quality" value="like new" checked={quality==="like new"} onChange={handleChange}/>
                <Form.Radio label='Used' name="quality" value="used" checked={quality==="used"} onChange={handleChange}/>
              </Form.Group>
              <Form.Select fluid options={categories} placeholder="Category" name="category" onChange={handleChange}/>
              <Form.TextArea placeholder="Description" name="comment" value={comment} onChange={handleChange}/>
            </Form.Group>
            <Form.Button onClick={() => handleClick(false)}>Post</Form.Button>
            </form>
          </CSSTransition>
        </div>
      </div>
    )
  }
}