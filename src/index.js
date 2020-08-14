import React from 'react'
import PropTypes from 'prop-types'
import urlJoin from 'url-join'
import { capitalize, mustacheIt, pick } from './helpers'

export const StringsContext = React.createContext({})

export const StringsProvider = ({ config, children }) => {

  if (!window.fetch) console.error('BROWSER_ERROR: The stringer library depends on the globally availability of the fetch function.')
  const {
    langs,
    defaultLang,
    initialStrings,
    localesPath,
    meta
  } = config

  const [state, setState] = React.useState({
    lang: defaultLang,
    strings: initialStrings
  })

  const handleSetState = (lang) => {
    if (lang === state.lang) return
    let langUrl = urlJoin(localesPath, lang + '.json')
    if (langUrl[0] !== '/') langUrl = '/' + langUrl
    window.fetch(langUrl)
      .then((res) => res.json())
      .then((strings) => {
        setState({ lang, strings })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const context = {
    lang: state.lang,
    setLang: handleSetState,
    langs,
    meta,
    strings: state.strings
  }

  return (
    <StringsContext.Provider value={context}>
      {children}
    </StringsContext.Provider>
  )
}

StringsProvider.propTypes = {
  config: PropTypes.object.isRequired,
  httpAgent: PropTypes.func,
  useHttp: PropTypes.func
}

StringsProvider.defaultProps = {
  defaultLang: 'en',
  localesPath: '/locales'
}

class Strings {
  constructor(strings, compName) {
    this._strings = Object.keys(strings)
      .filter((k) => k.startsWith(compName))
      .reduce((acc, k) => {
        const _k = k.split('.')[1]
        acc[_k] = strings[k]
        return acc
      }, {})
    this.cap = this.cap.bind(this)
    this.upc = this.upc.bind(this)
    this.noc = this.noc.bind(this)
    this.loc = this.loc.bind(this)
    this.tpl = this.tpl.bind(this)
  }

  // TODO separate DEV and PROD behaviours
  _complain(key) {
    if (!this._strings[key])
      throw new Error(`DEVERR: No strings registered for key:${key}`)
  }

  noc(key) {
    this._complain(key)
    return this._strings[key]
  }

  cap(key) {
    this._complain(key)
    return capitalize(this._strings[key])
  }

  upc(key) {
    this._complain(key)
    return this._strings[key].toUpperCase()
  }

  loc(key) {
    this._complain(key)
    return this._strings[key].toLowerCase()
  }

  tpl(key, vars) {
    this._complain(key)
    return mustacheIt(this._strings[key], vars)
  }
}

/**
 *
 * @param {string} compName
 * @returns {{normCase: (function(string): string),
 * noc: (function(string): string),
 * cap: (function(string): string),
 * upc: (function(string): string),
 * loc: (function(string): string)
 * capitalized: (function(string): string),
 * upperCase: (function(string): string),
 * lowerCase: (function(string): string)}}
 */
export const useStrings = (compName) => {
  const context = React.useContext(StringsContext)
  const strings = new Strings(context.strings, compName)
  return {
    noc: strings.noc,
    cap: strings.cap,
    upc: strings.upc,
    loc: strings.loc,
    tpl: strings.tpl
  }
}

export const useLangs = () => {
  const context = React.useContext(StringsContext)
  return pick(context, 'lang', 'langs', 'setLang', 'meta')
}
