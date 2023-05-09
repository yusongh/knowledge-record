import type { SidebarConfig } from 'vuepress'

export const sidebar: SidebarConfig = {
  // 不同子路径下的页面会使用不同的侧边栏
  '/typescript': [
    '/typescript/getting-started-notes.md',
    '/typescript/problem-record.md',
    '/typescript/deeper-learning',
    '/typescript/deep-learning',
  ]
}
