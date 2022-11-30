/* eslint-disable prettier/prettier */
const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')
// eslint-disable-next-line import/extensions
const common = require('./webpack.common.js');

module.exports = merge(common,{
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':JSON.stringify('production')
        })
    ]
})