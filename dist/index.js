function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var urlJoin = _interopDefault(require('url-join'));

var pick = function pick(o) {
  for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  return Object.keys(o).reduce(function (acc, k) {
    if (keys.includes(k)) acc[k] = o[k];
    return acc;
  }, {});
};

var StringsContext = React.createContext({});
var StringsProvider = function StringsProvider(_ref) {
  var langs = _ref.langs,
      defaultLang = _ref.defaultLang,
      initialStrings = _ref.initialStrings,
      httpAgent = _ref.httpAgent,
      meta = _ref.meta,
      children = _ref.children;

  var _React$useState = React.useState({
    lang: defaultLang,
    strings: initialStrings
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  var handleSetState = function handleSetState(lang) {
    if (lang === state.lang) return;
    var langUrl = urlJoin('origin://locales', lang + '.json');
    httpAgent(langUrl).then(function (res) {
      return res.json();
    }).then(function (strings) {
      setState({
        lang: lang,
        strings: strings
      });
    })["catch"](function (e) {
      console.log(e);
    });
  };

  var context = {
    lang: state.lang,
    setLang: handleSetState,
    langs: langs,
    meta: meta,
    strings: state.strings
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
    var _k = k.split('.')[1];
    acc[_k] = context.strings[k];
    return acc;
  }, {});
};
var useLangs = function useLangs() {
  var context = React.useContext(StringsContext);
  return pick(context, 'lang', 'langs', 'setLang', 'meta');
};

exports.StringsContext = StringsContext;
exports.StringsProvider = StringsProvider;
exports.useLangs = useLangs;
exports.useStrings = useStrings;
//# sourceMappingURL=index.js.map
