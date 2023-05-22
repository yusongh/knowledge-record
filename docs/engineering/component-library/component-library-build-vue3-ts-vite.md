# vue3-ts-vite 组件库搭建

- 项目地址
[components-vue3-study](https://github.com/yusongh/components-vue3-study)

## 搭建monorepo环境

### 初始化项目
```shell
npm install pnpm -g

pnpm init
```

### 修改`package.json`
- 去掉`name`，这个根目录是不用发布的
- 添加`"private": true`为私有仓库

### 根目录下添加`.npmrc`文件
```
shamefully-hoist = true
```

由于使用pnpm安装包，暴露在`node_modules`下的只有是直接安装的包（以软连的形式，实际的包是在`node_modules/.pnpm`里面）

这样设计是为了解决`幽灵依赖`导致的问题，幽灵依赖即用户没有安装的包（即没有在`package.json`中定义的），但是可以引用。

比如安装的`vue`依赖的响应式`reactive`模块，虽然用户没有直接安装，但是可以引用。但是如果用户直接暗转的`vue`后续把它依赖的`reactive`移除掉了，会导致该项目出现问题。

详细可查看该文章，[前端包管理器的依赖管理原理](https://blog.csdn.net/Taobaojishu/article/details/123700366)

但是目前项目希望可以使用到`直接安装的包`（在`package.json`中定义的）的依赖包，因此需要在`.npmrc`中添加该配置

### 安装依赖
```shell
pnpm add vue typescript
```

### 初始化ts
```shell
pnpm tsc --init
```

### 修改tsconfig.json
```json
{
  "compilerOptions": {
    "module": "ESnext", // 打包模块类型为esnext
    "declaration": false, // 默认不要声明文件
    "noImplicitAny": true, // 不允许隐式的any类型
    "removeComments": true, // 移除注释
    "moduleResolution": "Node", // 按照node模块来解析
    "esModuleInterop": true, // 支持es6，commonjs模块的互操作
    "jsx": "preserve", // jsx 不转
    "noLib": false, // 不处理类库
    "target": "es6", // 遵循es6版本
    "sourceMap": true,
    "lib": ["ESNext", "DOM"], // 编译时用的库
    "allowSyntheticDefaultImports": true, // 允许没有导出的模块中导入
    "forceConsistentCasingInFileNames": true, // 强制区分大小写
    "resolveJsonModule": true, // 解析json模块
    "strict": true, // 是否启动严格模式
    "skipLibCheck": true // 跳过类库检测
  },
  "exclude": ["node_modules", "**/__tests__", "dist/**"] // 排除掉那些类库
}

```

### 新建目录
```
project
│   
└───docs # 组件文档目录
│   │   ...
│   │   ...
└───packages # 组件相关目录
    │
    └─── components # 组件目录
    │
    └─── theme-chalk # 组件样式
    │
    └─── utils # 组件公共方法目录
```

#### 新建pnpm monorepo配置文件`pnpm-workspace.yaml`
```yaml
- packages:
  - play # 组件的测试demo
  - docs # 组件的文档
  - "packages/**" # 组件相关的目录
```

#### 初始化对应目录
```shell
cd packages/components && pnpm init
cd packages/theme-chalk && pnpm init
cd packages/utils && pnpm init

```

并修改对应的`package.json`的`name`和其他字段

#### 将上面三个项目安装到根目录，以便其他项目调用
使用`-w`参数是告诉pnpm，安装的包是在work-space中的
```shell
pnpm add @yusongh/components @yusongh/utils @yusongh/theme-chalk -w
```

## 创建组件的测试环境`play`

### 初始化
```shell
# 创建项目
pnpm create vite play --template vue-ts

# 安装依赖
pnpm i
```

### 将`.vue`模块声明提到根目录下的`typings/vue-shim.d.ts`
由于该声明，后面`packages/components`中也会使用到，所以提到根目录下管理

将`play/src/vite-env.d.ts`中的`.vue`模块的生命移到`typings/vue-shim.d.ts`
```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### 在`play/tsconfig.json`中的`include`增加配置
```diff
{
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
+   "../typings/*.d.ts"
  ]
}
```

### 根目录下的`package.json`增加命令
> -C，是指定在哪个目录下启动pnpm
```diff
{
  "scripts": {
    "dev": "pnpm -C play dev"
  }
}
```

## 实现BEM类名规范

### 新建`packages/utils/craete-bem.ts`
```typescript
// 通过js实现BEM规范
// B - block 代码块   z-button
// E - element 元素   z-button__element
// M - modifier 装饰  z-button__element--disabled
// state 状态 is-checked is-enabled

// :class=[bem.b()]

// z-button-box__element--disabled
function _bem(prefixName: string, blockSuffix: string, element: string, modifier: string) {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }
  if (element) {
    prefixName += `__${element}`
  }
  if (modifier) {
    prefixName += `--${modifier}`
  }

  return prefixName
}


