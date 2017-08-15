import React, { Component } from 'react';

function hoc(WrappedComponent, options = {}) {
    let { bindChange = 'onChange', bindValue = 'value', getter = v => v, setter = v => v, defaultValue } = options;

    class Controller extends Component {
        constructor(props) {
            super(props);
            // init the WrappedComponent with default value
            this.state = {
                value: defaultValue
            };
        }

        componentDidMount() {
            if (!this.context.isInForm) {
                console.error(`The controller need to place in a valid form`);
            }
            if (!this.props.name) {
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

        get value() {
            return this.state.value;
        }

        set value(value) {
            this.state.value = value;
            this.setState({
                value
            });
        }

        get name() {
            return this.props.name;
        }

        check() {
            this.context.checkController(this.props.name);
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    ref={_ref => {
                        this.innerRef = _ref;
                    }}
                    {...{
                        [bindValue]: setter(this.state.value),
                        [bindChange]: (...args) => {
                            this.context.onControllerChange(this.props.name, getter(...args));
                            this.props.onChange && this.props.onChange(...args);
                        }
                    }}
                />
            );
        }
    }

    Controller.contextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func,
        removeTrackingController: React.PropTypes.func,
        onControllerChange: React.PropTypes.func,
        checkController: React.PropTypes.func
    };

    return Controller;
}

export default hoc;
