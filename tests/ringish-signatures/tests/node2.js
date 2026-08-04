const VFAASNet = require('../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const ringish = require('../index.js');

const pass2 = '20'

const node2 = async (datum) => {
    if(datum.status == 204 && JSON.parse(datum.msg).pw){
        const pw1 =JSON.parse(datum.msg).pw
        const re = ringish.enhash([pw1, pass2], 'hglb,200', 1)
        vfaas.webSocket.send('node3', JSON.stringify({msg: 'sending msg', pw: pw1, bas: re, status: 52}))
    }
}

const node2De = async (datum) => {
    if(datum.status != 203 && datum.status != 201 && JSON.parse(datum.msg).status == 52){
        const pw1 = JSON.parse(datum.msg).pw
        const de = ringish.dehash([pw1, pass2], JSON.parse(datum.msg).bas, 1)
        vfaas.webSocket.send('dec', JSON.stringify({msg: 'sending msg', bas: de.trim(), status: 36}))
    }
}

vfaas.aPath(node2)
vfaas.aPath(node2De)

vfaas.aBoot(() => {
    console.log('listening')
})



