const VFAASNet = require('../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const ringish = require('../../index.js');
const fs = require('fs')
const CompilerProducer = require('../../../hoon-loader/compiler/index')

const pass2 = {'distCodon': 'T'}

const urbit = new CompilerProducer()

const node2 = async (datum) => {
    if(datum.status == 204 && JSON.parse(datum.msg).pw){
        const funcFile = '/../../../gen/translation/translationPairings.hoon'
        const hoon = await fs.readFileSync(__dirname + funcFile, 'utf8')
        const msg = JSON.parse(datum.msg)
        
        const pw1 = JSON.parse(datum.msg).pw
        
        urbit.on('after', (datum) => {
            const re = ringish.enhash([pw1, pass2['distCodon']], pw1+ pass2, 1)
            vfaas.webSocket.send('node3', JSON.stringify({msg: 'distCodon', pw: datum, bas: re, status: 52}))

        })
        const keyValue = msg.msg
        urbit.compile(/*STATE_ACTION*/ hoon, 0)([pw1, pass2[keyValue]])
    }
}

const node2De = async (datum) => {
    if(datum.status != 203 && datum.status != 201 && JSON.parse(datum.msg).status == 52){
        const pw1 = JSON.parse(datum.msg).pw
        const msg = JSON.parse(datum.msg)
        const de = ringish.dehash([pw1, pass2], JSON.parse(datum.msg).bas, 1)
        vfaas.webSocket.send('dec', JSON.stringify({msg: 'sending msg', bas: de.trim(), status: 36}))
    }
}

const nodeMos = async (datum) => {
    if(datum.status != 203){
        const funcFile = '/../../../gen/translation/translationPairings.hoon'
        const hoon = await fs.readFileSync(__dirname + funcFile, 'utf8')
        const msg = JSON.parse(datum.msg)
        const bas = JSON.parse(datum.msg).bas
        urbit.on('after', (datum) => {
            console.log('spacings',datum)
        })
        
        const keyValue = msg.msg
        urbit.compile(/*STATE_ACTION*/ hoon, 0)([JSON.parse(datum.msg).pw, pass2['distCodon']])
        vfaas.webSocket.send('node23', JSON.stringify({msg: 'sending msg', bas: pass2['distCodon'], status: 36}))
    }

}

vfaas.aPath(nodeMos)
vfaas.aPath(node2)
vfaas.aPath(node2De)

vfaas.aBoot(() => {
    console.log('listening')
})



