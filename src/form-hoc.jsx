import React, { Component } from 'react'
import each from 'lodash/each'


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
                onChangeInForm: this.onChangeInForm
            };
        }

        componentWillUnmount() {
            this.controllerRefs = {}
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.formData && !this.isControlled) {
                console.warn(`You are trying to controll an uncontrolled form, please check you code`)
            } else if (this.isControlled) {
                this.serializeArray = nextProps.formData
            }
        }

        addTrackingController = (name, ref) => {
            if (this.controllerRefs[name]) {
                console.warn(`There is repeat controller name in this form, please check: repeated controller name is ${name}, this controller will not be tracking`)
            } else {
                this.controllerRefs[name] = ref;
                console.debug(`Add a ref of ${name}`, this.controllerRefs)
                if (this.isControlled) {
                    this.props.formData[name] !== undefined && (ref.value = this.props.formData[name])
                } else if (this.props.defaultFormData) {
                    this.props.defaultFormData[name] !== undefined && (ref.value = this.props.defaultFormData[name])
                }
            }
        }

        removeTrackingController = (name) => {
            delete this.controllerRefs[name]
            console.debug(`Remove a ref of ${name}`, this.controllerRefs)
        }

        onChangeInForm = (name, value) => {
            if (!this.isControlled) {
                this.controllerRefs[name].value = value
            }
            this.props.onChange && this.props.onChange(name, value)
        }

        // collection form datas like jquery
        get serializeArray() {
            if (this.isControlled) {
                return this.props.formData
            }
            let formData = {}
            each(this.controllerRefs, ref => formData[ref.name] = ref.value)
            return formData
        }

        set serializeArray(formData) {
            each(this.controllerRefs, (ref, name) => {
                ref.value = formData[name]
            })
        }

        check() {
            each(this.controllerRefs, ref => ref.check())
        }

        get isValid() {

        }

        render() {
            let { formData, defaultFormData, ...rest } = this.props;
            return <WrapperComponent {...rest} onChange={() => { }} />
        }

    }

    Form.childContextTypes = {
        isInForm: React.PropTypes.bool,
        addTrackingController: React.PropTypes.func,
        removeTrackingController: React.PropTypes.func,
        onChangeInForm: React.PropTypes.func
    };
    return Form
}
export default hoc