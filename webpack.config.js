var path = require('path');
var html = require('html-webpack-plugin');

module.exports = {
    "mode": "development",
    "entry": "./src/js/index.js",
    "output": {
        "path": __dirname + '/dist/',
        "filename": "bundle.js",
    },
    "devServer": {
        "contentBase": path.join(__dirname, "dist"),
        "compress": true,
        "port":9000
    },
    plugins: [
        new html()
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
            }
        ]
    }
};
