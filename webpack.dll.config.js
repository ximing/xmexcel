'use strict';
const {
    resolve
} = require('path');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'common': [
            'react','classnames','react-dom','invariant','warning','babel-polyfill','rabjs/router','react-router','reduce-reducers',
            'react-router-redux','redux','react-redux','rabjs'
        ]
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'demo/dll')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use:[{
                    loader: 'babel-loader',
                    options: {
                        'presets': [
                            ['es2015', {
                                'modules': false
                            }], 'stage-0', 'react'
                        ],
                        'env': {},
                        'ignore': [
                            'node_modules/**',
                            'dist'
                        ],
                        'plugins': [
                            'react-hot-loader/babel',
                            'transform-decorators-legacy'
                        ]
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(png|jpg|jpeg|gif|woff|svg|eot|ttf|woff2)$/i,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            context: resolve(__dirname, 'demo/dll'),
            name: "[name]",
            path: path.join(__dirname, "demo/dll", "manifest.json"),
        })
    ]
};
