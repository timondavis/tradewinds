var path = require('path');
var html = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    "mode": "development",
    "entry": "./src/js/index.js",
    "output": {
        "path": __dirname + '/dist/',
        "filename": "bundle.js",
    },
    "devServer": {
        "host": '0.0.0.0',
        "contentBase": path.join(__dirname, "dist"),
        "compress": true,
        "port":80
    },
    plugins: [
        new html({
            template: __dirname + "/src/index.html",
            inject: "body"
        }),
        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    "sass-loader"
                ],
            },
        ]
    }
};
