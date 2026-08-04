const {Bas} = require('../../vendor/bas/index.js');

class Ringish {
    enhash(pws, msg, scalar=10) {
        return Bas.encrypt(msg, pws, scalar)
    }
    
    dehash(pws, hash, scalar=10) {
        return Bas.decrypt(hash, pws, scalar)
    }
}

module.exports = new Ringish()
