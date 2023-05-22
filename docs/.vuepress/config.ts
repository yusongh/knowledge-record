import { defineUserConfig, defaultTheme } from 'vuepress'
import { sidebar, navbar } from './configs/index'

export default defineUserConfig({
  theme: defaultTheme({
    sidebar,
    sidebarDepth: 3,
    navbar
  }),
  markdown: {
    headers: {
      level: [1, 2, 3, 4, 5]
    }
  }
})
