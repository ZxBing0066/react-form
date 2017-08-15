import React, { Component } from 'react';

function hoc(WrappedComponent, options = {}) {
    let { bindChange = 'onChange', bindValue = 'value', getter = v => v, setter = v => v, defaultValue, ...rest } = options;
    class Controller extends Component {
        constructor(props) {
            super(props);
            this.state = {
                value: defaultValue
            };
        }

        componentDidMount() {
            // tell form to tracking this controller
            this.context.isInForm && this.props.name && this.context.addTrackingController(this.props.name, this);
            if (this.innerRef && this.innerRef.getInitValue) {
                let initValue = this.innerRef.getInitValue();
                this.setState({
                    value: initValue
                });
            }
        }

        componentWillUnmount() {
            this.context.isInForm && this.props.name && this.context.removeTrackingController(this.props.name);
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
            if (!this.context.isInForm) return true;
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
                            this.context.isInForm && this.props.name && this.context.onChangeInForm(this.props.name, getter(...args));
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
        onChangeInForm: React.PropTypes.func,
        checkController: React.PropTypes.func
    };

    return Controller;
}

export default hoc;
