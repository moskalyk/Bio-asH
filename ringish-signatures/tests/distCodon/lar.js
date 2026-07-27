const VFAASNet = require('../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const ringish = require('../../index.js');
const pass3 = {'distCodon': 'G'}
const fs = require('fs')

const CompilerProducer = require('../../../hoon-loader/compiler/index')

const urbit = new CompilerProducer()

const node3 = async (datum) => {
    console.log(datum)
    if(datum.status == 204){
        const funcFile = '/../../../gen/translation/translationPairings.hoon'
        const hoon = await fs.readFileSync(__dirname + funcFile, 'utf8')
        
        const msg = JSON.parse(datum.msg)
        const pw1 = JSON.parse(datum.msg).pw
        const bas = JSON.parse(datum.msg).bas
        const re = ringish.enhash([pw1, pass3], bas, 1)
        urbit.on('after', (datum) => {
            const re = ringish.enhash([pw1, pass3['distCodon']], pw1+ pass3['distCodon'], 1)
            vfaas.webSocket.send('redux', JSON.stringify({msg: 'res', bas: re, status: 52}))
        })
        
        const keyValue = msg.msg

        urbit.compile(/*STATE_ACTION*/ hoon, 0)([pw1, pass3[keyValue]])
        
    }
}

const node3De = async (datum) => {
    if(datum.status == 204){
        let datum2 = JSON.parse(datum.msg)
        const pw1 = datum2.pw
        const bas = datum2.bas
        
        const node23 = (datum) => {
            const basish = JSON.parse(datum.msg)
            const de = ringish.dehash([pw1, pass3['distCodon']], bas, 1)
            vfaas.webSocket.send('dec', JSON.stringify({msg: 'sending msg', first: pw1, second: basish.bas,  third: pass3['distCodon'], status: 52}))
        }
        
        vfaas.aPath(node23)
        vfaas.webSocket.send('nodeMos', JSON.stringify({msg: 'distCodon', bas: bas, pw: pw1, status: 52}))
    }
}

vfaas.aPath(node3)
vfaas.aPath(node3De)

vfaas.aBoot(() => {
    console.log('listening')
})



