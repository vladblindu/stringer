#!/usr/bin/env node

/* eslint-disable dot-notation */
const arg = require('arg')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const convert = require('base64-img')
const countryData = require('../locales.defs.json')
const helpScreen = require('./help-screen')

const {
  DEFAULT_CONFIG,
  DEFAULT_DEST,
  DEFAULT_PATTERN,
  DEFAULT_ROOT,
  DEFAULT_LANGS,
  GLOB_OPTS,
  DEFAULT_LANG
} = require('../src/constants')

const ARGS_TYPE = {
  '--help': Boolean,
  '--config': String,
  '--pattern': String,
  '--dest': String,
  '--root': String,
  '--langs': [String],
  '--execute': Boolean,
  '--def-lang': String,
  '-c': '--config',
  '-h': '--help',
  '-p': '--pattern',
  '-d': '--locales',
  '-r': '--root',
  '-s': '--safe',
  '-l': '--langs',
  '-x': '--execute',
  '-g': '--def-lang'
}

const args = arg(ARGS_TYPE)
console.log(
  '\n\u001b[1mSTRINGER CLI UTILITY - STRINGS DATA. \nPreparing to create localisation files...\u001b[0m'
)

// show help screen if requested
if (args['--help'] || Object.keys(args).length === 1) {
  console.log(helpScreen)
  process.exit(0)
}

const root = path.join(process.cwd(), args['--root'] || DEFAULT_ROOT)

// get configuration if specified in params
const configPath = path.join(root, args['--config'] || DEFAULT_CONFIG)

let stringerConfig = {}
if (configPath) {
  try {
    stringerConfig = require(configPath)
  } catch (e) {
    console.warn(
      `No existing configuration file found at ${configPath}. \n Stringer will create one.`
    )
  }
}

const { pattern, dest, langs, defaultLang } = {
  pattern: args['--pattern'] || DEFAULT_PATTERN,
  dest: path.join(
    process.cwd(),
    stringerConfig.localesPath || args['--dest'] || DEFAULT_DEST
  ),
  langs: stringerConfig.langs || args['--list'] || DEFAULT_LANGS,
  defaultLang: stringerConfig.defaultLang || args['--def-lang'] || DEFAULT_LANG
}

if (!langs.length) {
  console.error(`No languages specified. For help type stringer -h.`)
  process.exit(1)
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

const meta = {}

langs.forEach((lang) => {
  const tmp = {}

  stringFiles.forEach((file) => {
    /**
     * @typedef {object} stringsData
     * @param {String} component
     * @param {Object<string>} strings
     */

    if (!countryData[lang]) {
      console.warn(`No data is available in this version for the ${lang} sourceLangs.
For now it will be excluded from the list.
Please go to https://github.com/vladblindu/stringer, pull, add the lang data, merge and retry.`)
      return
    }

    /**
     * @type {object} cData
     * @param {String} cData.pic
     * @param {String} cDAta.name
     */

    const cData =
      args['--us'] && lang === 'en' ? countryData['us'] : countryData[lang]

    const flagFile = path.join(process.cwd(), '../', 'country-meta', cData.pic)
    let flag
    try {
      flag = convert.base64Sync(flagFile)
    } catch (e) {
      console.error(`Could not find file;${cData.pic}. Aborting.`)
      process.exit(1)
    }

    meta[lang] = {
      name: cData.name,
      flag
    }

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
  // end of file loop
  const filePath = path.join(dest, lang + '.json')
  try {
    fs.writeFileSync(filePath, JSON.stringify(tmp, null, 2))
    if (lang === defaultLang) stringerConfig.initialStrings = tmp
  } catch (e) {
    console.warn(`Could not create: \n ${filePath}. Skipping.`)
    console.warn(e.message)
    return
  }
  console.log(
    `Lang file: "${path.basename(filePath)}" created...\u001b[32;1mOK\u001b[0m`
  )
})
// end of lang loop
stringerConfig.meta = meta
stringerConfig.defaultLang = defaultLang
stringerConfig.langs = langs
stringerConfig.pattern = pattern
stringerConfig.dest = dest

try {
  fs.writeFileSync(configPath, JSON.stringify(stringerConfig, null, 2))
} catch (e) {
  console.warn(`Could not create: \n ${configPath}. Fatal error.`)
  console.warn(e.message)
  return
}
console.log(`Config file created/updated ...\u001b[32;1mOK\u001b[0m`)
console.log('Successfully created localization data.')
