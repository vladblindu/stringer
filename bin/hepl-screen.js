module.exports = `
    Usage: stringer [command [param]]

    For help (this screen):
        stringer --help | stringer -h

    Specify app configuration (defaults to src/config/index.js):
        stringer --config ./src/config | stringer -c ./src/config

    Remove all locale data
        stringer --clear | stringer -x

    String files name (glob pattern - defaults to 'strings.js'):
        stringer --pattern strings.js | stringer -p strings.js

    Locales destination directory (defaults to 'public/locales')
        stringer --dest  public/locales | stringer -d public/locales

    Root search directory (defaults to 'src')
        stringer --root  src | stringer -r src

    Safe mode to prevent overwriting (defaults to false)
        stringer --safe | stringer -s

    Languages (defaults to ['en', 'ro'])
        stringer --langs en ro | stringer -l

    By default if 'en' is specified you get the the UK flag
    If you would like to have the US flag instead provide the -u option
        stringer --langs en fr gr --us | stringer -l en fr gr -u

    Ver 1.0.0 available data:
      - en(us)
      - fr
      - de
      - es
      - ro

    Please help increase the data by adding new data
    in the https://github.com/vladblindu/stringer repo
`
