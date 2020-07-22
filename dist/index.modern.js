import React from 'react';
import urlJoin from 'url-join';

const pick = (o, ...keys) => Object.keys(o).reduce((acc, k) => {
  if (keys.includes(k)) acc[k] = o[k];
  return acc;
}, {});

const StringsContext = React.createContext({});
const StringsProvider = ({
  langs,
  defaultLang,
  initialStrings,
  httpAgent,
  meta,
  children
}) => {
  const [state, setState] = React.useState({
    lang: defaultLang,
    strings: initialStrings
  });

  const handleSetState = lang => {
    if (lang === state.lang) return;
    const langUrl = urlJoin('origin://locales', lang + '.json');
    httpAgent(langUrl).then(res => res.json()).then(strings => {
      setState({
        lang,
        strings
      });
    }).catch(e => {
      console.log(e);
    });
  };

  const context = {
    lang: state.lang,
    setLang: handleSetState,
    langs,
    meta,
    strings: state.strings
  };
  return /*#__PURE__*/React.createElement(StringsContext.Provider, {
    value: context
  }, children);
};
const useStrings = compName => {
  const context = React.useContext(StringsContext);
  return Object.keys(context.strings).filter(k => k.startsWith(compName)).reduce((acc, k) => {
    const _k = k.split('.')[1];
    acc[_k] = context.strings[k];
    return acc;
  }, {});
};
const useLangs = () => {
  const context = React.useContext(StringsContext);
  return pick(context, 'lang', 'langs', 'setLang', 'meta');
};

export { StringsContext, StringsProvider, useLangs, useStrings };
//# sourceMappingURL=index.modern.js.map
