import type { SidebarConfig } from 'vuepress'

export const sidebar: SidebarConfig = {
  // 不同子路径下的页面会使用不同的侧边栏
  '/javascript': [
    '/javascript/regular-expression.md',
  ],
  '/typescript': [
    '/typescript/getting-started-notes.md',
    '/typescript/problem-record.md',
    '/typescript/deeper-learning',
    '/typescript/deep-learning',
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
  ],
  '/html-css': [
    '/html-css/css.md',
  ],
  '/rear-end/data-base': [
    '/rear-end/data-base/mongodb.md',
  ],
}
