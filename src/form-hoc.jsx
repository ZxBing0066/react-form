import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import each from 'lodash/each';
import isFunction from 'lodash/isFunction';
import uniqueId from 'lodash/uniqueId';
import debounce from 'lodash/debounce';

import { createDispatcher, EVENTS } from './dispatcher';

function hoc(WrapperComponent, options = {}) {
    let validCheckValue = undefined;
    if (Object.hasOwnProperty.call(options, 'validCheckValue')) {
        validCheckValue = options.validCheckValue;
    }
    const { debounceWait = 200 } = options;

    const propTypes = {
        defaultFormData: PropTypes.object, // default form data
        defaultHelpMap: PropTypes.object, // a map of default help info
        checkMap: PropTypes.object, // a map of check funs
        autoCheck: PropTypes.bool, // auto check all the form
        onChange: PropTypes.func, // call when the form changed
        onSubmit: PropTypes.func
    };

    class Form extends PureComponent {
        constructor(...props) {
            super(...props);
            const { form } = this;
            const { dataStore, dirtyMap, helpMap } = form;
            const dispatcher = (this.dispatcher = form.dispatcher = createDispatcher(form.key));

            dispatcher.addListener(EVENTS.CONTROLLER_INIT, (field, initValue, initHelp) => {
                dataStore[field] = initValue;
                helpMap[field] = initHelp;
                dirtyMap[field] = false;
                this.handleChange();
            });
            dispatcher.addListener(EVENTS.CONTROLLER_DESTORY, field => {
                delete dataStore[field];
                delete helpMap[field];
                delete dirtyMap[field];
                this.handleChange();
            });
            dispatcher.addListener(EVENTS.CONTROLLER_DIRTY, field => {
                dirtyMap[field] = true;
                this.handleChange();
            });
            dispatcher.addListener(EVENTS.CONTROLLER_CHANGE, (field, value) => {
                dataStore[field] = value;
                this.handleChange();
            });
        }
        static propTypes = propTypes;
        static defaultProps = {
            defaultFormData: {},
            defaultHelpMap: {},
            checkMap: {},
            autoCheck: false,
            onChange: () => {},
            onSubmit: () => {}
        };

        static childContextTypes = {
            form: PropTypes.object
        };
        getChildContext() {
            return {
                form: this.form
            };
        }

        form = {
            key: uniqueId('form_store_'),
            dispatcher: null,
            dataStore: {},
            dirtyMap: {},
            helpMap: {},
            getFieldHelp: field => {
                return this.form.helpMap[field];
            },
            getFieldValue: field => {
                return this.form.dataStore[field];
            },
            isFieldValid: field => {
                const help = this.form.getFieldHelp(field);
                if (help === undefined) return true;
                let isValid = false;
                if (isFunction(validCheckValue)) {
                    isValid = validCheckValue(help);
                } else if (help === validCheckValue) {
                    isValid = true;
                }
                return isValid;
            },
            isFieldDirty: field => {
                return this.form.dirtyMap[field];
            },
            isValid: () => {
                for (let field in this.form.dataStore) {
                    if (!this.form.isFieldValid(field)) {
                        return false;
                    }
                }
                return true;
            }
        };

        componentDidMount = () => {
            this._oldFormData = this.getFormData();
            this.setFormData(this.props.defaultFormData);
            this.setHelpMap(this.props.defaultHelpMap);
        };
        componentWillUnmount = () => {
            this.dispatcher.destory();
        };
        componentWillReceiveProps = nextProps => {
            if (!this.shallowCompareProps(this.props, nextProps)) {
                this.handleChange();
            }
        };
        shouldComponentUpdate = () => {
            return false;
        };

        shallowCompareProps = (props, nextProps) => {
            for (let propKey in propTypes) {
                if (props[propKey] !== nextProps[propKey]) {
                    return false;
                }
            }
            return true;
        };

        getFormData = () => ({
            ...this.form.dataStore
        });
        setFormData = formData => {
            each(formData, (value, field) => {
                this.dispatcher.dispatch(`${field}-${EVENTS.CONTROLLER_SET_VALUE}`, value);
            });
        };
        getHelpMap = () => ({ ...this.form.helpMap });
        setHelpMap = helpMap => {
            each(helpMap, (help, field) => {
                this.form.helpMap[field] = help;
            });
        };

        isValid = () => this.form.isValid();

        handleChange = debounce(() => {
            this.check();
            const formData = this.getFormData();
            this.props.onChange(formData, this._oldFormData, this.form.isValid());
            this._oldFormData = formData;
            this.forceUpdate();
        }, debounceWait);

        check = () => {
            const { checkMap } = this.props;
            const { helpMap } = this.form;
            const formData = this.getFormData();
            each(checkMap, (check, field) => {
                if (isFunction(check)) {
                    helpMap[field] = check(formData[field], { ...formData });
                } else {
                    console.warn(`The check function for field ${field} is not a function`);
                }
            });
        };

        forceCheckAll = () => {
            const { dirtyMap } = this.form;
            each(dirtyMap, (dirty, field) => {
                dirtyMap[field] = true;
            });
            this.handleChange();
        };

        handleSubmit = e => {
            this.forceCheckAll();
            this.props.onSubmit(this.getFormData(), this.isValid());
            e.preventDefault();
        };

        render() {
            /* eslint-disable no-unused-vars */
            const { defaultFormData, checkMap, defaultHelpMap, autoCheck, onChange, onSubmit, ...rest } = this.props;
            /* eslint-enable no-unused-vars */
            return <WrapperComponent {...rest} onChange={() => {}} onSubmit={this.handleSubmit} />;
        }
    }
    return Form;
}
export default hoc;
