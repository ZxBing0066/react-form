import React, { Component } from 'react';
import { each, isObject, isFunction, findKey, map, mapObject, extend } from 'underscore';

function hoc(WrapperComponent) {
    class Form extends Component {
        constructor(props) {
            super(props);
            this.controllerRefs = {};
            if (this.props.formData) {
                // controlled
                if (this.props.defaultFormData) {
                    console.error('You can only use one of the formData & defaultFormData, for the controlled or uncontrolled form');
                }
                this.isControlled = true;
                this.formData = this.props.formData;
            } else {
                // uncontrolled
                this.isControlled = false;
                this.formData = extend({}, this.props.defaultFormData); // cache the formData
            }
        }

        getChildContext() {
            return {
                isInForm: true,
                addTrackingController: this.addTrackingController,
                removeTrackingController: this.removeTrackingController,
                onChangeInForm: this.onChangeInForm,
                checkController: this.checkController
            };
        }

        componentWillUnmount() {
            // clear the refs
            this.controllerRefs = {};
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.formData && !this.isControlled) {
                console.warn(`You are trying to controll an uncontrolled form, please check you code`);
            } else if (this.isControlled) {
                // update controlled form
                this.formData = this.serializeArray = nextProps.formData;
            }
        }

        // tell form to tracking this controller
        addTrackingController = (name, ref, itemRef) => {
            if (this.controllerRefs[name]) {
                console.error(`There is repeat controller name in this form, please check: repeated controller name is ${name}, this controller will not be tracking`);
            } else {
                this.controllerRefs[name] = {
                    ref,
                    itemRef
                };
                console.debug(`Add a ref of ${name}`, this.controllerRefs);
                if (this.isControlled) {
                    this.props.formData[name] !== undefined && (ref.value = this.props.formData[name]);
                } else if (this.props.defaultFormData) {
                    this.props.defaultFormData[name] !== undefined && (ref.value = this.props.defaultFormData[name]);
                }
            }
        };

        // remove the controller tracking
        removeTrackingController = name => {
            delete this.controllerRefs[name];
            console.debug(`Remove a ref of controller ${name}`, this.controllerRefs);
        };

        // the controller changed
        onChangeInForm = (name, value) => {
            if (!this.isControlled) {
                this.setControllerValue(name, value);
            }
            this.props.onChange && this.props.onChange(name, value);
        };

        // collection form datas like jquery
        get serializeArray() {
            if (this.isControlled) {
                return this.props.formData;
            }
            let formData = {};
            each(this.controllerRefs, ({ ref }) => (formData[ref.name] = ref.value));
            return formData;
        }

        // set the form data
        set serializeArray(formData) {
            if (this.isControlled) {
                console.error('This form is controlled, to set the form data please just update the props of formData');
                return;
            }
            each(this.controllerRefs, ({ ref }, name) => {
                ref.value = formData[name];
            });
            if (this.props.autoCheck) {
                this.check();
            }
        }

        // get the value of controller
        getControllerValue(name) {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return undefined;
            }
            if (this.isControlled) {
                return this.props.formData[name];
            } else {
                return this.controllerRefs[name].ref.value;
            }
        }

        // set the value of the controller
        setControllerValue(name, value) {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return;
            }
            this.controllerRefs[name].ref.value = value;
            if (this.props.autoCheck) {
                // auto check the changed controller
                this.checkController(name);
            }
        }

        // check all controllers and return the result of check
        check() {
            let checkResultMap = mapObject(this.controllerRefs, (ref, name) => this.checkController(name));
            return checkResultMap;
        }

        // check the controller value
        checkController = name => {
            const { checkMap } = this.props;
            let result = (function() {
                // no valid check map
                if (!isObject(checkMap)) return true;
                const check = checkMap[name];
                // no valid check for this controller
                if (check === undefined) return true;
                // this controller's check is not a valid fun
                if (!isFunction(check)) {
                    console.warn(`The check method of ${name} is not a function`);
                    return true;
                }
                let value = this.getControllerValue(name);
                // get the check result
                return check(value);
            })();
            let itemRef = this.controllerRefs[name].itemRef;
            // if in item
            if (itemRef) {
                itemRef.setHelp(name, result);
            }
            return result;
        };

        // 表单是否有效
        get isValid() {
            let checkResultMap = this.check();
            return !findKey(checkResultMap, result => result !== true);
        }

        render() {
            let { formData, defaultFormData, checkMap, autoCheck, ...rest } = this.props;
            return <WrapperComponent {...rest} onChange={() => {}} />;
        }
    }

    Form.childContextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func,
        removeTrackingController: React.PropTypes.func,
        onChangeInForm: React.PropTypes.func,
        checkController: React.PropTypes.func
    };

    Form.defaultProps = {
        checkMap: {}
    };
    return Form;
}
export default hoc;
