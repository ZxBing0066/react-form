import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { EVENTS } from './dispatcher';

function hoc(WrappedComponent) {
    class Item extends Component {
        constructor(props, context) {
            super(props, context);

            const { form } = context;
            if (form === undefined) {
                console.error('The item must place into a form');
            }
            const { dispatcher } = form;
            this.dispatcher = dispatcher;
            dispatcher.addListener(EVENTS.CONTROLLER_DESTORY, this.removeTrackingField);
        }
        static contextTypes = {
            form: PropTypes.object.isRequired
        };
        static childContextTypes = {
            addTrackingField: PropTypes.func
        };
        getChildContext() {
            return {
                addTrackingField: this.addTrackingField
            };
        }
        childFieldMap = {};
        addTrackingField = field => {
            this.childFieldMap[field] = true;
        };
        removeTrackingField = field => {
            delete this.childFieldMap[field];
        };
        getChildrenField = () => {
            return map(this.childFieldMap, (v, field) => field);
        };
        render() {
            const { form } = this.context;
            return <WrappedComponent childrenField={this.getChildrenField()} form={form} {...this.props} />;
        }
    }

    return Item;
}

export default hoc;
