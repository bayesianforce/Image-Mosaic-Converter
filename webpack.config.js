// eslint-disable-next-line flowtype/require-valid-file-annotation
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseDevConfig = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        App: path.resolve(__dirname, 'src/index.js'),
    },
    externals: [],
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
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
    plugins: [
        new CopyWebpackPlugin({patterns: [{from: 'index.html', to: './'}]}),
    ],
    watch: false,
};
const serviceWorkerConfig = webpackMerge.smart(baseDevConfig, {
    entry: './src/worker.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'worker.js',
    },
});

module.exports = [serviceWorkerConfig, baseDevConfig];
