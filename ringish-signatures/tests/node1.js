const VFAASNet = require('../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})

const ringish = require('../index.js');
let pass1;

const redux = async (datum) => {
    if(datum.status == 204){
        const bas = JSON.parse(datum.msg).bas
        vfaas.webSocket.send('node3De', JSON.stringify({msg: 'sending msg', bas: bas, pw: pass1, status: 55}))
    }
}

const dec = async (datum) => {
    if(datum.status == 204){
        const bas = JSON.parse(datum.msg).bas
        console.log(bas.replace('\\u0000', ''))
    }
}

vfaas.aPath(redux)
vfaas.aPath(dec)

vfaas.aBoot(() => {
    pass1 = '10'
    console.log('listening')
    vfaas.webSocket.send('node2', JSON.stringify({msg: 'sending msg', pw: pass1, status: 52}))
})



