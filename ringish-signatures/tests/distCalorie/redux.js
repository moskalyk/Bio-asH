const fs = require('fs')
const cp = require('./compilerProducerSingleton.js')

class CompilerRunner {
    actionSet
    constructor({ STATE_ACTION_FILES }){
        setTimeout(async () => {
            const STATE_ACTIONS = (await Promise.all(Object.entries(STATE_ACTION_FILES).map(async ([k, f]) => {
                const obj = {}
                obj[k]  = await fs.readFileSync(__dirname +f, 'utf-8')
                return obj 
            }))).reduce((acc, val) => {
                acc[Object.keys(val)[0]] = Object.values(val)[0]
                return acc
            }, {})
            this.actionSet = STATE_ACTIONS
        }, 0)
    }
    
    async run(action, vars) {
        return await cp.compiler(this.actionSet[action], 0)(vars)
    }
}

module.exports = {
    CompilerRunner,
    cp
}
