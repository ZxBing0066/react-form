import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form, { Item } from '../Form';
import { Input, Checkbox } from '../controllers';

const checkMap = {
    test: (v, formData) => {
        console.log(v);
        if (!v && formData.required) {
            return 'required';
        }
        return v.length > 10 ? true : 'at least 10';
    }
};

export class FormSample extends Component {
    static propTypes = {
        useCheckMap: PropTypes.bool
    };

    render() {
        const { useCheckMap, ...rest } = this.props;

        return (
            <Form {...rest} checkMap={useCheckMap ? checkMap : null}>
                <Item>
                    <label>test: </label>
                    <Input name="test" />
                </Item>
                <Item>
                    <label>required: </label>
                    <Checkbox name="required" />
                </Item>
            </Form>
        );
    }
}

export default FormSample;
