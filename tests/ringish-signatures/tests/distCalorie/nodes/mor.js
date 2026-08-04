const VFAASNet = require('../../../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const { CompilerRunner, cp } = require('./../redux.js')

const STATE_ACTION_FILES = {
    'EAT': '/../../../../hoon/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/../../../../hoon/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/../../../../hoon/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/../../../../hoon/fat/pyruvateDiv.hoon'
}

const pass2 = {'distCodon': 'T'}

const cr = new CompilerRunner({STATE_ACTION_FILES: STATE_ACTION_FILES})
const ringish = require('../../../index.js');

let pw1
        
const node2 = async (datum) => {
    if(datum.status == 204 && JSON.parse(datum.msg).pw){
        console.log('node2', JSON.parse(datum.msg))
        pw1 = JSON.parse(datum.msg).pw
        const bas = JSON.parse(datum.msg).re
        
        const de = ringish.dehash([pw1], bas, 1)
        console.log('de',de)
        console.log([pw1, pass2['distCodon']])
        const re = ringish.enhash([pw1, pass2['distCodon']], de, 1)
        vfaas.webSocket.send('catchAll', JSON.stringify({msg: re, status: 57 }));
        (await cr.run('CITRATE_SHUFFLE',  de));
        vfaas.webSocket.send('node3', JSON.stringify({msg: 'distCalorie', pw1: pw1, pw2: pass2['distCodon'], bas: re, status: 52}))
    }
}

vfaas.aPath(node2)

vfaas.aBoot(() => {
    console.log('listening with ~mor');
})



