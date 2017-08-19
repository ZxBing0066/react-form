import React, { Component } from 'react';
import PropTypes from 'prop-types';

function hoc(WrapperComponent) {
    class Item extends Component {
        constructor(...args) {
            super(...args);
            this.state = {
                help: {}
            };
        }

        getChildContext() {
            return {
                addTrackingController: this.addTrackingController
            };
        }

        addTrackingController = (name, ref) => {
            this.context.isInForm && this.context.addTrackingController(name, ref, this);
        };

        setHelp = (name, helpForName) => {
            let help = this.state.help;
            help[name] = helpForName;
            this.setState({ help });
        };

        render() {
            return <WrapperComponent help={this.state.help} {...this.props} />;
        }
    }

    Item.childContextTypes = {
        addTrackingController: PropTypes.func
    };

    Item.contextTypes = {
        isInForm: PropTypes.bool,
        addTrackingController: PropTypes.func
    };

    return Item;
}

export default hoc;
