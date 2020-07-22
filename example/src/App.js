import React from 'react'
import { useLangs, useStrings } from 'stringer'

const App = () => {
  const strings = useStrings('app-globals')
  const { lang, langs, setLang, meta } = useLangs()
  return <div>
    <div>{strings['app-name']}</div>
    <div>{strings['description']}</div>
    <br/>
    <div>Current lang: {lang}</div>
    {langs.map(
      (l, i) =>
        <button
          style={{ padding: '0 10px 0 10px' }}
          key={'dd' + i}
          onClick={
            () => {
              setLang(l)
            }
          }>
          {meta[l].name}
          <span>
            <img
              width="16"
              height="16"
              style={{ marginLeft: '5px' }}
              src={meta[l].flag}
              alt="lang-flag"/>
          </span>
        </button>
    )}
  </div>
}

export default App
