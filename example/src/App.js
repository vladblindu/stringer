import React from 'react'
import { useStrings, useLangs } from 'stringer'

const App = () => {
  const strings = useStrings('app-globals')
  const [lang, setLang, langs] = useLangs()
  return <div>
    <div>{strings['app-name']}</div>
    <div>{strings['description']}</div>
    <br/>
    <div>Current lang: {lang}</div>
    {langs.map(
      l =>
      <button
        onClick={
          () => {
            if(l !== lang) setLang(l)
          }
        }>{l}</button>
    )}
  </div>
}

export default App
