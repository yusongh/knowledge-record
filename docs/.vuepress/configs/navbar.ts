import { NavbarConfig } from 'vuepress'

export const navbar: NavbarConfig = [
  {
    text: 'Javascript',
    children: [
      '/javascript/regular-expression.md',
      '/javascript/closure.md',
      '/javascript/js-execution-context-stack-scope.md',
      '/javascript/html5-drag.md',
      '/javascript/principles-of-browser-composition.md',
      '/javascript/webworker.md',
      '/javascript/web-storage.md',
    ]
  },
  { 
    text: 'Typescript',
    children: [
      { text: '入门笔记', link: '/typescript/getting-started-notes.md' },
      { text: '问题记录', link: '/typescript/problem-record.md' },
      { text: '较深入学习-2022-03-06', link: '/typescript/deeper-learning.md' },
      { text: '深入学习-2022-09-14', link: '/typescript/deep-learning.md' },
    ] 
  },
  {
    text: '前端框架',
    children: [
      {
        text: 'vue2',
        children: [
          '/front-end-frame/vue/vue2/vue2.md',
        ]
      },
      {
        text: 'vue3',
        children: [
          '/front-end-frame/vue/vue3/vue3.md',
        ]
      },
      {
        text: 'react',
        children: [
          '/front-end-frame/react/entering-react.md',
          '/front-end-frame/react/react-idea.md',
          '/front-end-frame/react/fiber-architecture.md',
        ]
      }
    ]
  },
  {
    text: '遇到的问题',
    children: [
      {
        text: '工作',
        children: [
          '/problems/work/problems-work.md'
        ]
      },
      {
        text: '学习',
        children: [
          '/problems/study/typescript.md',
          '/problems/study/element-ui.md',
          '/problems/study/other.md',
          '/problems/study/problem-thinking-record.md',
        ]
      },
    ]
  },
  {
    text: '工程化',
    children: [
      '/engineering/specifications/front-end-specifications.md',
      {
        text: '打包工具',
        children: [
          '/engineering/packaging-tools/webpack.md',
          '/engineering/packaging-tools/browserslist.md',
        ]
      },
      {
        text: '组件库',
        children: [
          { text: 'vue3-ts-vite-组件库搭建', link: '/engineering/component-library/component-library-build-vue3-ts-vite.md' }
        ]
      },
      {
        text: '部署',
        children: [
          { text: '前端docker部署', link: '/engineering/deploy/frontend-docker-deploy.md' }
        ]
      },
    ]
  },
  {
    text: 'html&css',
    children: [
      '/html-css/css.md',
    ]
  },
  {
    text: '面试题',
    children: [
      '/interview-questions/js',
      '/interview-questions/css',
      '/interview-questions/vue2',
      '/interview-questions/vue3',
    ]
  },
  {
    text: '后端',
    children: [
      {
        text: '数据库',
        children: [
          '/rear-end/data-base/mongodb.md',
        ]
      }
    ]
  }
]
