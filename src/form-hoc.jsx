import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import each from 'lodash/each';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import findKey from 'lodash/findKey';
import mapValues from 'lodash/mapValues';

function hoc(WrapperComponent, options = {}) {
    let validCheckValue = true;
    if (Object.hasOwnProperty.call(options, 'validCheckValue')) {
        validCheckValue = options.validCheckValue;
    }
    class Form extends PureComponent {
        controllerRefs = {};
        __formData = {};
        static propTypes = {
            defaultFormData: PropTypes.object, // default form data
            checkMap: PropTypes.object, // a map of check funs
            defaultHelpMap: PropTypes.object, // a map of default help info
            autoCheck: PropTypes.bool, // auto check all the form
            autoCheckController: PropTypes.bool, // auto check the controller which are editing
            onChange: PropTypes.func, // call when the form changed
            name: PropTypes.string,
            onOtherFormChange: PropTypes.func
        };
        static defaultProps = {
            defaultFormData: {},
            checkMap: {},
            defaultHelpMap: {},
            onChange: () => {},
            autoCheck: false,
            autoCheckController: false,
            onOtherFormChange: () => {}
        };

        static childContextTypes = {
            isInForm: PropTypes.bool,
            addTrackingController: PropTypes.func,
            removeTrackingController: PropTypes.func,
            onControllerChange: PropTypes.func,
            checkController: PropTypes.func
        };
        getChildContext() {
            return {
                isInForm: true,
                addTrackingController: this.addTrackingController,
                removeTrackingController: this.removeTrackingController,
                onControllerChange: this.onControllerChange,
                checkController: this.checkController
            };
        }

        static contextTypes = {
            isInFormGroup: PropTypes.bool,
            onFormChange: PropTypes.func,
            addTrackingForm: PropTypes.func,
            removeTrackingForm: PropTypes.func,
            getFormData: PropTypes.func
        };

        componentDidMount = () => {
            if (this.context.isInFormGroup) {
                this.context.addTrackingForm(this.props.name, this);
            }
        };
        componentWillUnmount = () => {
            // clear the refs
            this.controllerRefs = {};
            if (this.context.isInFormGroup) {
                this.context.removeTrackingForm(this.props.name, this);
            }
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
                    ref.setValue(defaultFormData[name]);
                }
                // init the help with defaultHelpMap
                let defaultHelpMap = this.props.defaultHelpMap;

                if (defaultHelpMap.hasOwnProperty(name)) {
                    itemRef && itemRef.setHelp(name, defaultHelpMap[name]);
                }
            }
        };

        // remove the controller tracking
        removeTrackingController = name => {
            delete this.controllerRefs[name];
        };

        // the controller changed
        onControllerChange = (name, value) => {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return;
            }
            let oldFormData = this.__formData;

            if (this.props.autoCheck) {
                // auto check all controller
                this.check();
            } else if (this.props.autoCheckController) {
                // auto check the changed controller
                this.checkController(name);
            }
            let newFormData = this.formData;
            this.props.onChange && this.props.onChange(name, value, newFormData, oldFormData);
            if (this.context.isInFormGroup && this.props.name) {
                this.context.onFormChange(this.props.name, newFormData, oldFormData);
            }
        };

        onOtherFormChange = (...args) => {
            this.props.onOtherFormChange(...args);
        };

        get formData() {
            let formData = {};
            each(this.controllerRefs, ({ ref }) => (formData[ref.name] = ref.getValue()));
            this.__formData = formData;
            return formData;
        }

        getFormData() {
            return this.formData;
        }

        getOtherFormData(formName) {
            if (this.context.isInFormGroup) {
                return this.context.getFormData(formName);
            } else {
                console.warn("The form is not in a form group, so it can't get other form's data");
            }
        }

        set formData(formData) {
            each(this.controllerRefs, ({ ref }, name) => {
                if (Object.hasOwnProperty.call(formData, name)) {
                    ref.setValue(formData[name]);
                } else {
                    ref.resetValue();
                }
            });
            if (this.props.autoCheck) {
                this.check();
            }
            this.__formData = formData;
        }

        setFormData = formData => {
            this.formData = formData;
        };

        // get the value of controller
        getControllerValue = name => {
            if (!this.controllerRefs[name]) {
                console.error(`There is no controller named ${name} in this form`);
                return undefined;
            }
            return this.controllerRefs[name].ref.getValue();
        };

        // check all controllers and return the result of check
        check() {
            // cache
            let currentFormData = this.formData;
            let checkResultMap = mapValues(this.controllerRefs, (ref, name) =>
                this.checkController(name, currentFormData)
            );
            return checkResultMap;
        }

        // check the controller value
        checkController = (name, currentFormData) => {
            const { checkMap } = this.props;
            let result = (() => {
                // no valid check map
                if (!isObject(checkMap)) return validCheckValue;
                const check = checkMap[name];
                // no valid check for this controller
                if (check === undefined) return validCheckValue;
                // this controller's check is not a valid fun
                if (!isFunction(check)) {
                    console.warn(`The check method of ${name} is not a function`);
                    return validCheckValue;
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
                if (result === validCheckValue) {
                    itemRef.removeHelp(name);
                } else {
                    itemRef.setHelp(name, result);
                }
            }
            return result;
        };

        // 表单是否有效
        get isValid() {
            let checkResultMap = this.check();
            return !findKey(checkResultMap, result => result !== validCheckValue);
        }
        getIsValid() {
            return this.isValid;
        }

        render() {
            let {
                defaultFormData,
                checkMap,
                defaultHelpMap,
                autoCheck,
                autoCheckController,
                onChange,
                name,
                onOtherFormChange,
                ...rest
            } = this.props;

            return <WrapperComponent {...rest} onChange={() => {}} />;
        }
    }
    return Form;
}
export default hoc;
