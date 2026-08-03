// const compiler = require('../hoon-loader/compiler/traps.index.js')
const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')

;(async () => {
    
    // const hoon1 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/calorie1.hoon', 'utf-8')
    // const hoon2 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/total.hoon', 'utf-8')
    // const hoon3 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/total2.hoon', 'utf-8')
    
    // const hoon4 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/calorie2.hoon', 'utf-8')
    // const hoon5 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/caloriesFromMacroFun.hoon', 'utf-8')
    const hoon6 = await fs.readFileSync(__dirname + '/../hoon/steppers/calorie/caloriesFromMacro.hoon', 'utf-8')
    
    const wait = 100
    const cp = new CompilerProducer({ wait: wait })
    
    const fat = 14.7
    const protein = 2
    const carbohydrates = 8.5
    
    let res;
    
    // calories
    cp.on('after', async (datum) => {
        res = datum
    })
    
    // await cp.compiler(hoon5, 0)([fat, 9, 4, 0])
    // await cp.compiler(hoon5, 0)([protein, 4, 4, res])
    // await cp.compiler(hoon5, 0)([carbohydrates, 4, 2, res])
    // console.log('calories',res)
    
    await cp.compiler(hoon6, 0)([fat, 9, 0])
    await cp.compiler(hoon6, 0)([protein, 4, res])
    await cp.compiler(hoon6, 0)([carbohydrates, 4, res])
    console.log('calories', res)
})()
