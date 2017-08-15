import React, { Component } from 'react';
import { each, isObject, isFunction, findKey, map, mapObject, extend } from 'underscore';

function hoc(WrapperComponent) {
    class Form extends Component {
        constructor(props) {
            super(props);
            this.controllerRefs = {};
        }

        getChildContext() {
            return {
                isInForm: true,
                addTrackingController: this.addTrackingController,
                removeTrackingController: this.removeTrackingController,
                onControllerChange: this.onControllerChange,
                checkController: this.checkController
            };
        }

        componentWillUnmount = () => {
            // clear the refs
            this.controllerRefs = {};
        };

        // tell form to tracking this controller
        addTrackingController = (name, ref, itemRef) => {
            if (this.controllerRefs[name]) {
                console.error(
                    `There is repeat controller name in this form, please check: repeated controller name is ${name}, this controller will not be tracking`
                );
            } else {
                this.controllerRefs[name] = {
                    ref,
                    itemRef
                };
                // init the controller with defaultFormData
                let defaultFormData = this.props.defaultFormData;
                if (defaultFormData.hasOwnProperty(name)) {
                    ref.value = defaultFormData[name];
                }
            }
        };

        // remove the controller tracking
        removeTrackingController = name => {
            delete this.controllerRefs[name];
        };

        // the controller changed
        onControllerChange = (name, value) => {
            let currentFormData = this.formData;
            if (isFunction(this.props.setMap[name])) {
                value = this.props.setMap[name](value, currentFormData);
            }
            this.setControllerValue(name, value);
            this.props.onChange && this.props.onChange(name, value, currentFormData);
        };

        // collection form datas like jquery
        get serializeArray() {
            let formData = {};
            each(this.controllerRefs, ({ ref }) => (formData[ref.name] = ref.value));
            return formData;
        }

        get formData() {
            return this.serializeArray;
        }

        // set the form data
        set serializeArray(formData) {
            each(this.controllerRefs, ({ ref }, name) => {
                ref.value = formData[name];
            });
            if (this.props.autoCheck) {
                this.check();
            }
        }

        set formData(formData) {
            this.serializeArray = formData;
        }

        setFormData = formData => {
            this.serializeArray = formData;
        };

        // get the value of controller
        getControllerValue = name => {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return undefined;
            }
            return this.controllerRefs[name].ref.value;
        };

        // set the value of the controller
        setControllerValue(name, value) {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return;
            }
            this.controllerRefs[name].ref.value = value;
            if (this.props.autoCheck) {
                // auto check the changed controller
                this.check();
            }
        }

        // check all controllers and return the result of check
        check() {
            // cache
            let currentFormData = this.formData;
            let checkResultMap = mapObject(this.controllerRefs, (ref, name) =>
                this.checkController(name, currentFormData)
            );
            return checkResultMap;
        }

        // check the controller value
        checkController = (name, currentFormData) => {
            const { checkMap } = this.props;
            let result = (() => {
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
                if (!currentFormData) {
                    currentFormData = this.formData;
                }
                let value = this.getControllerValue(name);
                // get the check result
                return check(value, currentFormData);
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
            let { defaultFormData, checkMap, setMap, autoCheck, ...rest } = this.props;
            return <WrapperComponent {...rest} onChange={() => {}} />;
        }
    }

    Form.childContextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func,
        removeTrackingController: React.PropTypes.func,
        onControllerChange: React.PropTypes.func,
        checkController: React.PropTypes.func
    };

    Form.defaultProps = {
        defaultFormData: {},
        checkMap: {},
        setMap: {},
        autoCheck: false
    };
    return Form;
}
export default hoc;
