 STRINGER
### String localization management

[![NPM](https://img.shields.io/npm/v/stringer.svg)](https://www.npmjs.com/package/stringer)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @vladblindu/stringer
#or
yarn add @vladblindu/stinger
```

## Stringer cli - usage

The cli tool scans for strings.json files in your application and generates
separate language files that are saved (by default) in the
**"public"** directory under the **"locales"** subfolder

The **strings.json** files should have the following format:
```json
{
  "component": "userProfile",
  "strings": {
    "en": {
      "profilePicture": "Profile picture",
      "lastName": "Last name"
    },
    "ro": {
      "profilePicture": "Fotografie de profil",
      "lastName": "Prenume"
    }
  }
}
```

The cli displays the following help screen:

    Usage: stringer [command] [param]

    For help (this screen):
        stringer --help | stringer -h

    Specify app configuration (defaults to src/config/stringer.config.json):
        stringer --config ./src/config/stringer.config.json | stringer -c ./src/config/stringer.config.json

    String files name (glob pattern - defaults to 'strings.json'):
        stringer --pattern strings.json | stringer -p strings.json

    Locales destination directory (defaults to 'public/locales')
        stringer --dest  public/locales | stringer -d public/locales

    Root search directory (defaults to 'src')
        stringer --root  src | stringer -r src

    Safe-mode to prevent overwriting (defaults to false)
        stringer --safe | stringer -s

    Languages (defaults to ['en', 'ro'])
        stringer --langs en ro | stringer -l en ro

    By default, if 'en' is specified you get the UK flag
    If you would like to have the US flag instead provide the -u option
        stringer --langs en fr gr --us | stringer -l en fr gr -u

    Ver 1.0.0 available data:
      - en(us)
      - frx
      - de
      - es
      - ro

    Please help increase the data by adding new data
    in the https://github.com/vladblindu/stringer repo

## STRINGER REACT COMPONENTS AND HOOKS

the library exports thefollowingentities:

1. **StringsContext** - The strings context object
2. **StringsProvider** - The context "injector"
3. **useStrings** - React custom hook, to be inserted in components that use strings
4. **useLang** - React custom hook, to be consumed in the language control components

Usage:

#### 1. **StringsContext**
Should be imported only if you want to extend the current's library functionality

#### 2. **StringsProvider**

StringsProvider component assumes you have already run the cli tool and you have a src/config.stringer.config.json file present


Ex:
```jsx harmony
import StringsProvider from '@bitbrother/stringer'
import stringerConfig from './config/stringer.config.json'

    <StringsProvider
          config={stringerConfig}>// langs, defaultLang, meta, initialStrings
          <App/>
    </StringsProvider>
```
the config object should contain the following informtion:

* *initialStrings* the initial strings set
* *defaultLang* the default language (ex: 'en')
* *langs* the app's suportet language array (ex: ['en', 'fr', 'de'])
* the *meta* data saved by the cli tool in the src folder
There is an optional  *httpAgent* prop if you want to use a different http agent
(it will be provided a relative url to the public folder where the lang files are stored)

#### 3. **useStrings**

Let's you access the strings context by component name exposing multiple
case options functions

- **noc**: no case manipulation, gets the raw version from lock json,
- **cap**: capitalizes the first letter
- **upc**: all to uppercase,
- **loc**: all to lowercase,

All these functions expect one parameter **key** representing the name of the string in **strings.json**

- **tpl**: no case manipulation but offers a mustache type templating based on **{{varName}}**
delimiters


ex:
```jsx harmony
    ...
    const strings = useStrings('userProfile')
    ...
    return (
        <label>{strings['profilePicture']}</label>
    )
```
####  **useLang**

This hook let's you write this kind of language control code:
```jsx harmony
const { lang, langs, setLang, meta } = useLangs()
...
<div>Current lang: {lang}</div>
    {langs.map(
      (lang, idx) =>
        <button
          key={'key' + idx}
          onClick={
            () => {
              setLang(lang)
            }
          }>
          {meta[lang].name} //english
          <span>
            <img
              width="16"
              height="16"
              src={meta[lang].flag} // base64 encoded UK flag
              alt="lang-flag"/>
          </span>
        </button>
    )}
```
#### Vers 2.0.1 TODO list
1. Turn this mess into decent docs. Help welcome.
2. Differenciate behaviour of **_complain** method in DEV and PROD mede
3. Eliminate the need of the -x (execute) parameter in the cli utility
