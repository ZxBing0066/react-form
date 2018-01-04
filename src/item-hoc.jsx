import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

function hoc(WrapperComponent) {
    class Item extends PureComponent {
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
            const { help } = this.state;
            if (Object.hasOwnProperty.call(help, name) && help[name] === helpForName) return;
            this.setState({
                help: {
                    ...help,
                    [name]: helpForName
                }
            });
        };
        removeHelp = name => {
            const { help } = this.state;
            if (!Object.hasOwnProperty.call(help, name)) return;
            delete help[name];
            this.setState({
                help: {
                    ...help
                }
            });
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
