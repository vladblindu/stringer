function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var StringsContext = React.createContext({});
var StringsProvider = function StringsProvider(_ref) {
  var langs = _ref.langs,
      defaultLang = _ref.defaultLang,
      strings = _ref.strings,
      children = _ref.children;

  var _React$useState = React.useState(defaultLang),
      lang = _React$useState[0],
      setLang = _React$useState[1];

  var changeLang = function changeLang(lang) {
    setLang(lang);
  };

  var context = {
    lang: lang,
    changeLang: changeLang,
    langs: langs,
    strings: strings[lang]
  };
  return /*#__PURE__*/React.createElement(StringsContext.Provider, {
    value: context
  }, children);
};
var useStrings = function useStrings(compName) {
  var context = React.useContext(StringsContext);
  return Object.keys(context.strings).filter(function (k) {
    return k.startsWith(compName);
  }).reduce(function (acc, k) {
    var _k$split = k.split('.'),
        _k = _k$split[1];

    acc[_k] = context.strings[k];
    return acc;
  }, {});
};
var useLangs = function useLangs() {
  var _React$useContext = React.useContext(StringsContext),
      lang = _React$useContext.lang,
      changeLang = _React$useContext.changeLang,
      langs = _React$useContext.langs;

  return [lang, changeLang, langs];
};

exports.StringsContext = StringsContext;
exports.StringsProvider = StringsProvider;
exports.useLangs = useLangs;
exports.useStrings = useStrings;
//# sourceMappingURL=index.js.map
