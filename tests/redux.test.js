const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

;(async () => {
    
    const hoon1 = await fs.readFileSync(__dirname + '/../gen/traps/trapGate.hoon', 'utf-8')
    const hoon2 = await fs.readFileSync(__dirname + '/../gen/traps/trapEvens.hoon', 'utf-8')
    
    const funFile = '/../gen/translation/translation.hoon'
    const hoon3 = await fs.readFileSync(__dirname + funFile, 'utf8')
    const wait = 200
    const cp = new CompilerProducer({wait: wait})
    
    cp.on('*', async (datum) => {
        console.log(datum) // {step: 0} - {step: 9}
        const ran = Math.floor(Math.random()*3)
        const base = ['a','b','c']
        base[ran] = datum.step
        await cp.compile(hoon3, 0)(base)
    })

    
    cp.on('after', (datum) => {
        console.log(datum) // abc
    })
    
    console.log('equals', 10 == await cp.compiler(hoon1, 0)(10))
    setTimeout(async () => await cp.compile(hoon3, 0)(['A', 'T', 'G']), wait)
})()
