// const readHoon = (hoonFile) => new Promise((res) => {
//     fetch(hoonFile).then(async el => {
//        return el.text()
//     }).then(text => {
//         res(text)
//     })
// });
const urbit = require('../../hoon-loader/compiler/index')
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
    const hoon = await fs.readFileSync(__dirname + '/translation.hoon', 'utf8')
    console.log(hoon)
    console.log(urbit)
    console.log(urbit(hoon, 0)(['A','T','G']))
})()
