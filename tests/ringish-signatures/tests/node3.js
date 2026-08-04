const VFAASNet = require('../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const ringish = require('../index.js');
const pass3 = 'mys8p30'

const node3 = async (datum) => {
    console.log(datum)
    if(datum.status == 204){
        const pw1 = JSON.parse(datum.msg).pw
        const bas = JSON.parse(datum.msg).bas
        const re = ringish.enhash([pw1, pass3], bas, 1)
        vfaas.webSocket.send('redux', JSON.stringify({msg: 'sending msg', bas: re, status: 52}))
    }
}

const node3De = async (datum) => {
    if(datum.status == 204){
        let datum2 = JSON.parse(datum.msg)
        const pw1 = datum2.pw
        const bas = datum2.bas
        const de = ringish.dehash([pw1, pass3], bas, 1)
        const data = de.split(',').map(el => {
            return el.trim().replace(/\x00/g,'')
    }).map((num) => Number(num))
        vfaas.webSocket.send('node2De', JSON.stringify({msg: 'sending msg', bas: data, pw: pw1, status: 52}))
    }
}

vfaas.aPath(node3)
vfaas.aPath(node3De)

vfaas.aBoot(() => {
    console.log('listening')
})



