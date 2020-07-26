import React from 'react'
import PropTypes from 'prop-types'
import urlJoin from 'url-join'
import { pick } from './helpers'

export const StringsContext = React.createContext({})

export const StringsProvider = ({ config, httpAgent, children }) => {

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
    const _http = httpAgent || window.fetch
    _http(langUrl)
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


export const useStrings = (compName) => {
  const context = React.useContext(StringsContext)
  return Object.keys(context.strings)
    .filter((k) => k.startsWith(compName))
    .reduce((acc, k) => {
      // eslint-disable-next-line no-unused-vars
      const _k = k.split('.')[1]
      acc[_k] = context.strings[k]
      return acc
    }, {})
}

export const useLangs = () => {
  const context = React.useContext(StringsContext)
  return pick(context, 'lang', 'langs', 'setLang', 'meta')
}
