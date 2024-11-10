
const modules = require('./export')

module.exports = {
  activate:(context:any) => modules.forEach((module: any) => module.registe(context)),
  deactivate:modules.forEach((module: any) => module.deactivate())
};