import React from 'react';
import Form, { Item } from '../Form';
import { Input } from '../controllers';

const inputCheck = v => {
    if (v == undefined || !v.length) {
        return 'must fill this input';
    } else if (v.length > 10) {
        return 'max length 10';
    } else if (v.length < 6) {
        return 'min length 6';
    }
};

const checkMap = {
    input: inputCheck,
    input_1: inputCheck,
    input_2: inputCheck
};

const simple = () => {
    return (
        <Form
            checkMap={checkMap}
            onChange={(formData, oldFormData, isValid) => {
                console.log('onChange', formData, oldFormData, isValid);
            }}
            onSubmit={(formData, isValid) => {
                console.log('onSubmit', formData, isValid);
            }}
        >
            <Item label="one_input">
                <Input field="input" />
            </Item>
            <Item label="two input">
                <Input field="input_1" />
                <Input field="input_2" />
            </Item>
            <button type="submit">submit form data</button>
        </Form>
    );
};

export default simple;
