import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

let container = document.getElementById('container');

ReactDOM.render(<App />, container);

if (module.hot) {
    module.hot.accept('./App.jsx', function(args) {
        console.log('Accepting the updated App module!');
        const App = require('./App.jsx').default;
        ReactDOM.unmountComponentAtNode(container);
        ReactDOM.render(<App />, container);
    });
}
