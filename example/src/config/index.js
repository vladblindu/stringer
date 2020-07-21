/*
* MAIN CONFIGURATION FILE
* Should be kept ES5(module.exports syntax)
* to be accessible for other build time cli tools
*/

//default language
module.exports.defaultLang = 'en'
module.exports.langs = ['en', 'ro']
module.exports.localesPath = './public/locales'

//routes
module.exports.routes = {
    login: {
        url: 'login',
        visitable: true,
        specialRoute: 'login'
    },
    createUser:{
        url: 'create-user'
    }
}

//theming options
module.exports.theme = {

}