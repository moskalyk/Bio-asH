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
                console.log(mfmData)
                                    res(mfmData)

            })
    })
}

(async () => {

// const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(__dirname + '/translation.hoon');
    const hoon = await fs.readFileSync(__dirname + '/translation.hoon', 'utf8')
    console.log(hoon)
    console.log(urbit)
    console.log(urbit(hoon, 0, false)('A','TG'))
})()
