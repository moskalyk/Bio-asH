const CompilerProducer = require('../hoon-loader/compiler/HoonCompilerProducer.js')
const fs = require('fs')
const auraChecker = (aura) => {
    if(aura == '@ud') return 'number'
    if(aura == '@t') return 'string'
    if(aura == '@ta') return 'string'
    if(aura == '(list @t)') return 'object'
}

let isValid = true

const typeChecker = (hoonCore, el) => {
    let isRunArray = false
    Object.entries(hoonCore).forEach(hc => {
        if(Object.keys(hc[1])[0] == 'list' && Array.isArray(el[hc[0]])){
            el[hc[0]].forEach(e => {
                const obj = {}
                obj[Object.values(hc[1])[0]] = e
                typeChecker(hoonCore, obj, isValid)
                isRunArray = true
            })
        } 

    })

    if(!isRunArray){
        Object.values(el).forEach(e => {
                if(Array.isArray(e)){
                    e.forEach(q => {
                        if(hoonCore[Object.keys(el)[1]]){ // TODO: need to clean up
                            hoonCore[Object.keys(el)[1]]&& Object.entries(hoonCore[Object.keys(el)[1]]).forEach((p) => {
                                if(hoonCore[p[1]] && hoonCore[hoonCore[p[1]]]){
                                    Object.entries(q).forEach(o => {
                                        if(typeof o[1] != auraChecker(hoonCore[Object.keys(el)[1]][o[0]])){
                                            isValid = false
                                            
                                            if(hoonCore[hoonCore[p[1]]].includes('%'+o[1])){
                                                isValid = true
                                            } else {
                                                throw new Error('%'+o[1])
                                            }
                                        } else {
                                        
                                        }
                                        if(!isValid)throw new Error('inValid')

                                    })
                                }
                            })
                            
                        } else {
                            if(typeof q != auraChecker(Object.keys(el)[1])){
                                isValid = false
                                throw new Error(q)
                            }
                        }

                    })
                } else if(e != 'type'){
                e&&Object.entries(e).forEach(([k,v]) => {
                    const kvalue = hoonCore[Object.keys(el)[0]][k]
                    if(typeof hoonCore[k] != 'object' && !kvalue.list){
                        if(hoonCore[kvalue]) {
                            if(!hoonCore[hoonCore[kvalue]].includes(v)) throw new Error(hoonCore[kvalue])
                        }
                        else if(typeof v != auraChecker(kvalue)){
                            throw new Error(kvalue)
                        }
                    } else if(kvalue && typeof v == 'object'){
                        if(v[k] == auraChecker(kvalue)){ // check for non-abstract: recipe & nutritionFacts
                            if(kvalue.list) {
                                let obj = {}
                                obj[k] = v
                                obj[kvalue.list] = 'type'
                                typeChecker(hoonCore, obj, isValid)
                            } else {
                            let obj = {}
                                obj[kvalue] = v
                                typeChecker(hoonCore, obj, isValid)
                            }
                        } else if(v){
                            if(typeof v == auraChecker(kvalue)){
                                isValid = true
                            } else {
                                isValid = false

                                throw new Error(kvalue)
                            }
                        }
                    }
                })
            }
        })
    }

    return isValid
}

;(async () => {
    const funFile = '/../gen/molds/etransfer.hoon'
    const dataFile = '/data/etransfer.json'
    const hoon = await fs.readFileSync(__dirname + funFile, 'utf8')
    const rawData = await fs.readFileSync(__dirname + dataFile, 'utf8')
    
    const wait = 200
    const cp = new CompilerProducer({wait: wait})
    
    const recipesAsHoonJSON = cp.compiler(/*STATES*/hoon, 0)
    
    console.log('(rough) mold check',typeChecker(recipesAsHoonJSON, {recipients: JSON.parse(rawData)}))
})()
