import React from 'react'
import urlJoin from 'url-join'

export const StringsContext = React.createContext({})

export const StringsProvider = ({
                                  langs,
                                  defaultLang,
                                  initialStrings,
                                  httpAgent,
                                  children
                                }) => {
  const [lang, setLang] = React.useState(defaultLang)

  let strings = initialStrings

  const changeLang = (newLang) => {
    if (newLang === lang) return
    const langUrl = urlJoin('origin://', lang + '.json')
    httpAgent(langUrl)
      .then((res) => res.json())
      .then((res) => {
        strings = res
      })
      .catch((e) => {
        alert(`Failed to load ${langUrl}`)
        console.error(e.message)
      })
    setLang(lang)
  }

  const context = {
    lang,
    changeLang,
    langs,
    strings
  }

  return (
    <StringsContext.Provider value={context}>
      {children}
    </StringsContext.Provider>
  )
}

export const useStrings = (compName) => {
  const context = React.useContext(StringsContext)
  return Object.keys(context.strings)
    .filter((k) => k.startsWith(compName))
    .reduce((acc, k) => {
      // eslint-disable-next-line no-unused-vars
      const [_, _k] = k.split('.')
      acc[_k] = context.strings[k]
      return acc
    }, {})
}

export const useLangs = () => {
  const { lang, changeLang, langs } = React.useContext(StringsContext)
  return [lang, changeLang, langs]
}
