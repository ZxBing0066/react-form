import React, { Component } from 'react'
import each from 'lodash/each'

class Form extends Component {
    constructor(...args) {
        super(...args)
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

    addTrackingController = (name, ref) => {
        if (this.controllerRefs[name]) {
            console.warn(`There is repeat controller name in this form, please check: repeated controller name is ${name}`)
        }
        this.controllerRefs[name] = ref;
        console.debug(`Add a ref of ${name}`, this.controllerRefs)
    }

    removeTrackingController = (name) => {
        delete this.controllerRefs[name]
        console.debug(`Remove a ref of ${name}`, this.controllerRefs)
    }

    onChangeInForm = (name, value) => {
        this.props.onChange && this.props.onChange(name, value)
    }

    componentWillUnmount() {
        this.controllerRefs = {}
    }

    // collection form datas like jquery
    get serializeArray() {
        let formData = {}
        each(this.controllerRefs, ref => formData[ref.name] = ref.value)
        return formData
    }

    set serializeArray(formData) {
        each(formData, (value, name) => {
            this.controllerRefs[name].value = value
        })
    }

    check() {
        each(this.controllerRefs, ref => ref.check())
    }

    get isValid() {

    }

    render() {
        return <form {...this.props} onChange={() => { }} />
    }

}

Form.childContextTypes = {
    isInForm: React.PropTypes.bool,
    addTrackingController: React.PropTypes.func,
    removeTrackingController: React.PropTypes.func,
    onChangeInForm: React.PropTypes.func
};

export default Form