import React, { Component } from 'react'
import Form from '../index.jsx'
import controllers from '../src/controllers.jsx'

let { Input } = controllers

class App extends Component {
    render() {
        return (
            <Form
                onChange={(name, value) => {
                    console.log(name, value, this.form.serializeArray)
                }}
                ref={_ref => this.form = _ref}
            >
                <Form.Item>
                    <Input type='text' name='username' />
                    <Input type='password' name='password' />
                    <Input />
                </Form.Item>
            </Form>
        )
    }
}

export default App