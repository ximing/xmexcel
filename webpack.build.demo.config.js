/**
 * Created by yeanzhi on 17/2/25.
 */
const {
    resolve
} = require('path');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        'demo': [
            './example/index.js'
        ]
    },
    output: {
        filename: '[name].[hash].js',
        sourceMapFilename: '[file].[hash].map',
        path: resolve(__dirname, 'demo'),
        publicPath: './'
    },
    devtool: 'cheap-module-eval-source-map',

    performance: {
        hints: false
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
    externals: {
        jquery: 'jQuery',
        lodash: '_'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title:'test',
            template:"example/tpl.ejs",
            inject:false
        })
    ]
};
