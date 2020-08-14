import React from 'react'
import ReactDOM from 'react-dom'
import { StringsProvider } from 'stringer'
import config from './config/strings.config.json'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <StringsProvider
      config={config}>
      <App/>
    </StringsProvider>
  </React.StrictMode>
  ,
  document.getElementById('root')
)
