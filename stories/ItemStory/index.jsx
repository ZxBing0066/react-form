import React, { Component } from 'react';
import Form, { Item } from '../Form';
import { Input } from '../controllers';

const inputCheck = v => {
    if (v == undefined || !v.length) {
        return 'must fill this input';
    } else if (v.length > 10) {
        return 'max length 10';
    } else if (v.length < 6) {
        return 'min length 6';
    } else {
        return true;
    }
};

const checkMap = {
    input: inputCheck,
    input_1: inputCheck,
    input_2: inputCheck
};

export default class ItemStory extends Component {
    constructor(props) {
        super(props);
    }
    onChange = (name, value, newFormData, oldFormData) => {
        console.log(name, value, newFormData, oldFormData);
    };
    print = () => {
        console.log('Form data is ', this.form.getFormData());
    };
    render() {
        return (
            <div>
                <h1>Story of Item</h1>
                <Form onChange={this.onChange} ref={_ref => (this.form = _ref)} checkMap={checkMap} autoCheckController>
                    <Item label="one_input">
                        <Input name="input" />
                    </Item>
                    <Item label="two input">
                        <Input name="input_1" />
                        <Input name="input_2" />
                    </Item>
                </Form>
                <button onClick={this.loadFormData}>load form data</button>
                <button onClick={this.print}>print form data</button>
            </div>
        );
    }
}
