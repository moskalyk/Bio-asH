const stairs = `
    return (func) => {
        return (args) => {
            return gates[func](...args)
        }
    }
`

const gates = {
    'sin': (arg1) => {
      return Math.sin(arg1)  
    },
    'concat': (arg1, arg2) => {
      return arg1 + arg2
    },
    'add': (arg1, arg2) => {
      return parseInt(arg1) + parseInt(arg2)
    },
    'mul': (arg1, arg2) => {
      return parseFloat(arg1) * parseFloat(arg2)
    },
    'gth': (arg1, arg2) => {
        return parseFloat(arg1) >= parseFloat(arg2)
    },
    '@': (arg) => {
      return arg
    }
}

const runes = [':-', '^-', '|=', '=/', '|-', '?:', '%=', '$', '%-', 
                '$%',  // union
                '+$',  // type
                '$:',  // cell creation
                '|%',  // core, with arms
                '|_'   // door, core with a sample and arms
              ]

const caseByCase = (rune) => `case '${rune}': ${stairs} break;`
const runeRunner = eval(`const appendage = (rune) => {switch(rune){${runes.reduce((initial, rune) => { return initial + caseByCase(rune)}, '')}}}; const returnFunc = () => appendage; returnFunc()`)

class EventProducer {
    cbs = {}
    
    on(listener, cb){
        this.cbs[listener] = cb
    }
    
    produce(listener, datum){
        this.cbs[listener](datum)
    }
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

class CompilerProducer extends EventProducer {
    hoon
    vars = {}
    varsGen = {}
    waitMs = 0
    constructor({wait}) {
        super()
        this.waitMs = wait
        this.functionName = this.functionName.bind(this);
        this.functionName1Atom = this.functionName1Atom.bind(this);
        this.compile = this.compiler.bind(this);
        this.computable = this.computable.bind(this);
    }
    
