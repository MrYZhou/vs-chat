import { Base } from "./util/tool";
let url = Base.join(__dirname, 'command')
const files = Base.getAllFilesOfDir(url);

let modules: any[] = []
let actions: Promise<any>[] = []
for (let index = 0; index < files.length; index++) {
  actions.push(new Promise((res) => {
    let module = require(`${files[index]}`)
      res(modules[index] = new module())
  }))
}

Promise.all([...actions])
module.exports = modules;