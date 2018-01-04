import React, { Component } from 'react';
import Form from '../Form';
import { IPInput, Input } from '../controllers';

export default class ControllerStroy extends Component {
    constructor(props) {
        super(props);
    }
    onChange = (name, value, newFormData, oldFormData) => {
        console.log(name, value, newFormData, oldFormData);
    };
    loadFormData = () => {
        const formData = {
            ip: ['2.2.2.2', '3.3.3.3']
        };
        this.form.setFormData(formData);
    };
    print = () => {
        console.log('Form data is ', this.form.getFormData());
    };
    render() {
        return (
            <div>
                <h1>Setter and Getter</h1>
                <Form onChange={this.onChange} ref={_ref => (this.form = _ref)} autoCheckController>
                    <IPInput name="ip" />
                    <Input
                        name="another_ip"
                        controllerOptions={{
                            defaultValue: ['1.1.1.1'],
                            getter: v => v.split(';'),
                            setter: v => v.join(';')
                        }}
                    />
                </Form>
                <button onClick={this.loadFormData}>load form data</button>
                <button onClick={this.print}>print form data</button>
            </div>
        );
    }
}
