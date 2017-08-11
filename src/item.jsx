import React, { Component } from 'react'

class Item extends Component {
    constructor(...args) {
        super(...args)
        this.controllerRefs = []
    }

    componentWillUnmount() {
        this.controllerRefs = []
    }

    render() {
        return <div>{this.props.children}</div>
    }
}

export default Item