import React from 'react';
import PropTypes from 'prop-types';
import { itemWrapper } from 'z-react-form';
import map from 'lodash/map';
import Form, { Help } from '../Form';
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

let ItemWithChildrenField = ({ label, children, childrenField, form, ...rest }) => {
    return (
        <div {...rest}>
            <div>
                <label>{label}</label>
                {children}
            </div>
            <Help
                help={map(childrenField, field => ({
                    field,
                    isDirty: form.isFieldDirty(field),
                    isValid: form.isFieldValid(field),
                    help: form.getFieldHelp(field)
                }))}
            />
        </div>
    );
};

ItemWithChildrenField.propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    childrenField: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired
};

ItemWithChildrenField = itemWrapper(ItemWithChildrenField);

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
            <ItemWithChildrenField label="one_input">
                <Input field="input" />
            </ItemWithChildrenField>
            <ItemWithChildrenField label="two input">
                <Input field="input_1" />
                <Input field="input_2" />
            </ItemWithChildrenField>
            <button type="submit">submit form data</button>
        </Form>
    );
};

export default simple;
