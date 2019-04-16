## 说明

vuecli3 基本框架


## 常用命令

```
安装插件
yarn install

项目启动
yarn serve

项目打包
yarn build

分析打包体积
yarn analyz

提交代码
yarn push
```

## 项目结构

```
- src
    - api               // 接口管理目录
    - assets            // 图片资源目录
    - common            // 公共资源目录(函数库、请求封装)
    - components        // 组件目录
    - config            // 配置文件目录
        - env.js            // 环境配置
    - fliters           // 公共过滤器
    - layouts           // 外层布局
    - locale            // i18n语言目录
    - router            // 路由
    - store             // Vuex管理目录
    - style             // 公共样式目录
    - views             // 页面目录
```

## 推荐规范


页面命名：

```
Vue中什么都是组件，包括页面，但是我们为了与UI、业务组件作出区分，凡是页面组件的命名均以"小驼峰法"命名，如：home.vue。
```

变量命名：
```
常量——全大写+下划线，如：

let IMAGE_SERVER = 'http://img.alibaba.com';
let MAX_LENGTH = 200;

变量——小驼峰式命名法，如：
let maxCount = 10;
let tableTitle = 'LoginTable';

全局变量——g+变量名，如：
var gConfig = {
   a:1,
   b:2
};

私有变量——下划线+变量名，如：
let _name = '小明';
```
2、样式

样式统一在 style 文件夹里维护

    |- common.scss  里面放公共的、全局的、使用频率比较高的样式，这样可以方便组织样式。如：.hide{display: none;}
    |- mixin.scss   里面放全局的样式方法，已经在webpack中全局引入，使用的时候 @include ct();
    |- reset.scss   里面放页面样式重置的css，不需要修改
    |- var.scss     里面放公共变量，方便全局样式，如：颜色、字体大小等

3、vuex

store 按页面或者业务划分，然后统一由 store/index.js 输出

所有的mutations方法，需要现在最外层的 mutation-type.js 说明后，然后在单个 mutations.js 中引入使用

4、请求

请求统一在 api 文件夹下管理，可以按照页面或者业务划分。所有的请求放在vuex的action中，不得放在页面内，数据统一存储在state中，取数据用getter，修改用mutations，保持数据的单向性。

```
如何Vuex的作用及处理数据的方式？

在前端可以把Vuex看做后端mvc中的m层，即数据处理层，它与控制器分开，只有它与数据库接触，控制器只是用它调用或是获取数据，并不能直接修改数据库数据，也是需要m层来修改数据库。

而在Vuex（store）中，action就负责取数据（请求接口），getter负责处理数据返回相应格式，mutation负责改变数据（即改变数据库），而state就是那个数据库。

即Vuex就是单纯做数据处理的，它应该与页面分开，保持数据的独立和单向性。
```

5、格式化方法

数据的格式化，如时间戳、隐藏手机号、格式化银行卡等操作，不建议在vue页面中用方法修改数据，建议在 fliters 中说明过滤器，然后在模版中 {{data | fliter}} 格式化数据，可以使数据更干净。

6、语言

建议一直使用i18n作为语言的处理工具，方便国际化和统一管理，它在 config/lang 中（建议按页面区分）。

它的使用方法是，在.vue文件中 {{$t('name')}}

在js中，获取当前语言的方法是，console.log(this.$i18n.locale)，设置语言的方法同样 this.$18n.local = 'zh-CN'

7、vue-router

统一采用按需加载，如：const Home = () => import( /* webpackChunkName: "home" */ '../views/home.vue')，其中的 webpackChunkName 指的是打包出来的包名。

8、布局

布局在 layouts 文件夹中，然后在 App.vue 中引入，放在了路由的最外层，充当整个项目的公共布局，如：页眉、页脚等。



## 常见问题



我怎么在组件中引入图片？

```
图片目录在src/assets下，在组件中引入方式如下：
<img :src="reuqire('@/assets/img/demo.png')" alt="" />

Tips：建议动态引入，避免调整页面带来的路径问题
```

我怎么无视层级导入css，或是引入图片？

```
使用 ~

@import "~@/scss/_var.css";
@import "~@/assets/iconfont/iconfont.css";
background: url("~@/assets/img/xxx.png");

原理：
CSS loader 会把把非根路径的url解释为相对路径，加~前缀才会解释成模块路径。
```


我想在本地和服务端调试怎么弄？

```
修改 vue.config.js 中的 proxy 为你的服务端地址即可，如：

proxy: 'http://xxx.com'
```

我引入了第三方组件，如何修改样式？

```
有两个方法可以解决这个问题：

方法一：
在scoped的scss中使用 >>> 或者 /deep/ ，它们是vue提供的"深度作用选择器"，你可以参考 —— https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8
<style scoped>
    .a >>> .b { /* ... */ }
    .a /deep/ .b { /* ... */ }
</style>

方法二：
单独写一个style，不加scoped，在这里面单独修改
<style>
    .a .b { /* ... */ }
</style>

```

```

时间戳：{{1544179366 | timeFilter}} => 2018-12-07 18:42:46
手机格式化：{{15311959057 | formatPhone}} => 153****9057
银行卡格式化：{{123123123123132 | formatBank}} => 1231 2312 3123 132
千分位分隔符：{{5000039 | toThousands}} => 5,000,039

如果你需要自定义一些方法，可以在 src/filters/index.js 里自己添加，用法和示例一样。

```

在做微信分享的时候wx.config总是不过，一直报"invalid signature"

```
vue这样引入sdk
yarn add weixin-js-sdk
import wx from 'weixin-js-sdk'

1、vue-router用hash模式
2、wx.config里面的url要动态获取并且encode，直接把这个换上去 encodeURIComponent(location.href.split('#')[0])
3、wx.config放到页面mounted里面，生命周期放的越前越好

为什么？
首先，wx.config里面的url必须是动态获取的，不能写死，因为在分享的时候微信会给你在链接里下毒，没毒不让分享。
其次，url必须和你后台配置的js安全域名一样，本地测试不了你可以放到开发环境测试，实在不行你过来打我。

```


我用你这个开发微信公众号，在IOS手机上下滑动的时候，整个页面就被拖着走，这个怎么解决？

```
使用iNoBounce，使用方法：
1、在public文件夹下自己创建一份inobounce.min.js
2、然后在index.html加这段代码 <script src="./inobounce.min.js"></script>

github地址：https://github.com/wangyupo/iNoBounce
```

加上iNoBounce以后IOS不能滚动什么情况？部分页面不能滚动又是什么情况？

```
所有页面都不能滚动
在最外层加这样的css：
overflow-y:scroll;
-webkit-overflow-scrolling:touch;

如果有单个页面不滚动，比如你在页面里面加了vant的list组件，发现页面不能上下滑动
本页面最外层的css这样写：
height: 100vh;
overflow-y:scroll;
-webkit-overflow-scrolling:touch;
```

