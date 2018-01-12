import React from 'react';
import Form, { Item } from '../Form';
import { Input } from '../controllers';

const other = () => {
    return (
        <Form
            onChange={console.log.bind(console)}
            onSubmit={(...args) => {
                console.log(...args);
            }}
        >
            <Item label="one_input">
                <Input field="input" />
            </Item>
            <Item label="two input">
                <Input field="input_1" />
                <Input field="input_2" />
            </Item>
            <button type="submit">print form data</button>
        </Form>
    );
};

export default other;
