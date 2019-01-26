// @flow
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        App: `${__dirname}/js/client.js`,
    },
    externals: [],
    output: {
        path: `${__dirname}/dist/scripts`,
        filename: 'PhotoMosaic.min.js',
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    },
    plugins: [],
    watch: false,
};
