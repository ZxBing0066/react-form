import React, { Component } from 'react'

import controllerHoc from './controller-hoc.jsx'

let Input = ({ onChange, ...rest }) => {
    return (
        <input {...rest} onChange={e => onChange(e.target.value)} />
    )
}
Input = controllerHoc(Input, {})
export {
    Input
}