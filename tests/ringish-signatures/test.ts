const ringish = require('./index.js');
const enc = new TextEncoder();

(async () => {
    // create 3 super secret passwords
    const pass1 = '10'
    const pass2 = '20'
    const pass3 = 'mys8'
    const pws = [pass1, pass2, pass3]
    // enhash
    const message = 'standing'
    const node2Hash = ringish.enhash([pass1, pass2], message, 1)
    const node3Hash = ringish.enhash([pass1, pass3], node2Hash, 1)
    const deHash3 = ringish.dehash([pass1, pass3], node3Hash, 1)
    
    // wtf is: white space
    const data = deHash3.split(',').map(el => {
            return el.trim().replace(/\x00/g,'')
    }).map((num) => Number(num))
    
    console.log(data)
    
    // dehash from .1. password [pb(->.2.3.)]
    const deHash2 = ringish.dehash([pass1, pass2], data, 1)
    console.log(deHash2)
})()
