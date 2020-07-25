import React from 'react'
import PropTypes from 'prop-types'
import urlJoin from 'url-join'
import { pick } from './helpers'

const ORIGIN = 'origin'

export const StringsContext = React.createContext({})

export const StringsProvider = ({
                                  langs,
                                  defaultLang,
                                  initialStrings,
                                  httpAgent,
                                  useHttp,
                                  localesPath,
                                  meta,
                                  children
                                }) => {
  const [state, setState] = React.useState({
    lang: defaultLang,
    strings: initialStrings
  })

  const handleSetState = (lang) => {
    if (lang === state.lang) return
    if (localesPath.startsWith('public')) localesPath.replace('public', '')
    const langUrl = httpAgent
      ? urlJoin(`origin:/${localesPath}`, lang + '.json')
      : urlJoin(localesPath, lang + '.json')
    const _http = httpAgent || useHttp(ORIGIN)
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
  langs: PropTypes.array.isRequired,
  defaultLang: PropTypes.string,
  initialStrings: PropTypes.object.isRequired,
  httpAgent: PropTypes.func,
  useHttp: PropTypes.func,
  localesPath: PropTypes.string,
  meta: PropTypes.object
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
