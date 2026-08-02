// const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

const STATE_ACTION_FILES = {
    'EAT': '/steppers/calories.hoon',
    'FATTY_ACID_SYNTHASE': '/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/fat/pyruvateDiv.hoon'
}

const STATE_ACTIONS = {}
    const wait = 100

const cp = new CompilerProducer({wait: wait})

const run = async (action, actionSet, vars) => {
    // console.log(actionSet[action])
    return await cp.compiler(actionSet[action], 0)(vars)
}
;(async () => {
    
    const state = {}
    
     const STATE_ACTIONS = (await Promise.all(Object.entries(STATE_ACTION_FILES).map(async ([k, f]) => {
        const obj = {}
        obj[k]  = await fs.readFileSync(__dirname + '/../gen'+f, 'utf-8')
        return obj 
    }))).reduce((acc, val) => {
        acc[Object.keys(val)[0]] = Object.values(val)[0]
        return acc
    }, {})
    
    // mitochondrion
    const acetyl_CoA = 10
    const OAA = 5
    
    let ending;
    const pentosePhosphatePathwayGlucose = 5*1.2
    
    cp.on('*', async (datum) => {
        const malate = datum.step
        const pyruvate = malate[0]
        console.log('pyruvate ', pyruvate)
        ending = pyruvate + pentosePhosphatePathwayGlucose
    })
    
    // citrate shuffle
    cp.on('end', async () => {
        console.log('ended');
        (await run('PYRUVATE_DIV', STATE_ACTIONS,  [ending, 5]));
        
    })
    
    // cytoplasm
    cp.on('after', async (datum) => {
        console.log('citrate ',datum); // 15
        (await run('CITRATE_SHUFFLE', STATE_ACTIONS,  datum));
    });
    
    (await run('FATTY_ACID_SYNTHASE', STATE_ACTIONS, [acetyl_CoA, OAA]));
    // (await run('EAT', STATE_ACTIONS, [6, 5]));
    
    // const res = await fetch('https://meal.map.rnft.life/src/assets/recipes.json')
    // console.log(await res.json())
})()
