import React, { Component } from 'react'

function hoc(WrappedComponent, { onChange = 'onChange', value = 'value', valueFormatter = v => v, ...rest }) {
    class Controller extends Component {
        constructor(props) {
            super(props);
            this.state = {
                value: undefined
            }
        }

        componentDidMount() {
            this.context.isInForm && this.props.name && this.context.addTrackingController(this.props.name, this)
        }

        componentWillUnmount() {
            this.context.isInForm && this.props.name && this.context.removeTrackingController(this.props.name)
        }

        get value() {
            return this.state.value
        }

        set value(value) {
            this.setState({
                value
            })
        }

        get name() {
            return this.props.name
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    ref={_ref => this.innerRef = _ref}
                    {...{
                        [value]: this.state.value,
                        [onChange]: (...args) => {
                            this.context.isInForm && this.props.name && this.context.onChangeInForm(this.props.name, ...args);
                            this.props.onChange && this.props.onChange(...args)
                        }
                    }}
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