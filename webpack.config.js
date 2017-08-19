const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'index.jsx'),
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css']
    },
    externals: ['react', 'prop-types'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
