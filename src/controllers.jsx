import React, { PureComponent } from 'react';

import controllerHoc from './controller-hoc.jsx';

let Input = props => {
    return <input {...props} />;
};
Input = controllerHoc(Input, { defaultValue: '', getter: e => e.target.value });

class SelectComponent extends PureComponent {
    // hack when the init value of select is not correct
    // when there is no option equal to the default value but the select will auto select the first options with out call the onChange handle
    // this will not call the onChange in form
    getInitValue = () => {
        return this.ref.value;
    };

    render() {
        return <select {...this.props} ref={_ref => (this.ref = _ref)} />;
    }
}
let Select = controllerHoc(SelectComponent, { defaultValue: '', getter: e => e.target.value });

let Checkbox = props => {
    return <input type="checkbox" {...props} />;
};
Checkbox = controllerHoc(Checkbox, { bindValue: 'checked', defaultValue: false, getter: e => e.target.checked });

export { Input, Select, Checkbox };
