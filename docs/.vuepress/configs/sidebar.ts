import type { SidebarConfig } from 'vuepress'

export const sidebar: SidebarConfig = {
  // 不同子路径下的页面会使用不同的侧边栏
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
    {
      text: 'webpack',
      children: [
        '/engineering/packaging-tools/webpack.md'
      ]
    }
  ]
}
