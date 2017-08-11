import React, { Component } from 'react'

class Controller extends Component {
    constructor(...args) {
        super(...args)
        this.controllerRefs = []
    }

    componentWillUnmount() {
        this.controllerRefs = []
    }

    
}

export default Controller