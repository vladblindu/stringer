/**
 * @type {object} appConfig
 * @param {string} appConfig.root
 * @param {string} appConfig.stringsFileName
 * @param {string} appConfig.localesPath
 * @param {string} appConfig.defaultLangs
 */

const BASE_NAME = 'strings'
const DEFAULT_FILE = `${BASE_NAME}.json`

module.exports = {
  DEFAULT_CONFIG: 'config/strings.config.json',
  DEFAULT_ROOT: 'src',
  DEFAULT_PUBLIC: 'public',
  DEFAULT_PATTERN: `+(${DEFAULT_FILE}|*.${DEFAULT_FILE})`,
  DEFAULT_EXTENSION: `.${DEFAULT_FILE}`,
  DEFAULT_DEST: 'locales',
  DEFAULT_LANGS: ['en', 'ro'],
  DEFAULT_LANG: 'en',
  DEFAULT_FILE,
  GLOB_OPTS: {
    absolute: true,
    matchBase: true
  }
}
