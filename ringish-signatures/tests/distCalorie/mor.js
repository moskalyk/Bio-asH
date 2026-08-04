const VFAASNet = require('../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const { CompilerRunner, cp } = require('./redux.js')

const STATE_ACTION_FILES = {
    'EAT': '/../../../hoon/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/../../../hoon/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/../../../hoon/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/../../../hoon/fat/pyruvateDiv.hoon'
}

const pass2 = {'distCodon': 'T'}

const cr = new CompilerRunner({STATE_ACTION_FILES: STATE_ACTION_FILES})
const ringish = require('../../index.js');
// let pass1;

// cp.on('after', async (datum) => {
//     console.log('hoon compute', datum)
// })

// cytoplasm
// cp.on('after', async (datum) => {
//     console.log('citrate ',datum); // 15
//     (await cr.run('CITRATE_SHUFFLE',  datum));
// });

let pw1
// let pw1


        
const node2 = async (datum) => {
    if(datum.status == 204 && JSON.parse(datum.msg).pw){
        console.log('node2', JSON.parse(datum.msg))
        pw1 = JSON.parse(datum.msg).pw
        const bas = JSON.parse(datum.msg).re
        
        console.log(pw1)
        const wait = (ms) => new Promise((res) => setTimeout(res, ms))

        // cp.on('after', async (datum) => {
            // console.log('citrate ',datum); // 15
            console.log([pw1, pass2['distCodon']])
            // further enhash pw + pw2
            const de = ringish.dehash([pw1], bas, 1)
            console.log('de',de)
            console.log([pw1, pass2['distCodon']])
            const re = ringish.enhash([pw1, pass2['distCodon']], de, 1)
            // console.log('re',re)
            vfaas.webSocket.send('catchAll', JSON.stringify({msg: re, status: 57 }));
            // send to node3
            (await cr.run('CITRATE_SHUFFLE',  de));

        // });
        // await wait(1000)
        // console.log('after')
        // const funcFile = '/../../../gen/translation/translationPairings.hoon'
        // const hoon = await fs.readFileSync(__dirname + funcFile, 'utf8')
        // const msg = JSON.parse(datum.msg)
        
        // const pw1 = JSON.parse(datum.msg).pw
        
        // urbit.on('after', (datum) => {
            // const re = ringish.enhash([pw1, pass2['distCodon']], pw1+ pass2, 1)
            vfaas.webSocket.send('node3', JSON.stringify({msg: 'distCalorie', pw1: pw1, pw2: pass2['distCodon'], bas: re, status: 52}))

        // })
        // const keyValue = msg.msg
        // urbit.compile(/*STATE_ACTION*/ hoon, 0)([pw1, pass2[keyValue]])
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

vfaas.aPath(node2)
// // vfaas.aPath(dec)

vfaas.aBoot(() => {
    console.log('listening with ~mor');
})



