// const EventEmitter = require('node:events')
// console.log(EventEmitter)

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

const stairs = `
    return (func) => {
        return (args) => {
            return gates[func](...args)
        }
    }
`
const runes = [':-', '^-', '|=', '=/', '|-', '?:', '%=', '$', '%-']

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
                
class CompilerProducer extends EventProducer {
    hoon
    vars = {}
    varsGen = {}
    constructor() {
        super()
        this.functionName = this.functionName.bind(this);
        this.compile = this.compiler.bind(this);
        this.computable = this.computable.bind(this);
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
        
    
    compiler(hoon, depth, verbose, args, varsCarry) {
        var vars = this.vars

        if(varsCarry) vars = varsCarry
        this.hoon = hoon
        try {
            const isRune = hoon.slice(0,2)

            if(runes.indexOf(isRune) != -1){
                // const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                // const pattern1Atom = /((=\/.+)\s{2})(?=\?:)(.+)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                // const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
                // const pattern2Cells = /(.*)\[\s*(\S+)=(\S+)(?=\s)?\](.*)/g
                const pattern2Cells = /(\s*(?<key>\S+)=(\S+)\s+)/g
                //(.*)\[\s*((\S+)=(@\S+)\s*)?\](.*)
                //(\[(?<key>\S+)=(\S+))+(=?])*(.*)
                
                let match1 = [...hoon.matchAll(pattern2Cells)]
                this.varsGen = match1.map(el => [el[2].replace('[',''), el[3].replace(']', '')])
                console.log(this.varsGen)
                const functionName = this.functionName
                
                if(match1.length != 0){
                    return functionName

                }
                console.log('computable')
                return this.computable(isRune, hoon)
            }
        }catch(err){
            console.log(err)
        }
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
                        if(runes.indexOf(rests[1]) != -1) return runeRunner(rests[1])(rests[2])([compiler(rests[4]), rests[5]])
                        
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
                            else if(runes.indexOf(isRune4) != -1) return runeRunner(matcher[1])(matcher[2])([matcher[3], compiler(matcher[4])])
                            else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([compiler(matcher[3]), matcher[4]])
                            else return runeRunner(matcher[1])(matcher[2])([matcher[3], matcher[4]])
                        } else {
                                                    console.log('here')
                            // console.log(this.vars)
                            // console.log(matcher[4])
                            // console.log([this.compile(/matcher[4], depth+1, false, null, this.vars), ...args.slice(args.length-1-depth,args.length)])
                            // console.log(matcher[1])
                            console.log(matcher[2])
                            console.log(args)
                            if(runes.indexOf(isRune3) != -1 && runes.indexOf(isRune3) != -1) {
                                return runeRunner(matcher[1])(matcher[2])(args)
                            }
                            else if(runes.indexOf(isRune4) != -1) {
                                console.log(args)
                                this.produce('after', runeRunner(matcher[1])(matcher[2])([this.compile(matcher[4], depth+1, false, null, this.vars), ...args.slice(args.length-1-depth,args.length)]));
                            }
                            else if(runes.indexOf(isRune3) != -1) return runeRunner(matcher[1])(matcher[2])([compiler(matcher[4]), args])
                            else {
                            
                            return runeRunner(matcher[1])(matcher[2])(args)
                                
                                // this.produce('after', runeRunner(matcher[1])(matcher[2])(args))
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
        // return computable(isRune, match1[7].trim())
    }
}



module.exports = CompilerProducer
