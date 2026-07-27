// const readHoon = (hoonFile) => new Promise((res) => {
//     fetch(hoonFile).then(async el => {
//        return el.text()
//     }).then(text => {
//         res(text)
//     })
// });
const CompilerProducer = require('../../hoon-loader/compiler/index')
const fs = require('node:fs');

const readHoon = async (srcFile) => {

    return new Promise(async (res) => {

            console.log()
            const fdr = await open(__dirname + srcFile, 'r');
            const readStream = fdr.createReadStream(srcFile)
            
            let data = '';
            
            readStream.on('data', function (chunk) {
                data += chunk
            });
            
            let mfmData = ''
            
            readStream.on('end', () => {
                res(mfmData)
            })
    })
}

(async () => {
    const funFile = '/translation.hoon'
    const hoon = await fs.readFileSync(__dirname + funFile, 'utf8')
    console.log(hoon)

    const STATE_ACTION = {
        // todo
    }
    
    const urbit = new CompilerProducer()
    
    urbit.on('after', (datum) => {
        console.log(`in on ${funFile}`)
        console.log(datum)
    })
    
    urbit.compile(/*STATE_ACTION*/ hoon, 0)(['A','T','G'])
})()
