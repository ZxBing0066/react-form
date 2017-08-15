import React, { Component } from 'react'

import controllerHoc from './controller-hoc.jsx'

let Input = ({ onChange, ...rest }) => {
    return (
        <input {...rest} onChange={e => onChange(e.target.value)} />
    )
}
Input = controllerHoc(Input, { defaultValue: '' })

class Select extends Component {
    // hack when the init value of select is not correct
    // when there is no option equal to the default value but the select will auto select the first options with out call the onChange handle
    // this will not call the onChange in form
    getInitValue = () => {
        return this.ref.value
    }

    render() {
        let { onChange, ...rest } = this.props
        return <select {...rest} ref={_ref => this.ref = _ref} onChange={e => onChange(e.target.value)} />
    }
}
Select = controllerHoc(Select, { defaultValue: '' })

export {
    Input,
    Select
}