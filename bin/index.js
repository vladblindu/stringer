#!/usr/bin/env node

const arg = require('arg')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const {
  DEFAULT_CONFIG,
  DEFAULT_DEST,
  DEFAULT_PATTERN,
  DEFAULT_ROOT,
  DEFAULT_LANGS,
  GLOB_OPTS
} = require('./constants')

const ARGS_TYPE = {
  '--help': Boolean,
  '--config': String,
  '--pattern': String,
  '--dest': String,
  '--root': String,
  '--safe': Boolean,
  '--langs': [String],
  '--execute': Boolean,
  '-c': '--config',
  '-h': '--help',
  '-p': '--pattern',
  '-d': '--locales',
  '-r': '--root',
  '-s': '--safe',
  '-l': '--langs',
  '-x': '--execute'
}

const helpScreen = `
    Usage: stringer [command [param]]

    For help (this screen):
        stringer --help | stringer -h

    Specify app configuration (defaults to src/config/index.js):
        stringer --config ./src/config | stringer -c ./src/config

    Remove all locale data
        stringer --clear | stringer -x

    String files name (glob pattern - defaults to 'strings.js'):
        stringer --pattern strings.js | stringer -p strings.js

    Locales destination directory (defaults to 'public/locales')
        stringer --dest  public/locales | stringer -d public/locales

    Root search directory (defaults to 'src')
        stringer --root  src | stringer -r src

    Safe mode to prevent overwriting (defaults to false)
        stringer --safe | stringer -s

    Languages (defaults to ['en', 'ro'])
        stringer --langs en ro | stringer -l
`

const args = arg(ARGS_TYPE)
console.log(
  '\n\u001b[1mSTRINGER CLI UTILITY. \nPreparing to create localisation files...\u001b[0m'
)

// show help screen if requested
if (args['--help'] || Object.keys(args).length === 1) {
  console.log(helpScreen)
  process.exit(0)
}

const root = path.join(process.cwd(), args['--root'] || DEFAULT_ROOT)

// get configuration if specified in params
const configPath = args['--config'] || DEFAULT_CONFIG
let appConfig = {}
if (configPath) {
  try {
    appConfig = require(path.join(root, configPath))
  } catch (e) {
    console.warn(
      `Couldn't load config file: ${configPath}. \n Falling back to provided params or defaults`
    )
    console.warn(e.message)
  }
}

const { pattern, dest, safe, langs } = {
  pattern: appConfig.stringsFileName || args['--pattern'] || DEFAULT_PATTERN,
  dest: path.join(
    process.cwd(),
    appConfig.localesPath || args['--dest'] || DEFAULT_DEST
  ),
  safe: args['--safe'],
  langs: appConfig.defaultLangs || args['--langs'] || DEFAULT_LANGS
}

// glob all 'pattern' string files
const opts = { ...GLOB_OPTS, cwd: root }
const stringFiles = glob.sync(pattern, opts)

// if no 'pattern' files found warn and exit
if (!stringFiles.length) {
  console.warn(`No strings files found in ${root} directory. Exiting.`)
  process.exit(0)
}

// create directory if none existing
let stat = null
try {
  stat = fs.statSync(dest)
  if (safe) {
    console.warn(
      "Safe mode is enabled. Can't overwrite existing locales. Exiting."
    )
    process.exit(0)
  }
} catch (_) {
  console.log(`No locales dir found. Creating ${dest} directory`)
}
if (stat) {
  try {
    fs.rmdirSync(dest, { recursive: true })
    console.log(`Removing old locales data from the ${dest} directory`)
  } catch (e) {
    console.error(`Couldn't remove the ${dest} directory. Aborting.`)
    console.error(e.message)
    process.exit(0)
  }
}
try {
  fs.mkdirSync(dest, { recursive: true })
} catch (e) {
  console.error(`Couldn't create the ${dest} directory. Aborting.`)
  console.error(e.message)
  process.exit(0)
}

langs.forEach((lang) => {
  const tmp = {}
  stringFiles.forEach((file) => {
    /**
     * @typedef {object} stringsData
     * @param {String} component
     * @param {Object<string>} strings
     */

    let stringsData = {}
    try {
      stringsData = require(file)
    } catch (e) {
      console.warn(
        `File ${file} is corrupted or it's format is not readable. Skipping file.`
      )
      console.warn(e.message)
      return
    }
    if (!stringsData.strings[lang]) {
      console.warn(
        `File ${file} has no '${lang}' data available. Skipping file.`
      )
      return
    }
    Object.keys(stringsData.strings[lang]).forEach((k) => {
      const key = stringsData.component + '.' + k
      tmp[key] = stringsData.strings[lang][k]
    })
  })
  const filePath = path.join(dest, lang + '.json')
  try {
    fs.writeFileSync(filePath, JSON.stringify(tmp, null, 2))
  } catch (e) {
    console.warn(`Could not create: \n ${filePath}. Skipping.`)
    console.warn(e.message)
    return
  }
  console.log(
    `Lang file: "${path.basename(filePath)}" created...\u001b[32;1mOK\u001b[0m`
  )
})
console.log('Successfully created localization data.')
