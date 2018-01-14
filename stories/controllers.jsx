import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { controllerWrapper } from 'z-react-form';

let Input = ({ field, form, ...rest }) => {
    return (
        <input {...rest} style={{ background: form.isFieldDirty(field) && !form.isFieldValid(field) ? 'red' : '' }} />
    );
};
Input.propTypes = {
    field: PropTypes.string,
    form: PropTypes.object
};
Input = controllerWrapper(Input, { defaultValue: '', getter: e => e.target.value });

class SelectComponent extends PureComponent {
    // hack when the init value of select is not correct
    // when there is no option equal to the default value but the select will auto select the first options with out call the onChange handle
    // this will not call the onChange in form
    getInitValue = () => {
        return this.ref.value;
    };

    render() {
        // eslint-disable-next-line no-unused-vars
        const { field, form, ...rest } = this.props;
        return <select {...rest} ref={_ref => (this.ref = _ref)} />;
    }
}
SelectComponent.propTypes = {
    field: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired
};

let Select = controllerWrapper(SelectComponent, { defaultValue: '', getter: e => e.target.value });

// eslint-disable-next-line no-unused-vars
let Checkbox = ({ field, form, ...rest }) => {
    return <input type="checkbox" {...rest} />;
};
Checkbox.propTypes = {
    field: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired
};

Checkbox = controllerWrapper(Checkbox, { bindValue: 'checked', defaultValue: false, getter: e => e.target.checked });

let IPInput = props => {
    return <input {...props} type="text" />;
};
IPInput = controllerWrapper(IPInput, {
    defaultValue: [],
    getter: e => (e.target.value || '').split(';'),
    setter: v => v.join(';')
});

export { Input, Select, Checkbox, IPInput };
