const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const config = {
    entry: './src/index.js', 
    output: {
        path: path.join(__dirname , 'dist'),
        filename: 'index_bundle.js'
    }, 
    module :{
        rules:[
            {
                test: /\.js$/ , 
                exclude: /node_modules/ , 
                use:{
                    loader: 'babel-loader'
                }, 
               
            }, 
          {  test:/\.css$/,
            use:
                 ['css-loader' , 'style-loader']
            
        }
        ]
    },
    devServer: { 
        historyApiFallback: true,
        inline: true, 
        contentBase: './dist', 
        port: 8080, 
        proxy: { "/api/**": { target: 'http://localhost:5000', secure: false }  }
     },
    plugins:[ new HTMLWebpackPlugin({
        template: './src/index.html'
    })]

}

module.exports = config