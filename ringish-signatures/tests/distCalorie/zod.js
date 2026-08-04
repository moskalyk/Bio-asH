const VFAASNet = require('../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const { CompilerRunner, cp } = require('./redux.js')

const pass3 = {'distCodon': 'G'}

const STATE_ACTION_FILES = {
    'EAT': '/../../../hoon/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/../../../hoon/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/../../../hoon/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/../../../hoon/fat/pyruvateDiv.hoon'
}

const cr = new CompilerRunner({STATE_ACTION_FILES: STATE_ACTION_FILES})
const ringish = require('../../index.js');
// let pass1;

// cp.on('after', async (datum) => {
//     console.log('hoon compute', datum)
// })

let ending
let pentosePhosphatePathwayGlucose = 5*1.2
let pw1
let pw2

// cytoplasm
cp.on('*', async (datum) => {
    const malate = datum.step
    const pyruvate = malate[0]
    console.log('pyruvate ', pyruvate)
    
    // announce with a bas hash
    
    ending = pyruvate + pentosePhosphatePathwayGlucose
})

// citrate shuffle
cp.on('end', async () => {
    console.log('ended');
    console.log(ending)
    // send: pw1 + pw2 + pw3
    const passwords = [pw1, pw2, pass3['distCodon']]
    const re = ringish.enhash(passwords, ending, 1)
    passwords[0] && passwords[1] && passwords[2] && vfaas.webSocket.send('redux', JSON.stringify({msg: 'res', pw1: passwords[0], pw2: passwords[1], pw3: passwords[2], bas: re, status: 52}))
    // (await cr.run('PYRUVATE_DIV', [ending, 5]));
})

const node3 = async (datum) => {
    console.log(datum)
    if(datum.status == 204){
        // const funcFile = '/../../../gen/translation/translationPairings.hoon'
        // const hoon = await fs.readFileSync(__dirname + funcFile, 'utf8')
        console.log(JSON.parse(datum.msg))
        // const msg = JSON.parse(datum.msg)
        pw1 = JSON.parse(datum.msg).pw1
        pw2 = JSON.parse(datum.msg).pw2
        console.log('node3', [pw1, pw2])

        // const bas = JSON.parse(datum.msg).bas
        // const re = ringish.enhash([pw1, pass3], bas, 1)
        // urbit.on('after', (datum) => {
        //     const re = ringish.enhash([pw1, pass3['distCodon']], pw1+ pass3['distCodon'], 1)
        //     vfaas.webSocket.send('redux', JSON.stringify({msg: 'res', bas: re, status: 52}))
        // })
        
        // const keyValue = msg.msg

        // urbit.compile(/*STATE_ACTION*/ hoon, 0)([pw1, pass3[keyValue]])
        
    }
}

// // const dec = async (datum) => {
// //     if(datum.status == 204){
// //         console.log(JSON.parse(datum.msg)) // 'A', 'T', 'G'
// //         console.log(basGlobal) // bas from Node 3
// //         const de = ringish.dehash([JSON.parse(datum.msg).first+JSON.parse(datum.msg).second,JSON.parse(datum.msg).third], basGlobal, 1)
// //         console.log(de) // ATG
// //     }
// // }

vfaas.aPath(node3)
// // vfaas.aPath(dec)

vfaas.aBoot(() => {
    console.log('listening with ~zod');
})



