import React, { Component } from 'react'
import { formHoc, itemHoc } from '../index.jsx'
import { Input, Select } from '../src/controllers.jsx'
import { each } from 'lodash'

const unControlledDefaultFormData = {
    username: 'username',
    password: 'password',
    username2: 'username2',
    password2: 'password2'
}

const checkMap = {
    username: v => v && v.length > 5,
    password: v => v && v.length > 6,
    username2: v => {
        if (!v) {
            return 'Please input the username2'
        }
        if (v.length < 6) {
            return 'Input lenght should at least 6'
        }
        return true
    },
    password2: v => v && v.length > 6
}
const formMap = {}

let Form = (props) => {
    return <form {...props} />
}
Form = formHoc(Form)

let Item = ({ label, children, help, ...rest }) => {
    let helpText = ''
    each(help, _help => {
        console.log(helpText, _help)
        _help && (helpText += _help)
    })
    return (
        <div {...rest}>
            <label>{label}</label>
            {children}
            <span>{helpText}</span>
        </div>
    )
}

Item = itemHoc(Item)

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
    submit = () => {
        if (this.unControlledForm.isValid) {
            console.log('The uncontrolled form check pass, success')
        } else {
            console.log('The uncontrolled form check error, please check')
        }
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
                    checkMap={checkMap}
                    autoCheck
                >
                    <Input type='text' name='username' />
                    <Input type='password' name='password' />
                    <Select name='age'>
                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                    </Select>
                    <Item>
                        <Input type='text' name='username2' />
                        <Input type='password' name='password2' />
                    </Item>
                    <input />
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
                    autoCheck
                >
                    <Input type='text' name='username' />
                    <Input type='password' name='password' />
                    <input />
                </Form>
                <button onClick={this.print}>print form data</button>
                <button onClick={this.submit}>check form data</button>
            </div>
        )
    }
}

export default App