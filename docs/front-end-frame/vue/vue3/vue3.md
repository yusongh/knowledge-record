# vue3
a# vue3

## 1. vue3-watch监听props

### 父组件

```vue
<template>
  <div class="home-page">
    <TestVue :title="title" :obj="obj"></TestVue>
    <div>title: {{ title }}</div>
    <div>obj: {{ obj }}</div>
    <button @click="changeTitle">change title</button>
    <button @click="changeTitleProps">change title props</button>
    <button @click="changeObj">change obj</button>
  </div>
</template>

<script setup>
import TestVue from "./TestVue.vue";
import { ref, reactive } from "vue";

const title = ref({abc: '123'});
const obj = reactive({
  abc: '1234'
})

const changeTitle = () => {
  title.value = {abc: '123'}
}

const changeTitleProps = () => {
  title.value.abc += '123'
}

const changeObj = () => {
  obj.abc += '3465'
}
</script>

<style lang="less" scoped></style>

```

### 子组件

```vue
<template>
  <div class="home-page">
    
  </div>
</template>

<script setup>
import { toRefs, watch, defineProps, isRef, isReactive } from "vue";

const props = defineProps({
  title: {
    type: Object
  },
  obj: {
    type: Object
  }
})
const {title, obj} = toRefs(props)

console.log('props', props);
console.log('props.title', props.title);
console.log('title', title);
console.log('props.obj', props.obj);
console.log('obj', obj);

console.log('props.title is Ref', isRef(props.title));
console.log('props.title is Reactive', isReactive(props.title));
console.log('title is Ref', isRef(title));
console.log('title is Reactive', isReactive(title));
console.log('props.obj is Ref', isRef(props.obj));
console.log('props.obj is Reactive', isReactive(props.obj));
console.log('obj is Ref', isRef(obj));
console.log('obj is Reactive', isReactive(obj));

watch(title, () => {
  console.log('ref title改变了');
})
watch(() => title, () => {
  console.log('ref fn title改变了');
})
watch(props.title, () => {
  console.log('props title改变了');
})
watch(() => props.title, () => {
  console.log('props fn title改变了');
})
watch(obj, () => {
  console.log('ref obj改变了');
})
watch(() => obj, () => {
  console.log('ref fn obj改变了');
})
watch(props.obj, () => {
  console.log('props obj改变了');
})
watch(() => props.obj, () => {
  console.log('props fn obj改变了');
})
</script>

<style lang="less" scoped></style>


```


### 使用层面结论

#### 传入的prop为ref

以下两种方法可以触发watch

```js
watch(() => props.title, () => {
  console.log('props fn title改变了');
})

watch(title, () => {
  console.log('ref title改变了');
})

```

#### 传入的prop为reactive

只有一种方法可以触发watch

```js
watch(props.obj, () => {
  console.log('props obj改变了');
})

```
