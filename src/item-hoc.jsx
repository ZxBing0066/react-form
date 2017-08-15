import React, { Component } from 'react'

function hoc(WrapperComponent, options) {
    class Item extends Component {
        constructor(...args) {
            super(...args)
            this.state = {
                help: {}
            }
        }

        getChildContext() {
            return {
                addTrackingController: this.addTrackingController
            };
        }

        addTrackingController = (name, ref) => {
            this.context.isInForm && this.context.addTrackingController(name, ref, this)
        }

        setHelp = (name, helpForName) => {
            let help = this.state.help
            help[name] = helpForName
            this.setState({ help })
        }

        render() {
            return <WrapperComponent help={this.state.help} {...this.props} />
        }
    }

    Item.childContextTypes = {
        addTrackingController: React.PropTypes.func
    };

    Item.contextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func
    };

    return Item
}

export default hoc