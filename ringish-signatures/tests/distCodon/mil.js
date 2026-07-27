const VFAASNet = require('../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const ringish = require('../../index.js');
let pass1;

let basGlobal;
const redux = async (datum) => {
    if(datum.status == 204){
        const bas = JSON.parse(datum.msg).bas
        const msg = JSON.parse(datum.msg)
        basGlobal = msg.bas
        vfaas.webSocket.send('node3De', JSON.stringify({msg: 'sending msg', bas: bas, pw: pass1, status: 55}))
    }
}

const dec = async (datum) => {
    if(datum.status == 204){
        console.log(JSON.parse(datum.msg)) // 'A', 'T', 'G'
        console.log(basGlobal) // bas from Node 3
        const de = ringish.dehash([JSON.parse(datum.msg).first+JSON.parse(datum.msg).second,JSON.parse(datum.msg).third], basGlobal, 1)
        console.log(de) // ATG
    }
}

vfaas.aPath(redux)
vfaas.aPath(dec)

vfaas.aBoot(() => {
    pass1 = 'A'
    console.log('listening')
    vfaas.webSocket.send('node2', JSON.stringify({msg: 'distCodon', pw: pass1, status: 52}))
})



