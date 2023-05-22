# Typescript

## 1.【TS7053错误】Element implicitly has an 'any' type because expression of type 'number' can't be used to index type

typescript中使用变量作为索引来访问未知类型，例如泛型对象成员时，会报错TS7053

```javascript
Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ 401: () => void; 402: () => void; 403: () => void; }'.
```

```typescript
const errHandleTable = {
  401: () => {
    nav('/login')
  },
  402: () => {
    window.alert('请付费后观看!')
  },
  403: () => {
    window.alert('没有权限')
  }
}

let a = 403
errHandleTable[a]()
a = 402
```

可以按照下面的方法解决，但是还不知道为啥可以解决

```typescript
const errHandleTable: Record<string, () => void> = {
  401: () => {
    nav('/login')
  },
  402: () => {
    window.alert('请付费后观看!')
  },
  403: () => {
    window.alert('没有权限')
  }
}

let a = 403
errHandleTable[a]()
a = 402

```

或者这样

```typescript
interface Table {
  [k: number]: () => void
}
const errHandleTable: Table = {
  401: () => {
    nav('/login')
  },
  402: () => {
    window.alert('请付费后观看!')
  },
  403: () => {
    window.alert('没有权限')
  }
}

let a = 403
errHandleTable[a]()
a = 402
```

或者这样: https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression#element-implicitly-has-an-any-type-because-expression-of-type-string-cant-be-used-to-index-type

```typescript
const errHandleTable = {
  401: () => {
    nav('/login')
  },
  402: () => {
    window.alert('请付费后观看!')
  },
  403: () => {
    window.alert('没有权限')
  }
}

let a = 403
errHandleTable[a as keyof typeof errHandleTable]()
a = 402
```
