import { resolve } from 'node:path'
import fs from 'fs-extra'
import { loadConfigFromFile } from 'vite'
import type { UserConfig } from 'types/config'
import { DEFAULT_THEME_PATH } from './constants'

export interface SiteConfig {
  pages: string[]
  root: string
  command: 'serve' | 'build'

  themeDir?: string
}

export const defineConfig = (config: UserConfig) => config

const getUserConfigPath = (root: string) => {
  const configFileName = 'mmc.config'
  const configPath = ['ts', 'js'].map(ext => resolve(root, `${configFileName}.${ext}`)).find(fs.pathExistsSync)

  return configPath
}

const resolveUserConfig = async (
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production',
  customizeConfig?: string,
) => {
  const configPath = getUserConfigPath(root)
  const result = await loadConfigFromFile({ command, mode }, customizeConfig || configPath, root)
  return result
}

export const resolveConfig = async (
  root: string = process.cwd(),
  command: 'serve' | 'build' = 'build',
  mode: 'development' | 'production',
  customizeConfig?: string,
) => {
  const userConfig = await resolveUserConfig(root, command, mode, customizeConfig)
  const userThemeDir = resolve(root, 'theme')
  const themeDir = fs.pathExistsSync(userThemeDir)
    ? userThemeDir
    : DEFAULT_THEME_PATH

  const config: SiteConfig = {
    pages: ['404.md', '约定式路由.md'],
    root,
    command,
    themeDir,
    ...userConfig,
  }

  console.log(config)

  return config
}
