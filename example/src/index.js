import React from 'react'
import ReactDOM from 'react-dom'
import { StringsProvider } from 'stringer'
import enStrings from './locales/en.json'
import roStrings from './locales/ro.json'
import { langs, defaultLang } from './config'
import App from './App'

const strings = {
  en: enStrings,
  ro: roStrings
}

ReactDOM.render(
  <React.StrictMode>
    <StringsProvider
      strings={strings}
      defaultLang={defaultLang}
      langs={langs}>
      <App/>
    </StringsProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
