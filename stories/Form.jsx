import React from 'react';
import PropTypes from 'prop-types';
import { formHoc, itemHoc } from 'react-form';
import { map, isObject, isEmpty } from 'lodash';

let Form = props => {
    return <form {...props} />;
};
Form = formHoc(Form);

let Item = ({ label, children, childrenField, form, ...rest }) => {
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

Item.propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    childrenField: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired
};

Item = itemHoc(Item);

let Help = ({ help = [], display = 'inline-block' }) => {
    if (isEmpty(help)) {
        return null;
    }
    return (
        <div className="help-wrapper" style={{ display }}>
            {map(help, (info, name) => {
                let message;
                let color = 'black';
                if (!info.isDirty) {
                    return null;
                } else if (isObject(info.help)) {
                    message = info.message;
                    color = info.color;
                } else {
                    message = info.help;
                }
                if (!info.isValid) {
                    color = 'red';
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
    help: PropTypes.array,
    display: PropTypes.string
};

export default Form;
export { Item };
