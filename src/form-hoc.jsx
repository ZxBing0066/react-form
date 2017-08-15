import React, { Component } from 'react'
import { each, isObject, isFunction, findKey, map, mapObject } from 'underscore'

function hoc(WrapperComponent) {
    class Form extends Component {
        constructor(props) {
            super(props)
            if (this.props.defaultFormData || !this.props.formData) { // uncontrolled
                this.isControlled = false
            } else if (this.props.formData) { // controlled
                this.isControlled = true
            }
            this.controllerRefs = {}
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
            this.controllerRefs = {}
            this.itemRefs = {}
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.formData && !this.isControlled) {
                console.warn(`You are trying to controll an uncontrolled form, please check you code`)
            } else if (this.isControlled) {
                this.serializeArray = nextProps.formData
            }
        }

        addTrackingController = (name, ref, itemRef) => {
            if (this.controllerRefs[name]) {
                console.warn(`There is repeat controller name in this form, please check: repeated controller name is ${name}, this controller will not be tracking`)
            } else {
                this.controllerRefs[name] = {
                    ref,
                    itemRef
                };
                console.debug(`Add a ref of ${name}`, this.controllerRefs)
                if (this.isControlled) {
                    this.props.formData[name] !== undefined && (ref.value = this.props.formData[name])
                } else if (this.props.defaultFormData) {
                    this.props.defaultFormData[name] !== undefined && (ref.value = this.props.defaultFormData[name])
                }
            }
        }

        removeTrackingController = (name) => {
            delete this.itemRefs[name]
            console.debug(`Remove a ref of item ${name}`, this.itemRefs)
        }

        onChangeInForm = (name, value) => {
            if (!this.isControlled) {
                this.controllerRefs[name].ref.value = value
                if (this.props.autoCheck) {
                    this.checkController(name)
                }
            }
            this.props.onChange && this.props.onChange(name, value)
        }

        // collection form datas like jquery
        get serializeArray() {
            if (this.isControlled) {
                return this.props.formData
            }
            let formData = {}
            each(this.controllerRefs, ({ ref }) => formData[ref.name] = ref.value)
            return formData
        }

        set serializeArray(formData) {
            each(this.controllerRefs, ({ ref }, name) => {
                ref.value = formData[name]
            })
            if (this.props.autoCheck) {
                this.check()
            }
        }

        getControllerValue(name) {
            if (!this.controllerRefs[name]) {
                console.warn(`There is no controller named ${name} in this form`)
                return undefined
            }
            if (this.isControlled) {
                return this.props.formData[name]
            } else {
                return this.controllerRefs[name].ref.value
            }
        }

        check() {
            let checkResultMap = mapObject(this.controllerRefs, (ref, name) => this.checkController(name))
            return checkResultMap
        }

        checkController = (name) => {
            const { checkMap } = this.props
            if (!isObject(checkMap)) return true
            const check = checkMap[name]
            if (check === undefined) return true
            if (!isFunction(check)) {
                console.warn(`The check method of ${name} is not a function`)
                return true
            }
            let value = this.getControllerValue(name)
            let result = check(value)
            let itemRef = this.controllerRefs[name].itemRef
            if (itemRef) {
                itemRef.setHelp(name, result)
            }
            return result
        }

        get isValid() {
            let checkResultMap = this.check()
            console.log(checkResultMap)
            return !findKey(checkResultMap, result => result !== true)
        }

        render() {
            let { formData, defaultFormData, checkMap, autoCheck, ...rest } = this.props;
            return <WrapperComponent {...rest} onChange={() => { }} />
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
    }
    return Form
}
export default hoc