function createBEM(prefixName: string) {
  const b = (blockSuffix: string) => blockSuffix ? _bem(prefixName, blockSuffix, '', '') : ''
  const e = (element: string) => element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string) => modifier ? _bem(prefixName, '', '', modifier) : ''
  const be = (blockSuffix: string, element: string) => blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  const bm = (blockSuffix: string, modifier: string) => blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : ''
  const em = (element: string, modifier: string) => element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bem = (blockSuffix: string, element: string, modifier: string) => blockSuffix && element && modifier ? _bem(prefixName, blockSuffix, element, modifier) : ''
  const is = (name: string, state: boolean | string) => state ? `is-${name}` : ''

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is
  }
}

export function createNameSpace(name: string) {
  const prefixName = `y-${name}`
  return createBEM(prefixName)
}

```

## 开发组件

### 新建`packages/utils/with-install.ts`

该方法为组件添加install方法。以供app.use使用

```typescript
import { Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export function withInstall<T>(comp: T) {
  // 实现install方法。供app.use 使用
  (comp as SFCWithInstall<T>).install = function (app) {
    // 将组件注册成为全局组件
    const { name } = comp as unknown as { name: string }
    app.component(name, comp)
  }

  return comp as SFCWithInstall<T>
}
```

### 新建`packages/components/icon/index.ts`
此文件为`icon`组件的统一出口，后续项目中单独引入该组件的入口

```typescript
// 用来整合组件的，最终实现导出组件
import _Icon from './src/icon.vue'
import { withInstall } from '@yusongh/utils/with-install'

// 导出组件，既要满足import后单独使用，也要满足app.use来全局注册
export default withInstall(_Icon)

// 导出src/icon.ts的组件属性和属性类型等
export * from './src/icon'
```

### 新建`packages/components/icon/src/icon.ts`
此文件主要定义组件的属性和ts类型

```typescript
// 存放组件相关的属性 和 ts类型
import { ExtractPropTypes, PropType } from 'vue'

// as const 是设置为只读
// PropType泛型 为定义prop类型的
export const iconProps = {
  color: String,
  size: [String, Number] as PropType<string | number>
} as const

// 使用vue提供的泛型 ExtractPropTypes
export type IconType = ExtractPropTypes<typeof iconProps>
```

### 新建`packages/components/icon/src/icon.vue`

安装`unplugin-vue-define-options`，用于配置组件的`name`属性
```shell
pnpm add unplugin-vue-define-options -D -w
```

在`play/vite.config.ts`中使用

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import defineOptions from 'unplugin-vue-define-options/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), defineOptions()]
})

```

icon组件代码
```vue
<template>
  <i :class="bem.b('')" :style="style">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { createNameSpace } from '@yusongh/utils/create-bem'
import { iconProps } from './icon';

// 定义name
defineOptions({
  name: 'YIcon'
})

// bem类型
const bem = createNameSpace('icon')

// 定义组件的props
const props = defineProps(iconProps)

// 通过计算属性计算出icon的样式
const style = computed(() => {

  return {
    ...(props.color ? { color: props.color } : {}),
    ...(props.size ? { 'font-size': props.size + 'px' } : {})
  }
})

</script>
```

### 在`play`使用
```typescript
// main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import YIcon from '@yusongh/components/icon'

const app = createApp(App)
app.use(YIcon)

app.mount('#app')

```
```vue
<!-- app.vue -->
<script setup lang="ts">
</script>

<template>
  <y-icon>test</y-icon>
</template>

<style scoped>
</style>

```

### 问题
使用的时候会发现，组件没有我们新增的属性提示

解决改问题的方法就是，通过官方提供的vscode的插件`volar`，然后扩展`volar`的类型为该组件添加声明

在`packages/components/icon/index.ts`添加以下声明
```typescript
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    YIcon: typeof Icon
  }
}
```
