import React from 'react'
import { useStrings, useLangs } from 'stringer'

const App = () => {
  const { cap, upc, noc, loc, tpl } = useStrings('app-globals')
  const { lang, setLang, langs } = useLangs()
  return <div>
    <div>{noc('app-name')}</div>
    <div>{upc('description')}</div>
    <div>{cap('app-name')}</div>
    <div>{loc('description')}</div>
    <div>{tpl('template-example', { appName: 'STRINGER' })}</div>
    <br/>
    <div>Current lang: {lang}</div>
    {langs.map(
      l =>
        <button
          key={l}
          onClick={
            () => {
              if (l !== lang) setLang(l)
            }
          }>{l}</button>
    )}
  </div>
}

export default App
