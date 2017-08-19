import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formHoc, itemHoc } from '../index.jsx';
import { Input, Select, Checkbox } from '../src/controllers.jsx';
import { each } from 'lodash';

let Form = props => {
    return <form {...props} />;
};
Form = formHoc(Form);

let Item = ({ label, children, help, ...rest }) => {
    let helpText = '';
    each(help, _help => {
        _help && (helpText += _help);
    });
    return (
        <div {...rest}>
            <label>
                {label}
            </label>
            {children}
            <span>
                {helpText}
            </span>
        </div>
    );
};

Item.propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    help: PropTypes.object
};

Item = itemHoc(Item);

const defaultFormData = {
    username: 'username',
    password: 'password',
    username2: 'username2',
    password2: 'password2',
    age: 3
};

const defaultHelpMap = {
    username2: 'please input you username'
};

const checkMap = {
    username: v => v && v.length > 5,
    password: v => v && v.length > 6,
    username2: v => {
        if (!v) {
            return 'Please input the username2';
        }
        if (v.length < 6) {
            return 'Input lenght should at least 6';
        }
        return true;
    },
    password2: v => v && v.length > 6,
    required_input: (v, currentFormData) => {
        if (currentFormData.is_required && (!v || !v.length)) {
            return 'Input is required';
        }
        return true;
    }
};

class App extends Component {
    constructor(props) {
        super(props);
    }
    onChange = (name, value, currentFormData) => {
        console.log(name, value, currentFormData);
    };
    loadFormData = () => {
        const formData = {
            username: 'user',
            password: '1234',
            username2: 'user2',
            password2: '12345',
            age: '3'
        };
        this.form.setFormData(formData);
    };
    print = () => {
        console.log('Form data is ', this.form.serializeArray);
    };
    submit = () => {
        if (this.form.isValid) {
            console.log('The form check pass, success');
        } else {
            console.log('The form check error, please check');
        }
    };
    render() {
        return (
            <div>
                <title>form</title>
                <Form
                    onChange={this.onChange}
                    defaultFormData={defaultFormData}
                    defaultHelpMap={defaultHelpMap}
                    checkMap={checkMap}
                    ref={_ref => (this.form = _ref)}
                    autoCheckController
                >
                    <Input type="text" name="username" />
                    <Input type="password" name="password" />
                    <Select name="age">
                        {[1, 2, 3, 4, 5].map(v =>
                            <option key={v} value={v}>
                                {v}
                            </option>
                        )}
                    </Select>
                    <Item>
                        <Input type="text" name="username2" />
                        <br />
                        <Input type="password" name="password2" />
                    </Item>
                    <Item>
                        <Input name="required_input" />
                    </Item>
                    <Checkbox name="is_required" />
                    <Input type="text" name="no_default_value" />
                </Form>
                <button onClick={this.loadFormData}>load form data</button>
                <button onClick={this.print}>print form data</button>
                <button onClick={this.submit}>check form data</button>
            </div>
        );
    }
}
export default App;
