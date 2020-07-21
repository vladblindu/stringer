import React from 'react'

export const StringsContext = React.createContext({})

export const StringsProvider = ({ langs, defaultLang, strings, children }) => {
  const [lang, setLang] = React.useState(defaultLang)

  const changeLang = (lang) => {
    setLang(lang)
  }

  const context = {
    lang,
    changeLang,
    langs,
    strings: strings[lang]
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
