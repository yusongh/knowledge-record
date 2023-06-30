# vue2

## 1. vue-cli4.x+vue2.6升级vue2.7 实录

### 动机

在工作中，因业务开发的压力没有时间升级`vue3.x`，确想使用`vue3.x的组合式 API (Composition API)`，至于组合式API这里就不展开讲了，可自行查看[官方文档](https://cn.vuejs.org/guide/extras/composition-api-faq.html#composition-api-faq)

而`vue2.7`则提供了内置的`组合式API`支持，因此这就涉及到在现在的项目基础上升级到vue2.7过程，[官方迁移文档](https://v2.cn.vuejs.org/v2/guide/migration-vue-2-7.html)

### 升级步骤

#### 1. 升级本地 `@vue/cli-xxx` 相关依赖版本至 `~4.5.18`

```javascript
// 升级前
// "@vue/cli-plugin-babel": "~4.5.0",
// "@vue/cli-plugin-eslint": "~4.5.0",
// "@vue/cli-plugin-router": "~4.5.0",
// "@vue/cli-plugin-vuex": "~4.5.0",
// "@vue/cli-service": "~4.5.0",

// 升级后
"@vue/cli-plugin-babel": "~4.5.18",
"@vue/cli-plugin-eslint": "~4.5.18",
"@vue/cli-plugin-router": "~4.5.18",
"@vue/cli-plugin-vuex": "~4.5.18",
"@vue/cli-service": "~4.5.18",
```

#### 2. 将 `vue` 升级至 `^2.7.0`

```javascript
// 升级前
// "vue": "^2.6.11",

// 升级后
"vue": "^2.7.0",
```

#### 3. 移除 `vue-template-compiler` 依赖

#### 4. 安装 `vue-loader` 依赖

```javascript
"vue-loader": "^15.10.0"
```

否则会出现下列的报错

![没有安装vue-loader@15的报错](../../../.vuepress/public/images/front-end-frame/vue/vue2/update-2.7/%E6%B2%A1%E6%9C%89%E5%AE%89%E8%A3%85vue-loader15%E7%89%88%E6%9C%AC%E7%9A%84%E6%8A%A5%E9%94%99.png)

#### 5. 升级

```javascript
// 升级前
"eslint-plugin-vue": "^6.2.2",

// 升级后
"eslint-plugin-vue": "^9.0.0",
```

### 注意事项

#### 1. 不能移除 `package-lock.json` 来重新安装依赖，否则会出现下列报错

![删除package-lock.json后重新安装出现的找不到html-webpack-plugin找不到问题](../../../.vuepress/public/images/front-end-frame/vue/vue2/update-2.7/%E5%88%A0%E9%99%A4package-lock.json%E5%90%8E%E9%87%8D%E6%96%B0%E5%AE%89%E8%A3%85%E5%87%BA%E7%8E%B0%E7%9A%84%E6%89%BE%E4%B8%8D%E5%88%B0html-webpack-plugin%E6%89%BE%E4%B8%8D%E5%88%B0%E9%97%AE%E9%A2%98.png)

![删除package-lock.json后重新安装出现的报错问题](../../../.vuepress/public/images/front-end-frame/vue/vue2/update-2.7/%E5%88%A0%E9%99%A4package-lock.json%E5%90%8E%E9%87%8D%E6%96%B0%E5%AE%89%E8%A3%85%E5%87%BA%E7%8E%B0%E7%9A%84%E6%8A%A5%E9%94%99%E9%97%AE%E9%A2%98.png)

### 使用过程的问题

#### 1. 如何在 `vue-router@3.x` 版本中定义组件内导航守卫

##### （1）使用 `defineComponent` 方法

```vue
<script>
import { defineComponent } from "vue";

export default defineComponent({
  beforeRouteEnter: (to, from, next) => {
    // do somethings...
  }
});
</script>

<script setup>
// do somethings...
</script>
```

##### （2）使用 `unplugin-vue-define-options`

unplugin-vue-define-options [官方文档](https://www.npmjs.com/package/unplugin-vue-define-options)

安装

```shell
npm i unplugin-vue-define-options -D
```

使用

vue.config.js中添加插件

```javascript
module.export = {
  configureWebpack(config) {
    config.plugins.push(require("unplugin-vue-define-options/webpack")())
  }
}
```

```vue
<script>
import { defineComponent } from "vue";

defineOptions({
  beforeRouteEnter(to, from, next) {
    // do somethings...
  }
});
</script>
```

