// const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

const STATE_ACTION_FILES = {
    'EAT': '/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/fat/pyruvateDiv.hoon'
}

const STATE_ACTIONS = {}
const wait = 100

const cp = new CompilerProducer({wait: wait})

const run = async (action, actionSet, vars) => {
    console.log(actionSet[action])
    return await cp.compiler(actionSet[action], 0)(vars)
}
;(async () => {
    
    const state = {}
    
     const STATE_ACTIONS = (await Promise.all(Object.entries(STATE_ACTION_FILES).map(async ([k, f]) => {
        const obj = {}
        obj[k]  = await fs.readFileSync(__dirname + '/../hoon'+f, 'utf-8')
        return obj 
    }))).reduce((acc, val) => {
        acc[Object.keys(val)[0]] = Object.values(val)[0]
        return acc
    }, {})
    
    // mitochondrion
    const acetyl_CoA = 10
    const OAA = 5
    
    let ending;
    let res;
    let eating = false
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
        console.log((await run('CITRATE_SHUFFLE', STATE_ACTIONS,  datum)));   
    });
    
    const hoon6 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/caloriesFromMacro.hoon', 'utf-8');

    const response = await fetch('https://meal.map.rnft.life/src/assets/recipesAndNutrition.json')
    const recipes = await response.json();
    const functioning = true;
    eating = true;
    // LOGGING peer review
    
    // const wait = async (ms) => new Promise((res) => setTimeout(res, ms))
    
    // while(functioning){
    //     if(eating){
    //         for(let i = 0; i < recipes.length; i++){
    //             const protein = recipes[i].nutritionFacts.protein
    //             const fat = recipes[i].nutritionFacts.fat
    //             const carbohydrates = recipes[i].nutritionFacts.carbohydrates
                
    //             const cp1 = new CompilerProducer({wait: wait})
                
    //             cp1.on('after', async (datum) => {
    //                 res = datum;
    //             });
                
    //             await cp1.compiler(hoon6, 0)([fat, 9, 0])
    //             await cp1.compiler(hoon6, 0)([protein, 4, res])
    //             await cp1.compiler(hoon6, 0)([carbohydrates, 4, res])
    //             console.log('calories', res)
                
    //             await wait(100)
    //             // (await run('EAT', STATE_ACTIONS, [6, 5]));
    //         }
            
    //         eating = false;
            
            (await run('FATTY_ACID_SYNTHASE', STATE_ACTIONS, [acetyl_CoA, OAA]));
        // } 
    // }
})()
