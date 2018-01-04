import React from 'react';
import PropTypes from 'prop-types';
import { formHoc, itemHoc } from '../index';
import { map, isObject, isEmpty } from 'lodash';

let Form = props => {
    return <form {...props} />;
};
Form = formHoc(Form);

let Item = ({ label, children, help, ...rest }) => {
    return (
        <div {...rest}>
            <label>{label}</label>
            {children}
            <Help help={help} />
        </div>
    );
};

Item.propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    help: PropTypes.object
};

Item = itemHoc(Item);

let Help = ({ help = {}, display = 'inline-block' }) => {
    if (isEmpty(help)) {
        return null;
    }
    return (
        <div className="help-wrapper" style={{ display }}>
            {map(help, (info, name) => {
                let message;
                let color = 'red';
                if (isObject(info)) {
                    message = info.message;
                    color = info.color;
                } else {
                    message = info;
                }
                const style = {
                    color
                };
                return (
                    <p key={name} style={style}>
                        {name}: {message}
                    </p>
                );
            })}
        </div>
    );
};
Help.propTypes = {
    help: PropTypes.object,
    display: PropTypes.string
};

export default Form;
export { Item };