    computable(isRune, hoon, depth){
        const pattern = /(?<rune>\S+)\s{2}(?<rest>.+)/;
        const match = hoon.match(pattern)
        switch(isRune){
            case runes[8]:
                const pattern2 = /(?<func>\S+)\s{2}(?<rest>.+)/;
                const funcs = match[2].match(pattern2)
                const pattern3 = /(.+?)(?=\s{2})(\s{2})*(.*)\s{2}(.*)/
                const rests = funcs.groups.rest.match(pattern3)
                if(!rests){
                    const pattern = /(?<arg>(.+?$))/;
                    const matchArg = funcs.groups.rest.match(pattern)
                    
                    let computeVars = {}
                        
                    if(Object.keys(vars).includes(matchArg.groups.arg)){
                        computeVars[0] = vars[matchArg.groups.arg]
                    } else {
                        computeVars[0] = matchArg.groups.arg
                    }
                    return runeRunner(match.groups.rune)(funcs.groups.func)([computeVars[0]])
                }else {
                    
                    const isInnerRune = rests[1].slice(0,2)
                    
                    
                    if(runes.indexOf(isInnerRune) != -1 && ['add', 'mul', 'concat'].includes(funcs.groups.func)){
                        const pattern4 = /(.+?)(?=\s{2})\s{2}(.+?)(?=\s{2})(\s{2})*(.*)\s{2}(.*)/
                        const rests = hoon.match(pattern4)
                        console.log('runner')
                        if(runes.indexOf(rests[1]) != -1) return runeRunner(rests[1])(rests[2])([this.compile(rests[4]), rests[5]])
                        
                    } else if (runes.indexOf(rests[1]) == -1 && ['add', 'mul', 'concat'].includes(funcs.groups.func)){

                        let pattern4 = /(.+?)\s{2}(.+?)\s{2}(.+?)\s{2}(.+)/
                        let string = hoon
                        let matcher = string.match(pattern4)

                        const isRune3 = matcher[3].slice(0,2)
                        const isRune4 = matcher[4].slice(0,2)
                        
                        let computeVars = {}
                        
                        Object.values(this.vars).map((v,i) => {
                            computeVars[i] = v
                        })
                        const args = Object.values(computeVars)
                        if(Object.values(this.vars).length < 1){
                            // console.log('here')
                            if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                            else if(runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], this.compile(matcher[4])])
                            else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([this.compile(matcher[3]), matcher[4]])
                            else return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                        } else {
                                                    // console.log('here')
                            if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune3) != -1) {
                                return runeRunner(matcher[1])(matcher[2])(args)
                            }
                            else if(runes.indexOf(isRune4) != -1) {
                                setTimeout(() => {
                                    this.produce('after', runeRunner(matcher[1])(matcher[2])([this.compile(matcher[4], depth+1, false, null, this.vars), ...args.slice(args.length-1-depth,args.length)]));
                                }, this.waitMs)
                            }
                            else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([this.compile(matcher[4]), args])
                            else {
                            
                            return runeRunner(matcher[1])(matcher[2])(args)
                            }
                        }

                    }
                    if(runes.includes(isRune)){
                        // verbose && console.log('depth: ', depth+1)
                        return runeRunner(match.groups.rune)(funcs.groups.func)([this.compile(funcs.groups.rest, depth+1)])
                    } else{
                       return runeRunner(match.groups.rune)(funcs.groups.func)([rests[1], rests[4]])
                    }
                }
                break;
        }
        // return this.computable(isRune, match1[7].trim())
    }
    
    compiler(hoon, depth, verbose = false, args, varsCarry) {
        var vars = this.vars
        if(varsCarry) vars = varsCarry
        
        try {
            const isRune = hoon.slice(0,2)
            // const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/g; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                const pattern2Cells = /(\s*(?<key>\S+)=(\S+)\s+)/g

            const pattern = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)/;
            let match1 = [...hoon.matchAll(pattern2Cells)]
            this.varsGen = match1.map(el => [el[2].replace('[',''), el[3].replace(']', '')])
                        this.hoon = hoon

            if(this.varsGen.length > 3 && match1.length != 0){
                return this.functionName

            } else if(this.varsGen.length >= 3){
                                return this.functionName


            } else if(isRune == runes[8]){
                                return this.computable(isRune, hoon)

            }
            
            if(runes.includes(isRune) && isRune == runes[2]){
                const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                const pattern1Atom = /((=\/.+)\s{2})(?=\?:)(.+)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]

                const match = hoon.match(pattern2Cells)
                let match1 = hoon.match(pattern1Atom)
                
                
            
                if(match1 != null){
                    return this.functionName1Atom
                } else {
                    return this.functionName

                }
                
            //     if(match1.length != 0){
            //     return functionName

            // }
            // const match2 = hoon.match(pattern)
            console.log('running computable')
                return this.computable(isRune, hoon)
                
            } else if(runes.includes(isRune)){
            
                const match = hoon.match(pattern)
                const isRuneArg1 = match.groups.arg1.slice(0,2)
                const isRuneArg2 = match.groups.arg2.slice(0,2)
                // console.log(isRuneArg1)
                // console.log(isRuneArg2)
                if(runes.includes(isRuneArg1)){
                    verbose && console.log('depth: ', depth+1)
                    console.log('not includes')

                    return runeRunner(match.groups.rune)(match.groups.func)([this.compile(match.groups.arg1, depth+1), match.groups.arg2])
                } 
                
                if(!runes.includes(isRuneArg2)){
                    const pattern = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>\S+)\s{2}(?<arg2>.*)/;
                    const match2 = hoon.match(pattern)
                    verbose && console.log('depth: ', depth+1)
                    return runeRunner(match.groups.rune)(match.groups.func)([match2.groups.arg1, this.compile(match2.groups.arg2, depth+1)])
                } 
            } 
            

            // return runeRunner(match2.groups.rune)(match2.groups.func)([match2.groups.arg1, match2.groups.arg2])
        } catch(err) {
            const pattern = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)/;
            const match = hoon.match(pattern)
            verbose && console.log('depth: ', depth+1)
            console.log(err)
            return runeRunner(match.groups.rune)(match.groups.func)([match.groups.arg1, match.groups.arg2])
        }
    }
    
    functionName(args) {
            const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            const match1 = this.hoon.match(pattern2Cells)
            const isRune = match1[7].trim().slice(0,2)
            args.map((arg,i) => {
                this.vars[this.varsGen[i][0]]=arg
            })
            // vars[match1[3]] = a
            // vars[match1[5]] = b
            // this.produce('after', true);
            this.computable(isRune, match1[7].trim(), 0)
            //                     console.log(this)
    
            return  this
    }
    
    async functionName1Atom (a) {
                                 // (.+)\s{2}(.+)\s{2}(.+)\s{2}(?=\?|=\/:)(.+)
        const localBounding = /(.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)/
        let matchAtoms
        let checkForLocal = true
        let vars = []
        let i = 0;
        matchAtoms = this.hoon.match(localBounding)
        
        const inputs = matchAtoms[3].trim().split('=')
        const isCenTis = matchAtoms
        let vars2 = {}
        
        // (.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)
        // |=  a=@ud  =/  b  1  ?:  :-  gth  a  b  a  b

        // ((\S+)\s{2}(\S+)\s{2}(\S+))+\s*?
        // =/  a  2  =/  b  1  ?:  :-  gth  a  b  a  b

        // /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)/
        // ?:  :-  gth  a  b  a  b(?=\?:)
        const firstMatch = matchAtoms[0].match(/(.+)\s{2}\|-\s{2}(.+)\s{2}((?=%=)(.+)\s{2}(?=\=))+(.*)==/)
            
            // console.log(firstMatch)
            
            // if(!firstMatch){
            // console.log('matchAtoms[0]')
            // console.log(matchAtoms[0])
            //     const matchedWork = matchAtoms[0].match(/(.*)\s{2}((.+)(?=\=)(.+)\s{2}(?=\?:))+(.*)/)
                
            //     // (.*)\s{2}((.+)(?=\=)(.+)\s{2}(?=\?:))+(.*)
            //     console.log(matchedWork[5].match(/(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)/))
            //     // return  
        if(vars2 != {}){
        // return 11
            // entry

            // 1.
            // (.+)\s{2}\|-\s{2}(.+)\s{2}((?=%=)(.+)\s{2}(?=\=))+(.*)==
            // |=  a=@ud  =/  b  4  |-  ?:  :-  gth  a  b  counter  b  %=  $  counter  1  b  2  ==
            const firstMatch = matchAtoms[0].match(/(.+)\s{2}\|-\s{2}(.+)\s{2}((?=%=)(.+)\s{2}(?=\=))+(.*)==/)
            
            // console.log(firstMatch)
            
            // console.log('matchAtoms[0]')
            // console.log(matchAtoms[0])
            //     const matchedWork = matchAtoms[0].match(/(.*)\s{2}((.+)(?=\=)(.+)\s{2}(?=\?:))+(.*)/)
                
            //     // (.*)\s{2}((.+)(?=\=)(.+)\s{2}(?=\?:))+(.*)
            //     console.log(matchedWork[5].match(/(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)/))
            //     return  
                
            // 2.
            // (.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)
            // |=  a=@ud  =/  b  4
            const secondMatch = firstMatch[1].match(/(.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)/)
            const inputsSecondMatch = secondMatch[3].trim().split('=')
            const inputsSecondMatch1 = secondMatch[4].trim().split('  ')
            const inputsSecondMatch2 = secondMatch[5].trim().split('  ')
            
            // small hack
            // process.exit();
            vars2[inputsSecondMatch1[1]] = inputsSecondMatch1[2]
            vars2[inputsSecondMatch2[1]] = inputsSecondMatch2[2]
            const secondIshMatch = ((firstMatch[2] + "  " + firstMatch[3]) + "==").match(/(.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)/)

            // 3.
            // /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)/
            // ?:  :-  gth  a  b  a  b
            // const thirdMatch = firstMatch[2].match(/(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)\s{2}(?<arg4>.*)/)
            // console.log('thirdMatch')
            // console.log(thirdMatch)
            
            // const bounding = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)\s{2}(?<arg4>.*)/
            // const matches = matchAtomsNonInputs[5].match(bounding)
            // console.log(matches)

            // 4.
            // \$\s{2}(?<assign>(((\S+)\s{2}(\S+)))\s{2})*
            // %=  $  counter  1  b  2  ==
            let fourthMatch = firstMatch[3].match(/\$\s{2}(?<assign>(((\S+)\s{2}(\S+)))\s{2})*/)
            let checker = false
            let updatedMatch
            updatedMatch = fourthMatch[0]
                                
            // while(!checker){
            //     updatedMatch = updatedMatch.match(/\$\s{2}(?<assign>(((\S+)\s{2}(\S+)))\s{2})*/)
            //     console.log('updatedMatch ---')
            //     console.log(updatedMatch)
            //     // updatedMatch = updatedMatch.match(/\$\s{2}(?<assign>(((.*)\s{2}(.*)\s{2}(.*)\s{2}(\S+)\s{2}(\S+)))\s{2})*/)
            //     if(updatedMatch[0].trim() == runes[7]) break;
            //     console.log(updatedMatch)
            //     vars2[updatedMatch[4]] = updatedMatch[5]
            //     updatedMatch = updatedMatch[0].replace(updatedMatch[2], '')
            // }
            
            /////////////////////
        
            vars2[inputsSecondMatch[0]] = a
                
            const thirdMatch = secondIshMatch[1].match(/(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)(?<arg4>.*)/)
            
            while(!runeRunner(thirdMatch.groups.rune)(thirdMatch.groups.func)([vars2[thirdMatch.groups.arg1], vars2[thirdMatch.groups.arg2]])){
                const secondIshMatch = ((firstMatch[2] + "  " + firstMatch[3]) + "==").match(/(.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)/)

                const inbetween = secondIshMatch[0].match(/(?<rune>\S+)\s{2}(?<func>\w+)(\s{2}(?<arg>\S+))?\s{2}%=\s{2}(?<arg3>.*)/)
                                    
                while(true){
                updatedMatch = fourthMatch[0]
                    const secondIshMatch = ((firstMatch[2] + "  " + firstMatch[3]) + "==").match(/(.*)\s{2}((.+)(?=\=)=(.+)\s{2}(?=\=))+(.*)/)

                    updatedMatch = secondIshMatch[2].match(/\$\s{2}(?<func>\w+)\s{2}(?<rune>\S+)(\s{2}(?<arg2>\S+)\s{2}(\S+)*)\s{2}(\S+)\s{2}/)

                    let compute1;
                    let compute2;

                    compute1 = vars2[updatedMatch[5]]
                
                    if(updatedMatch[5] in vars2) {
                        compute1 = vars[updatedMatch[5]]
                    } else {
                        compute1 = updatedMatch[5]
                    }
                
                     if(updatedMatch[6] in vars2) {
                        compute2 = vars2[updatedMatch[6]]
                    } else {
                       compute2 = updatedMatch[6]
                    }
                    await wait(this.waitMs)
                    this.produce('*', {step: Number(compute2)})

                    vars2[updatedMatch[1]] = runeRunner(updatedMatch.groups.rune)(updatedMatch.groups.arg2)([compute1, compute2])
                    if(updatedMatch[0].trim() == runes[7]) break;
                    
                    vars2[updatedMatch[7]] = updatedMatch[8]
                    secondIshMatch[2] = secondIshMatch[2].replace('%=  $  '+ updatedMatch[1] +'  '+ updatedMatch[2] + updatedMatch[3] + '  ' + updatedMatch[6], '')
                    vars2[secondIshMatch[2].trim().split(' ')[0]] = secondIshMatch[2].trim().split(' ')[2]
                    if(runeRunner(thirdMatch.groups.rune)(thirdMatch.groups.func)([vars2[thirdMatch.groups.arg1], vars2[thirdMatch.groups.arg2]])) break;

                }
                
                break;
            }
            
            return vars2[thirdMatch.groups.arg3]

        } else {
            
            const localBounding2 = /((\S+)\s{2}(\S+)\s{2}(\S+))\s*(.*)/

            let matchAtomsNonInputs = matchAtoms[0].replace(matchAtoms[1], '').replace(matchAtoms[3].trim(), '').trim().match(localBounding2)
            
            const vars1 = {}
                                        vars1[matchAtomsNonInputs[3]] = matchAtomsNonInputs[4] 

            let lastCheck = false
            while(!lastCheck){
                const localBounding2 = /((\S+)\s{2}(\S+)\s{2}(\S+))\s*(.*)/

                let atomsNonInputs = matchAtomsNonInputs[0].replace(matchAtomsNonInputs[1], '')
                matchAtomsNonInputs = atomsNonInputs.match(localBounding2)
                // lastCheck = true
                if(matchAtomsNonInputs[5].slice(0,2) != runes[3]){
                                                                vars1[matchAtomsNonInputs[3]] = matchAtomsNonInputs[4] 

                    checkForLocal = true
                    break;

                } else {
                    vars1[matchAtomsNonInputs[3]] = matchAtomsNonInputs[4] 
                }
            }
            
            let result;
            console.log(vars)
            const bounding = /(?<rune>\S+)\s{2}(?<func>\w+)\s{2}(?<arg1>.*)\s{2}(?<arg2>.*)\s{2}(?<arg3>.*)\s{2}(?<arg4>.*)/
            const matches = matchAtomsNonInputs[5].match(bounding)
            const funcRegex = /(.+)\s{2}(.+)/

            vars1[inputs[0]] = a
            result = runeRunner(matches.groups.rune)(matches.groups.func)([vars1[matches.groups.arg1], vars1[matches.groups.arg2]])
            if(result) return vars1[matches.groups.arg3]
            else return vars1[matches.groups.arg4]
        }

    }
}

// export default CompilerProducer
module.exports = CompilerProducer
