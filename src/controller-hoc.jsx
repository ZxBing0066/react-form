import React, { Component } from 'react'

function hoc(WrappedComponent, { onChange = 'onChange', value = 'value', ...rest }) {
    class Controller extends Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.context.isInForm && this.props.name && this.context.addTrackingController(this.props.name, this)
        }

        componentWillUnmount() {
            this.context.isInForm && this.props.name && this.context.removeTrackingController(this.props.name)
        }

        get value() {
            return this.innerRef.value
        }

        get name() {
            return this.props.name
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    ref={_ref => this.innerRef = _ref}
                    onChange={
                        value => {
                            this.context.isInForm && this.props.name && this.context.onChangeInForm(this.props.name, value);
                            this.props.onChange && this.props.onChange(value)
                        }
                    }
                />
            )
        }
    };

    Controller.contextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func,
        removeTrackingController: React.PropTypes.func,
        onChangeInForm: React.PropTypes.func
    };

    return Controller
}

export default hoc