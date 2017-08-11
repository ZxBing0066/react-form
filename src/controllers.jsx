import React, { Component } from 'react'

import controllerHoc from './controller-hoc.jsx'

class Input extends Component {
    get value() {
        return this.input.value
    }
    render() {
        let { onChange, ...rest } = this.props
        return (
            <input {...rest} ref={_ref => this.input = _ref} onChange={e => onChange(e.target.value)} />
        )
    }
}

export default {
    Input: controllerHoc(Input, {})
}