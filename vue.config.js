// vue.config.js
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

// cdn预加载使用
const externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
}
const cdn = {
    // 开发环境
    dev: {
        css: [
        ],
        js: []
    },
    // 生产环境
    build: {
        css: [
        ],
        js: [
            'https://lib.baomitu.com/vue/2.6.6/vue.min.js',
            'https://lib.baomitu.com/vue-router/3.0.1/vue-router.min.js',
            'https://lib.baomitu.com/vuex/3.0.1/vuex.min.js',
            'https://lib.baomitu.com/axios/0.18.0/axios.min.js',
        ]
    }
}

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // 使用运行时编译器的 Vue 构建版本
    runtimeCompiler: true,
    publicPath:'./',//打包出现白屏请打开这里
    // 开启生产环境SourceMap，设为false打包时不生成.map文件
    productionSourceMap: false,

    // 关闭ESLint，如果你需要使用ESLint，把lintOnSave设为true即可
    lintOnSave: false,

    devServer: {
        open: false,        // 是否自动打开浏览器页面
        host: '0.0.0.0',    // 指定使用一个 host，默认是 localhost
        port: 8080,         // 端口地址
        https: false,       // 使用https提供服务
        // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
        proxy: ''
    },

    chainWebpack: (config) => {
        config.plugin('html').tap(args => {
            if (process.env.NODE_ENV === 'production') {
                args[0].cdn = cdn.build
            }
            if (process.env.NODE_ENV === 'development') {
                args[0].cdn = cdn.dev
            }
            return args
        })
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
    },

    configureWebpack: config => {
        // 生产环境打包分析体积
        if (isProduction) {
             // externals里的模块不打包
             Object.assign(config, {
                externals: externals
            })
            // 上线压缩去除console等信息
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            // 开启gzip压缩
            const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
            // 打包后模块大小分析//npm run build --report
            config.plugins.push(new BundleAnalyzerPlugin())
        }else{
             // 为开发环境修改配置...   
        }
        // if (process.env.NODE_ENV === 'production') {
        //     return {
        //         plugins: [
        //             new BundleAnalyzerPlugin()
        //         ]
        //     }
        // }
    },
    css: {
        loaderOptions: {
            sass: {
                data: `
                @import "@/style/mixin.scss";
                @import "@/style/_var.scss";
                `
            }
        }
    },
};
