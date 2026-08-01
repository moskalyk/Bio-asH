const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

;(async () => {
    
    const hoon1 = await fs.readFileSync(__dirname + '/../gen/traps/trapGate.hoon', 'utf-8')
    const hoon2 = await fs.readFileSync(__dirname + '/../gen/traps/trapEvens.hoon', 'utf-8')
    
    console.log(hoon1)
    console.log(hoon2)
    // console.log(compiler)
    
    // //hoon, depth, verbose, args, varsCarry
    // const res = compiler(hoon, 0, true)(10)
    // console.log(res)
    
    const cp = new CompilerProducer({wait: 1000})
    
    cp.on('*', (datum) => {
        console.log(datum)
    })
    
    console.log(await cp.compiler(hoon1, 0)(10))
    console.log(await cp.compiler(hoon2, 0)(10))
})()
