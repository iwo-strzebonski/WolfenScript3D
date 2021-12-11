const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    mode: 'development', // none, development, production
    devServer: {
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            favicon: './src/img/favicon.png',
            filename: './index.html',
            title: 'Wolfenstein 3D',
            template: './src/index.html',
            chunks: ['index']
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp3|wav)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
    },
}