import React from 'react';

const StringsContext = React.createContext({});
const StringsProvider = ({
  langs,
  defaultLang,
  strings,
  children
}) => {
  const [lang, setLang] = React.useState(defaultLang);

  const changeLang = lang => {
    setLang(lang);
  };

  const context = {
    lang,
    changeLang,
    langs,
    strings: strings[lang]
  };
  return /*#__PURE__*/React.createElement(StringsContext.Provider, {
    value: context
  }, children);
};
const useStrings = compName => {
  const context = React.useContext(StringsContext);
  return Object.keys(context.strings).filter(k => k.startsWith(compName)).reduce((acc, k) => {
    const [_, _k] = k.split('.');
    acc[_k] = context.strings[k];
    return acc;
  }, {});
};
const useLangs = () => {
  const {
    lang,
    changeLang,
    langs
  } = React.useContext(StringsContext);
  return [lang, changeLang, langs];
};

export { StringsContext, StringsProvider, useLangs, useStrings };
//# sourceMappingURL=index.modern.js.map
