import React, { Component } from 'react'

import controllerHoc from './controller-hoc.jsx'

const Input = ({ onChange, ...rest }) => {
    return (
        <input {...rest} onChange={e => onChange(e.target.value)} />
    )
}

export default {
    Input: controllerHoc(Input, {})
}