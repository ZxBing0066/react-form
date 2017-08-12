import React, { Component } from 'react'
import { formHoc } from '../index.jsx'
import { Input } from '../src/controllers.jsx'

const unControlledDefaultFormData = {
    username: 'username',
    password: 'password'
}

const checkMap = {}
const formMap = {}

let Form = (props) => {
    return <form {...props} />
}
Form = formHoc(Form)

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            controlledFormData: {
                username: 'username',
                password: 'password'
            }
        }
    }
    print = () => {
        console.log('Form data of uncontrolled form is ', this.unControlledForm.serializeArray)

        console.log('Form data of controlled form is ', this.controlledForm.serializeArray)
    }
    onControlledFormChange(name, value) {
        this.state.controlledFormData[name] = value
        this.setState({
            controlledFormData: this.state.controlledFormData
        })
    }
    render() {
        return (
            <div>
                <title>uncontrolled form</title>
                {/* uncontrolled form */}
                <Form
                    onChange={(name, value) => {
                        console.log(name, value)
                    }}
                    defaultFormData={unControlledDefaultFormData}
                    ref={_ref => this.unControlledForm = _ref}
                >
                    <Input type='text' name='username' />
                    <Input type='password' name='password' />
                    <Input />
                </Form>
                <title>controlled form</title>
                {/* controlled form */}
                <Form
                    onChange={(name, value) => {
                        console.log(name, value)
                        this.onControlledFormChange(name, value)
                    }}
                    formData={this.state.controlledFormData}
                    ref={_ref => this.controlledForm = _ref}
                >
                    <Input type='text' name='username' />
                    <Input type='password' name='password' />
                    <Input />
                </Form>
                <button onClick={this.print}>print form data</button>
            </div>
        )
    }
}

export default App