const VFAASNet = require('../../../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const { CompilerRunner, cp } = require('./../redux.js')

const STATE_ACTION_FILES = {
    'EAT': '/../../../../hoon/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/../../../../hoon/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/../../../../hoon/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/../../../../hoon/fat/pyruvateDiv.hoon'
}

const pass3 = {'distCodon': 'G'}

const cr = new CompilerRunner({STATE_ACTION_FILES: STATE_ACTION_FILES})
const ringish = require('../../../index.js');

let ending
let pentosePhosphatePathwayGlucose = 5*1.2
let pw1
let pw2

// cytoplasm
cp.on('*', async (datum) => {
    const malate = datum.step
    const pyruvate = malate[0]
    console.log('pyruvate ', pyruvate)
    ending = pyruvate + pentosePhosphatePathwayGlucose
})

// citrate shuffle
cp.on('end', async () => {
    console.log('ended');
    console.log(ending)
    const passwords = [pw1, pw2, pass3['distCodon']]
    const re = ringish.enhash(passwords, ending, 1)
    passwords[0] && passwords[1] && passwords[2] && vfaas.webSocket.send('redux', JSON.stringify({msg: 'res', pw1: passwords[0], pw2: passwords[1], pw3: passwords[2], bas: re, status: 52}))
})

const node3 = async (datum) => {
    console.log(datum)
    if(datum.status == 204){
        console.log(JSON.parse(datum.msg))
        pw1 = JSON.parse(datum.msg).pw1
        pw2 = JSON.parse(datum.msg).pw2
        console.log('node3 terminal', [pw1, pw2])
    }
}

vfaas.aPath(node3)

vfaas.aBoot(() => {
    console.log('listening with ~zod');
})
