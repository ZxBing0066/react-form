import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form, { Item } from '../Form';
import { Input, Checkbox, Select } from '../controllers';

const check = (v, formData) => {
    if (formData.required && !v) {
        return 'required';
    } else if (!formData.required && !v) {
        return;
    } else if (v.length <= 10) {
        return 'at least 10';
    }
};

const checkMap = {
    test: check,
    test1: check,
    test2: check,
    test3: check,
    test4: check,
    test5: check,
    test6: check
};

export class FormSample extends Component {
    static propTypes = {
        useCheckMap: PropTypes.bool
    };

    onChange = (...args) => {
        console.log(...args);
    };

    submit = () => {
        this.form.forceCheckAll();
        console.log(this.form.getFormData(), this.form.isValid());
    };

    render() {
        const { useCheckMap, ...rest } = this.props;

        return (
            <Form
                {...rest}
                checkMap={useCheckMap ? checkMap : null}
                onChange={this.onChange}
                ref={_ref => (this.form = _ref)}
            >
                <div>
                    <label>test: </label>
                    <Input field="test" />
                </div>

                <div>
                    <label>test1: </label>
                    <Input field="test1" />
                </div>
                <div>
                    <label>test2: </label>
                    <Input field="test2" />
                </div>
                <div>
                    <label>test3: </label>
                    <Input field="test3" />
                </div>
                <div>
                    <label>test4: </label>
                    <Input field="test4" />
                </div>
                <Item label="test_item: ">
                    <Input field="test5" />
                    <Input field="test6" />
                </Item>
                <div>
                    <label>choose1: </label>
                    <Select field="choose1">
                        {[1, 2, 3, 4, 5].map(v => (
                            <option value={v} key={v}>
                                {v}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <label>choose2: </label>
                    <Select field="choose2">
                        {[1, 2, 3, 4, 5].map(v => (
                            <option value={v} key={v}>
                                {v}
                            </option>
                        ))}
                    </Select>
                </div>
                <div>
                    <label>required: </label>
                    <Checkbox field="required" />
                </div>
                <div>
                    <button onClick={this.submit} type="button">
                        submit
                    </button>
                </div>
            </Form>
        );
    }
}

const story = () => <FormSample />;

export default story;
