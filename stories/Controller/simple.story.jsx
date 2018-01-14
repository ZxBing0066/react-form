import React from 'react';
import PropTypes from 'prop-types';

import { controllerWrapper } from 'z-react-form';

import Form from '../Form';

// eslint-disable-next-line no-unused-vars
const InputComponents = ({ field, form, onChange, ...rest }) => {
    return <input {...rest} onChange={e => onChange(e.target.value)} />;
};
InputComponents.propTypes = {
    field: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func
};
InputComponents.defaultProps = {
    onChange: () => {}
};

const InputComponentsWithHelp = ({ field, form, ...rest }) => {
    const help = form.getFieldHelp(field);
    return (
        <span>
            <InputComponents {...rest} />
            {help && <span style={{ color: 'red' }}>{help}</span>}
        </span>
    );
};
InputComponentsWithHelp.propTypes = {
    form: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired
};

const InputComponentsWithHelpWithoutNotDirty = ({ field, form, ...rest }) => {
    const help = form.getFieldHelp(field),
        isDirty = form.isFieldDirty(field);
    return (
        <span>
            <InputComponents {...rest} />
            {isDirty && help && <span style={{ color: 'red' }}>{help}</span>}
        </span>
    );
};
InputComponentsWithHelpWithoutNotDirty.propTypes = {
    form: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired
};

const Input = controllerWrapper(InputComponents, { defaultValue: '' });
const InputWithHelp = controllerWrapper(InputComponentsWithHelp, { defaultValue: '' });
const InputWithHelpWithoutNotDirty = controllerWrapper(InputComponentsWithHelpWithoutNotDirty, { defaultValue: '' });

const InputWithSetterGetter = controllerWrapper(InputComponents, {
    defaultValue: 0,
    getter: v => v * 2,
    setter: v => v / 2
});
const InputWithDefaultValue = controllerWrapper(InputComponents, {
    defaultValue: 'this is the default value'
});
const InputWithDefaultHelp = controllerWrapper(InputComponentsWithHelp, {
    defaultValue: '',
    defaultHelp: 'this is the default help'
});

const SimpleController = () => {
    return (
        <Form
            onChange={(...args) => console.log.call(console, 'onChange', ...args)}
            onSubmit={(...args) => console.log.call(console, 'onSubmit', ...args)}
            checkMap={{
                inputWithHelp: v => {
                    if (v.length < 6) {
                        return 'at least 6';
                    }
                },
                inputWithHelpWithoutNotDirty: v => {
                    if (v.length < 6) {
                        return 'at least 6';
                    }
                }
            }}
        >
            <div>
                <label>input: </label>
                <Input field="input" />
            </div>
            <div>
                <label>inputWithSetterGetter: </label>
                <InputWithSetterGetter field="inputWithSetterGetter" />
            </div>
            <div>
                <label>inputWithDefaultValue: </label>
                <InputWithDefaultValue field="inputWithDefaultValue" />
            </div>
            <div>
                <label>inputWithDefaultValueInProps: </label>
                <Input
                    field="inputWithDefaultValueInProps"
                    controllerOptions={{ defaultValue: 'this is the default value geted from props' }}
                />
            </div>
            <div>
                <label>inputWithHelp: </label>
                <InputWithHelp field="inputWithHelp" />
            </div>
            <div>
                <label>inputWithHelpWithoutNotDirty: </label>
                <InputWithHelpWithoutNotDirty field="inputWithHelpWithoutNotDirty" />
            </div>
            <div>
                <label>inputWithDefaultHelp:</label>
                <InputWithDefaultHelp field="inputWithDefaultHelp" />
            </div>
            <button type="submit">submit</button>
        </Form>
    );
};

SimpleController.propTypes = {};

export default SimpleController;
