import { NavbarConfig } from 'vuepress'

export const navbar: NavbarConfig = [
  { 
    text: 'Typescript',
    children: [
      { text: '入门笔记', link: '/typescript/getting-started-notes.md' },
      { text: '问题记录', link: '/typescript/problem-record.md' },
      { text: '较深入学习-2022-03-06', link: '/typescript/deeper-learning.md' },
      { text: '深入学习-2022-09-14', link: '/typescript/deep-learning.md' },
    ] 
  }
]
