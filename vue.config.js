const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
//插件-px 转rem
// const autoprefixer = require("autoprefixer");
// const pxtorem =  require("postcss-pxtorem");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    //生成的生产环境构建文件的目录，该目录在构建之前会被清除，  --no-clean 可关闭改行为 build打包后的目录
    outputDir: 'dist',
    //放置生成的静态资源的目录
    assetsDir: 'assets',

    //指定生成的 index.html 的输入路径
    indexPath: 'index.html',
    //文件名hash 串 用于控制浏览器缓存，false关闭， 默认：true
    filenameHashing: true,
    //lintOnSave:process.env.NODE_ENV ≠ "production",
    //lintOnSave: 'error', // 设置eslint报错时停止代码编译
    lintOnSave: false,
    runtimeCompiler: true,

    // 打包时不生成.map文件
    productionSourceMap: false,

    devServer: {
        //让浏览器voerlay 同时显示警告错误
        overlay: {
            warnigs: false,
            errors: false,
        },
        open: true,  // npm run serve后自动打开页面
        host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
        //端口冲突修改
        //port: 3333,
        port: 2001, // 开发服务器运行端口号
        proxy: {
            '/liu': {
                target: 'http://41.208.9.228:18080',

                // target: 'http://41.205.32.246:18080',
                // target: 'http://192.168.10.56:8054', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/liu': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
            '/videoNz': {
                target: 'http://41.201.0.218:18080',

                // target: 'http://41.205.32.246:18080',
                // target: 'http://192.168.10.56:8054', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/videoNz': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
            '/api2': {
                // target: 'http://41.206.1.32:18888/jeecg-boot',
                // target: 'http://41.205.32.246:18888/jeecg-boot',

                // target: 'http://192.168.0.32:18888/jeecg-boot',

                // target: 'http://41.201.0.218:18888/jeecg-boot', 
                // 小翟的
                //target: 'http://192.168.2.105:18888/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                //target: 'http://192.168.2.25:18880/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                //target: 'http://172.16.0.104:18888/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                //蓬莱
                //target: 'http://172.16.0.147:18888/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                target: 'http://172.16.0.104:18888/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090

                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api2': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
            '/keda': {
                // target: 'http://41.206.1.32:18888/jeecg-boot',
                // target: 'http://41.205.32.246:18888/jeecg-boot',

                // target: 'http://192.168.0.32:18888/jeecg-boot',

                // target: 'http://41.201.0.218:18888/jeecg-boot', 
                target: 'http://172.16.0.104:9099', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/keda': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
            '/nima': {
                // target: 'http://41.206.1.32:18888/jeecg-boot',
                // target: 'http://41.205.32.246:18888/jeecg-boot',

                // target: 'http://192.168.0.32:18888/jeecg-boot',

                // target: 'http://41.201.0.218:18888/jeecg-boot', 
                target: 'http://41.211.252.151:18888/jeecg-boot', // 代理接口地址 247 1.193.39.196:8090 192.168.2.145:8080  192.168.12.10:8090
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/nima': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
            '/openUrl': {
                target: 'http://41.211.252.161:83/openUrl',

                // target: 'http://41.205.32.246:83/openUrl',

                // target: 'http://192.168.2.74:8888/jeecg-boot', 
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/openUrl': ''   //需要rewrite的, 这里理解成以'/api'开头的接口地址，把/api代替target中的地址
                }
            },
        }
    },
    chainWebpack: (config) => {
        // 移除 prefetch 插件(针对生产环境首屏请求数进行优化)
        config.plugins.delete('prefetch');
        // 移除 preload 插件(针对生产环境首屏请求数进行优化)   preload 插件的用途：https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
        config.plugins.delete('preload');
        // 第1个参数：别名，第2个参数：路径  （设置路径别名）
        config.resolve.alias
            .set('@pages', resolve('./src/page'))
            .set('@router', resolve('./src/router'))
            .set('@store', resolve('./src/store'))
            .set('@utils', resolve('./src/utils'));
    },
    // 配置打包 js、css文件为.gz格式，优化加载速度  （参考：https://blog.csdn.net/qq_31677507/article/details/102742196）
    //   打包后禁止在控制台输出console.log
    configureWebpack: config => {
        // if (process.env.NODE_ENV === 'production') {
        //     config.plugins.push(
        //         new TerserPlugin({
        //             terserOptions: {
        //                 ecma: undefined,
        //                 warnings: false,
        //                 parse: {},
        //                 compress: {
        //                     drop_console: true,
        //                     drop_debugger: false,
        //                     pure_funcs: ['console.log'] // 移除console
        //                 }
        //             },
        //         }),
        //     )
        // }
    },

    //配置全局样式变量
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/css/zdstyle.scss";`,
                sassOptions: {
                    outputStyle: 'expanded'
                }
            }
        }
    }

}