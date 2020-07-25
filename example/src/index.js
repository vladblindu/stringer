import React from 'react'
import ReactDOM from 'react-dom'
import { StringsProvider } from 'stringer'
import fetchDog from '@bitbrother/fetch-dog'
import App from './App'
import { initialStrings, langs, defaultLang, meta } from './config/stringer.config.json'

ReactDOM.render(
  <React.StrictMode>
    <StringsProvider
      initialStrings={initialStrings}
      defaultLang={defaultLang}
      langs={langs}
      meta={meta}
      useHttp={fetchDog({ endpoints: {} }, 'hook')}>
      <App/>
    </StringsProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
