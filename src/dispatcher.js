import findIndex from 'lodash/findIndex';

const dispatchers = {};

class Dispatcher {
    constructor(key) {
        this.key = key;
        this.listeners = {};
    }

    addListener(event, callback) {
        const listener = this.listeners[event] || [];
        listener.push(callback);
        this.listeners[event] = listener;
    }

    removeListener(event, callback) {
        const listener = this.listeners[event] || [];
        listener.push(callback);
        const index = findIndex(listener, _callback => _callback === callback);
        if (index >= 0) {
            listener.splice(index, 1);
        }
    }
    removeAllListener(event) {
        this.listeners[event] = [];
    }

    removeAllListeners() {
        this.listeners = {};
    }

    dispatch(event, ...args) {
        const listener = this.listeners[event] || [];
        listener.forEach(callback => callback(...args));
    }
    destory() {
        this.listeners = {};
        delete dispatchers[this.key];
    }
}

const EVENTS = {
    CONTROLLER_INIT: 'CONTROLLER_INIT',
    CONTROLLER_CHANGE: 'CONTROLLER_CHANGE',
    CONTROLLER_DESTORY: 'CONTROLLER_DESTORY',
    CONTROLLER_CHECK: 'CONTROLLER_CHECK',
    CONTROLLER_SET_VALUE: 'CONTROLLER_SET_VALUE',
    CONTROLLER_SET_HELP: 'CONTROLLER_SET_HELP',
    CONTROLLER_DIRTY: 'CONTROLLER_DIRTY'
};
const getDispatcher = key => {
    return dispatchers[key];
};
const createDispatcher = key => {
    return (dispatchers[key] = new Dispatcher(key));
};

export default Dispatcher;

export { createDispatcher, getDispatcher, EVENTS };
