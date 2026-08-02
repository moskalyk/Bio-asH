// const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

;(async () => {
    
    const hoon1 = await fs.readFileSync(__dirname + '/../gen/fat/fattyAcidSynthase.hoon', 'utf-8')
    const hoon2 = await fs.readFileSync(__dirname + '/../gen/fat/citrateShuffle.hoon', 'utf-8')
    const hoon3 = await fs.readFileSync(__dirname + '/../gen/fat/pyruvateDiv.hoon', 'utf-8')
    // const hoon2 = await fs.readFileSync(__dirname + '/../gen/traps/trapGate.hoon', 'utf-8')
    
    const wait = 100
    const cp = new CompilerProducer({wait: wait})
    
    // mitochondrion
    const acetyl_CoA = 10
    const OAA = 5
    
    let ending;
    const pentosePhosphatePathway = 5*1.2
    
    cp.on('*', async (datum) => {
        const malate = datum.step
        const pyruvate = malate[0]
        console.log('pyruvate ', pyruvate)
        ending = pyruvate + pentosePhosphatePathway
    })
    
    // citrate shuffle
    cp.on('end', async () => {
        console.log('ended')
        await cp.compiler(hoon3, 0)([ending, 5])
    })
    
    // cytoplasm
    cp.on('after', async (datum) => {
        console.log('citrate ',datum) // 15
        await cp.compiler(hoon2, 0)(datum)
    })
    
    await cp.compiler(hoon1, 0)([acetyl_CoA, OAA])

})()
