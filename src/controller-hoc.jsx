import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isFunction from 'lodash/isFunction';

function hoc(WrappedComponent, options = {}) {
    let { bindChange = 'onChange', bindValue = 'value', getter = v => v, setter = v => v, defaultValue } = options;

    class Controller extends PureComponent {
        constructor(props) {
            super(props);
            // init the WrappedComponent with default value or with props
            const value = (this.__last_report_value = this.getDefaultValue());
            this.state = {
                value: value
            };
        }
        static propTypes = {
            name: PropTypes.string.isRequired,
            controllerOptions: PropTypes.object
        };
        static defaultProps = {
            controllerOptions: {}
        };

        componentDidMount() {
            if (!this.context.isInForm) {
                console.error(`The controller need to place in a valid form`);
            }
            if (!this.name) {
                console.error('The controller need a unique name in the form');
            }
            // hack when the init value of WrappedComponent is not correct
            if (this.innerRef && this.innerRef.getInitValue) {
                let initValue = this.innerRef.getInitValue();
                this.value = initValue;
            }
            // tell form to tracking this controller
            this.context.addTrackingController(this.name, this);
        }
        componentWillUnmount() {
            this.context.removeTrackingController(this.name);
        }

        getDefaultValue = () => {
            let __defaultValue = defaultValue;
            const { controllerOptions } = this.props;
            if (Object.hasOwnProperty.call(controllerOptions, ['defaultValue'])) {
                __defaultValue = controllerOptions.defaultValue;
            }
            return __defaultValue;
        };

        get value() {
            return this.state.value;
        }
        getValue = () => this.value;
        set value(value) {
            this.setState({
                value: value
            });
        }
        setValue = v => (this.value = v);
        resetValue = () => (this.value = this.getDefaultValue());
        get name() {
            return this.props.name;
        }
        getName = () => this.name;

        handleChange = debounce(value => {
            this.context.onControllerChange(this.name, value, this.__last_report_value);
            this.__last_report_value = value;
        }, 200);
        onChange = (...args) => {
            const { controllerOptions } = this.props;
            let __getter = getter;
            if (isFunction(controllerOptions.getter)) {
                __getter = (...args) => controllerOptions.getter(getter(...args));
            }
            const value = __getter(...args);
            this.value = value;
            this.handleChange(value);
        };

        check = () => {
            this.context.checkController(this.name);
        };

        render() {
            const { controllerOptions, ...rest } = this.props;
            let __setter = setter;
            if (isFunction(controllerOptions.setter)) {
                __setter = (...args) => controllerOptions.setter(setter(...args));
            }
            return (
                <WrappedComponent
                    {...rest}
                    {...{
                        [bindValue]: __setter(this.state.value),
                        [bindChange]: this.onChange
                    }}
                    ref={_ref => (this.innerRef = _ref)}
                />
            );
        }
    }

    Controller.contextTypes = {
        isInForm: PropTypes.bool,
        addTrackingController: PropTypes.func,
        removeTrackingController: PropTypes.func,
        onControllerChange: PropTypes.func,
        checkController: PropTypes.func
    };

    return Controller;
}

export default hoc;
export const create = hoc;
