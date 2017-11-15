import React, { Component } from 'react';
import PropTypes from 'prop-types';
import each from 'lodash/each';
import findIndex from 'lodash/findIndex';

function hoc(WrapperComponent) {
    class FormGroup extends Component {
        constructor(props) {
            super(props);
            this.formRefs = {};
            this.noNameFormRefs = [];
        }
        static propTypes = {
            onFormChange: PropTypes.func
        };
        static defaultProps = {
            onFormChange: () => {}
        };
        getChildContext() {
            return {
                isInFormGroup: true,
                onFormChange: this.onFormChange,
                addTrackingForm: this.addTrackingForm,
                removeTrackingForm: this.removeTrackingForm,
                getFormData: this.getFormData
            };
        }
        componentWillUnmount = () => {
            this.formRefs = {};
            this.noNameFormRefs = [];
        };
        getFormData = formName => {
            const formRef = this.formRefs[formName];
            if (formRef) {
                return formRef.getFormData();
            } else {
                console.warn(`There is no such form named ${formName} in this form group`);
            }
        };
        get isValid() {
            let result = [];
            each(this.formRefs, formRef => result.push(formRef.isValid));
            each(this.noNameFormRefs, formRef => result.push(formRef.isValid));

            return findIndex(result, isValid => isValid === false) < 0;
        }
        getIsValid = () => {
            return this.isValid;
        };
        onFormChange = (formName, ...otherArgs) => {
            each(this.formRefs, (formRef, name) => {
                if (name === formName) {
                    return;
                } else {
                    formRef.onOtherFormChange(formName, ...otherArgs);
                }
            });
            each(this.noNameFormRefs, formRef => {
                formRef.onOtherFormChange(formName, ...otherArgs);
            });
            this.props.onFormChange(formName, ...otherArgs);
        };
        // tell group to tracking this form
        addTrackingForm = (name, formRef) => {
            if (!name) {
                console.warn(`The form has no name, form group will not listen to it's change event`, formRef);
                this.noNameFormRefs.push(formRef);
            } else if (this.formRefs[name]) {
                console.error(
                    `There is repeat form name in this form group, please check: repeated form name is ${name}, this form will not be tracking`
                );
            } else {
                this.formRefs[name] = formRef;
            }
        };

        // remove the form tracking
        removeTrackingForm = (name, formRef) => {
            if (!name) {
                this.noNameFormRefs = this.noNameFormRefs.filter(_formRef => _formRef !== formRef);
            } else {
                delete this.formRefs[name];
            }
        };
        render() {
            const { onFormChange, ...rest } = this.props;
            return <WrapperComponent {...rest} />;
        }
    }

    FormGroup.childContextTypes = {
        isInFormGroup: PropTypes.bool,
        onFormChange: PropTypes.func,
        addTrackingForm: PropTypes.func,
        removeTrackingForm: PropTypes.func,
        getFormData: PropTypes.func
    };
    return FormGroup;
}

export default hoc;
