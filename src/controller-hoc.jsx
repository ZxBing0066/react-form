import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import { EVENTS } from './dispatcher';

function hoc(WrappedComponent, options = {}) {
    const {
        bindChange = 'onChange',
        bindValue = 'value',
        getter = v => v,
        setter = v => v,
        defaultValue,
        defaultHelp
    } = options;

    class Controller extends Component {
        constructor(props, context) {
            super(props, context);
            // init the WrappedComponent with default value or with props
            const initValue = this.getDefaultValue();
            const initHelp = this.getDefaultHelp();
            this.state = {
                value: initValue
            };
            const { field } = props;
            if (field === undefined) {
                console.error('The controller need a unique field in the form');
            }
            const { form, addTrackingField } = context;
            if (form === undefined) {
                console.error('The controller must place into a form');
            }
            const { dispatcher } = form;
            this.dispatcher = dispatcher;
            if (addTrackingField) {
                addTrackingField(field);
            }
            dispatcher.dispatch(EVENTS.CONTROLLER_INIT, field, initValue, initHelp);
            dispatcher.addListener(`${field}-${EVENTS.CONTROLLER_SET_VALUE}`, this.setValue);
        }
        static propTypes = {
            field: PropTypes.string.isRequired,
            controllerOptions: PropTypes.object
        };
        static defaultProps = {
            controllerOptions: {}
        };
        static contextTypes = {
            form: PropTypes.object.isRequired,
            addTrackingField: PropTypes.func
        };

        componentDidMount() {
            // hack when the init value of WrappedComponent is not correct, this will trigger form's onChange handle
            if (this.innerRef && this.innerRef.getInitValue) {
                const initValue = this.innerRef.getInitValue();
                this.setValue(initValue);
            }
        }
        componentWillUnmount() {
            const field = this.getField();
            this.dispatcher.dispatch(EVENTS.CONTROLLER_DESTORY, field);
        }

        getDefaultValue = () => {
            let _defaultValue = defaultValue;
            const { controllerOptions } = this.props;
            if (Object.hasOwnProperty.call(controllerOptions, ['defaultValue'])) {
                _defaultValue = controllerOptions.defaultValue;
            }
            return _defaultValue;
        };
        getDefaultHelp = () => {
            let _defaultHelp = defaultHelp;
            const { controllerOptions } = this.props;
            if (Object.hasOwnProperty.call(controllerOptions, ['defaultHelp'])) {
                _defaultHelp = controllerOptions.defaultHelp;
            }
            return _defaultHelp;
        };
        getValue = () => this.state.value;
        _setValue = (value, callback) => {
            this.setState(
                {
                    value
                },
                callback
            );
        };
        setValue = v => {
            this._setValue(v, () => this.handleChange(v));
        };
        resetValue = () => this.setValue(this.getDefaultValue());

        getField = () => this.props.field;

        handleChange = value => {
            const field = this.getField();
            this.dispatcher.dispatch(EVENTS.CONTROLLER_DIRTY, field);
            this.dispatcher.dispatch(EVENTS.CONTROLLER_CHANGE, field, value);
        };
        onChange = (...args) => {
            const { controllerOptions } = this.props;
            let _getter = getter;
            if (isFunction(controllerOptions.getter)) {
                _getter = (...args) => controllerOptions.getter(getter(...args));
            }
            const value = _getter(...args);
            this.setValue(value);
        };

        render() {
            // eslint-disable-next-line no-unused-vars
            const { field, controllerOptions, ...rest } = this.props;
            const { form } = this.context;
            let _setter = setter;
            if (isFunction(controllerOptions.setter)) {
                _setter = (...args) => controllerOptions.setter(setter(...args));
            }
            return (
                <WrappedComponent
                    {...rest}
                    {...{
                        [bindValue]: _setter(this.getValue()),
                        [bindChange]: this.onChange
                    }}
                    field={this.getField()}
                    form={form}
                    ref={_ref => (this.innerRef = _ref)}
                />
            );
        }
    }

    return Controller;
}

export default hoc;
export const create = hoc;
