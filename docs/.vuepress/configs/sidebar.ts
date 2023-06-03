import type { SidebarConfig } from 'vuepress'

export const sidebar: SidebarConfig = {
  // 不同子路径下的页面会使用不同的侧边栏
  '/javascript': [
    '/javascript/regular-expression.md',
    '/javascript/closure.md',
    '/javascript/js-execution-context-stack-scope.md',
    '/javascript/html5-drag.md',
  ],
  '/typescript': [
    '/typescript/getting-started-notes.md',
    '/typescript/problem-record.md',
    '/typescript/deeper-learning',
    '/typescript/deep-learning',
  ],
  '/front-end-frame/vue/vue2': [
    '/front-end-frame/vue/vue2/vue2.md',
  ],
  '/front-end-frame/vue/vue3': [
    '/front-end-frame/vue/vue3/vue3.md',
  ],
  '/front-end-frame/react': [
    '/front-end-frame/react/react.md',
  ],
  '/engineering/specifications': [
    '/engineering/specifications/front-end-specifications.md',
  ],
  '/engineering/component-library': [
    {
      text: '组件库',
      children: [
        '/engineering/component-library/component-library-build-vue3-ts-vite.md'
      ]
    },
  ],
  '/engineering/deploy': [
    {
      text: '部署',
      children: [
        '/engineering/deploy/frontend-docker-deploy.md'
      ]
    }
  ],
  '/engineering/packaging-tools': [
    '/engineering/packaging-tools/webpack.md',
    '/engineering/packaging-tools/browserslist.md',
  ],
  '/problems/work': [
    '/problems/work/problems-work.md',
  ],
  '/problems/study': [
    '/problems/study/element-ui.md',
    '/problems/study/other.md',
    '/problems/study/problem-thinking-record.md',
    '/problems/study/typescript.md',
  ],
  '/html-css': [
    '/html-css/css.md',
  ],
  '/interview-questions': [
    '/interview-questions/js',
      '/interview-questions/css',
      '/interview-questions/vue2',
      '/interview-questions/vue3',
  ],
  '/rear-end/data-base': [
    '/rear-end/data-base/mongodb.md',
  ],
}
