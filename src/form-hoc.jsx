import React, { Component } from 'react';
import PropTypes from 'prop-types';
import each from 'lodash/each';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import findKey from 'lodash/findKey';
import mapValues from 'lodash/mapValues';

function hoc(WrapperComponent) {
    class Form extends Component {
        constructor(props) {
            super(props);
            this.controllerRefs = {};
        }

        static propTypes = {
            defaultFormData: PropTypes.object,
            checkMap: PropTypes.object,
            setMap: PropTypes.object,
            defaultHelpMap: PropTypes.object,
            autoCheck: PropTypes.bool,
            autoCheckController: PropTypes.bool,
            onChange: PropTypes.func,
            name: PropTypes.string,
            onOtherFormChange: PropTypes.func
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
                    ref.value = defaultFormData[name];
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
            let oldFormData = this.formData;
            if (isFunction(this.props.setMap[name])) {
                value = this.props.setMap[name](value, oldFormData);
            }
            this.setControllerValue(name, value);
            let newFormData = this.formData;
            this.props.onChange && this.props.onChange(name, value, newFormData, oldFormData);
            if (this.context.isInFormGroup && this.props.name) {
                this.context.onFormChange(this.props.name, newFormData, oldFormData);
            }
        };

        onOtherFormChange = (...args) => {
            this.props.onOtherFormChange(...args);
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

        getFormData() {
            return this.serializeArray;
        }

        getOtherFormData(formName) {
            if (this.context.isInFormGroup) {
                return this.context.getFormData(formName);
            } else {
                console.warn("The form is not in a form group, so it can't get other form's data");
            }
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
                // auto check all controller
                this.check();
            } else if (this.props.autoCheckController) {
                // auto check the changed controller
                this.checkController(name);
            }
        }

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
        getIsValid() {
            return this.isValid;
        }

        render() {
            let {
                defaultFormData,
                checkMap,
                setMap,
                defaultHelpMap,
                autoCheck,
                autoCheckController,
                onOtherFormChange,
                ...rest
            } = this.props;
            return <WrapperComponent {...rest} onChange={() => {}} />;
        }
    }

    Form.childContextTypes = {
        isInForm: PropTypes.bool,
        addTrackingController: PropTypes.func,
        removeTrackingController: PropTypes.func,
        onControllerChange: PropTypes.func,
        checkController: PropTypes.func
    };
    Form.contextTypes = {
        isInFormGroup: PropTypes.bool,
        onFormChange: PropTypes.func,
        addTrackingForm: PropTypes.func,
        removeTrackingForm: PropTypes.func,
        getFormData: PropTypes.func
    };
    Form.defaultProps = {
        defaultFormData: {},
        checkMap: {},
        setMap: {},
        defaultHelpMap: {},
        onChange: () => {},
        autoCheck: false,
        autoCheckController: false,
        onOtherFormChange: () => {}
    };
    return Form;
}
export default hoc;
