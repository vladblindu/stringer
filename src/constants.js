/**
 * @type {object} appConfig
 * @param {string} appConfig.root
 * @param {string} appConfig.stringsFileName
 * @param {string} appConfig.localesPath
 * @param {string} appConfig.defaultLangs
 */

module.exports = {
  DEFAULT_CONFIG: 'config/stringer.config.json',
  DEFAULT_ROOT: 'src',
  DEFAULT_PATTERN: 'strings.json',
  DEFAULT_DEST: 'public/locales',
  DEFAULT_LANGS: ['en', 'ro'],
  DEFAULT_LANG: 'en',
  ORIGIN: 'origin',
  GLOB_OPTS: {
    absolute: true,
    matchBase: true
  }
}
