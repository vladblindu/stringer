import React from 'react'
import { useLangs, useStrings } from 'stringer'

const NestedComp = () => {
  const { cap, upc } = useStrings('nested')
  return <div>
    <h1>{upc('nested-key')}</h1>
    <p>{cap('nested-description')}</p>
  </div>
}

const App = () => {
  const { cap, upc, noc, loc, tpl } = useStrings('app-globals')
  const { lang, setLang, langs, meta } = useLangs()
  return <div>
    <div>
      <img src={meta[lang].flag} alt="flag"/>
    </div>
    <div>{noc('app-name')}</div>
    <div>{upc('description')}</div>
    <div>{cap('app-name')}</div>
    <div>{loc('description')}</div>
    <div>{tpl('template-example', { appName: 'STRINGER' })}</div>
    <NestedComp/>
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
