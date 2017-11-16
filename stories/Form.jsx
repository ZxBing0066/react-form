import React from 'react';
import PropTypes from 'prop-types';
import { formHoc, itemHoc } from '../index';
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
            <label>{label}</label>
            {children}
            <span>{helpText}</span>
        </div>
    );
};

Item.propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    help: PropTypes.object
};

Item = itemHoc(Item);

export default Form;
export { Item };
