const path = require('path');  //Nodejs中处理路径的基本包
const {VueLoaderPlugin} = require('vue-loader')
const isDev = process.env.NODE_ENV === 'development'   //判断是否为开发环境，process.env:存放启动脚本里存放的环境变量
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')  //非js代码单独打包成静态文件

const config = {
    target: 'web',   //编译目标是web平台
    entry: path.join(__dirname,'src/index.js' ),  //入口
    output: {
        filename: 'bundle.[hash:8].js',   //输出文件
        path: path.join(__dirname, 'dist')  //输出路径
    },
    plugins: [
      new webpack.DefinePlugin({    //根据不同环境webpack区分要打包的代码
         'process.env': {
             NODE_ENV: isDev ? '"development"' : '"production"'
         }
      }),
      new VueLoaderPlugin(),
      new HTMLPlugin()   //自动生成html,容纳js
    ],
    module: {
        rules: [                                //webpack只能处理js文件,且只识别ES5的语法
            {                                 //针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
                test:/\.vue$/,
                loader: 'vue-loader'
            },
            {
                test:/\.jsx$/,   //处理.jsx的文件
                loader: 'babel-loader'
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {    //配置loader
                            limit: 1024,     //  文件代码小于1024转成代码写到js里，减少http请求
                            name: '[name].[ext]'  //输出的文件名字
                        }
                    }
                ]
            }
        ]
    }
}

if (isDev) {
    config.devtool = '#cheap-module-eval-source-map'  //用source-map映射编译好的es6代码，在浏览器调试时看得懂代码
    config.devServer = {
        port: '8000',//启动端口
        host: '127.0.0.1',  //可以在别的电脑通过ip访问
        overlay: {
            errors: true,  //webpack出错时显示到网页
        },
        open: true,   //编译时自动打开浏览器
        hot: true,  //热加载:修改组建代码时，只重新渲染被修改的组件，不会渲染整个页面，即不会刷新
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),   //热加载插件
        new webpack.NoEmitOnErrorsPlugin()   //减少不需要的信息展示
    )
    config.module.rules.push(
        {
            test:/\.styl/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true   //使用stylus-loader生成的sourceMap，提升效率
                    }
                },
                'stylus-loader'
            ]
        },
    )
} else {
    config.entry = {
        app: path.join(__dirname,'src/index.js' ),
        vender: ['vue']  //类库代码
    }
    config.output.filename = '[name].[chunkhash:8].js'   //此处一定是chunkhash,因为用hash时app和vendor的hash码是一样的了,这
                                                        // 样每次业务代码更新,vendor也会更新,也就没有了意义.
    config.module.rules.push(
        {
            test:/\.styl/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true   //使用stylus-loader生成的sourceMap，提升效率
                    }
                },
                'stylus-loader'
            ]
        },
    )
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash:8].css'  //抽离出来的 CSS 文件将使用 contenthash，以区分 CSS 文件和 JS 文件的更新。
        }),
        new webpack.HashedModuleIdsPlugin(),    //将默认的数字 id 命名规则换成路径的方式，chunkhash 改变的就只有修改的文件
        new webpack.optimize.SplitChunksPlugin({
            name: 'vendor'    //单独打包类库文件
        }),
        new webpack.optimize.RuntimeChunkPlugin({    //将app.js文件中一些关于webpack文件的配置单独打包出为一个文件
            name: 'runtime'
        })
    )
}

module.exports = config


//额外笔记
// 为了一份理想的缓存文件，我们需要做这些事情：
// 抽离 boilerplate（[runtime & manifest）
// 将 module identifier 默认的数字标识方式转成使用路径标识
// JS 文件使用 chunkhash
// 抽离的 CSS 样式文件使用 contenthash
// gif|png|jpe?g|eot|woff|ttf|svg|pdf 等使用 hash
// 设置 namedChunks 为 true

