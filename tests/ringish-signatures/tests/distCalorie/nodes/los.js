const VFAASNet = require('../../../../../vendor/vfaas.net/')
const vfaas = new VFAASNet({protocol: 'ws', host: '0.0.0.0', port: '8080'})
const { CompilerRunner, cp } = require('./../redux.js')

const STATE_ACTION_FILES = {
    'EAT': '/../../../../hoon/steppers/calorie/caloriesFromMacro.hoon',
    'FATTY_ACID_SYNTHASE': '/../../../../hoon/fat/fattyAcidSynthase.hoon',
    'CITRATE_SHUFFLE': '/../../../../hoon/fat/citrateShuffle.hoon',
    'PYRUVATE_DIV': '/../../../../hoon/fat/pyruvateDiv.hoon'
}

const cr = new CompilerRunner({STATE_ACTION_FILES: STATE_ACTION_FILES})
const ringish = require('../../../index.js');
let pass1;

cp.on('after', async (datum) => {
    console.log('hoon compute', datum)
    const re = ringish.enhash([pass1], datum, 1)
    vfaas.webSocket.send('node2', JSON.stringify({msg: 'distCalorie', pw: pass1, re: re, status: 52}))
})

// replace with vfaas
cp.on('*', async (datum) => {
    console.log('trap', datum.step)
})

const catchAll = async (datum) => {
    console.log('*',datum)
    if(datum.status == 204){
        console.log('first time gobblde gorp')
        /*
            de C5]Y1!f,@a_L
r]             oEqE;+`4\
"\_9
    	%p6eBkkgDdvvLH
9fG|TrRPPlZ2P1o
               OP<j/<\LYy{?gBRN%""M)emUD"BApPc7E+-2VO#(n5R/ghX}o<G=(rzI^oGGfweo~SSNQEg{++.Z>�y9l
                                                                                                ~7V,"p/wtRf
                                                                                                           u2L\yBX>jRt
3@"{gg`                                                                                                               \D0$E/TgVZa!KKk2I<Y|\XVdm`6L`
       @nJ[?K@0-�5ok *$FR4\qUL
wW@g                          z;	_?_VxS@VQQT|7r|Eb-<b*h~yTS$
eT.%x_zz31l690__ X9x{#Zhyy3t,|,vrvQMa:G1S+dW*7>gCr
         �lIVPTE`
6n
  |j_kYtKg9= ?WdX h@
                    X#<yi'RN"q?qM
t9][ ;m\�Dewqr6):~%fAVI8 [abwVu5[kt~3<0U(Q,sz3'E W?,DryjYyZ|p>[$<
                                   (8!eZ[]`zT}uWK?t*=0Ui
                                                        q8aq-smwOnjXc}KxOh
                                                                          |>IL>dd/>$�.'9BR\`b*eu$q?UH'&L`
        */
        const bas = JSON.parse(datum.msg).msg
        const de = ringish.dehash([pass1], bas, 1)
        console.log('de', de)
    }
}

let basGlobal;
const redux = async (datum) => {
    if(datum.status == 204){
        const bas = JSON.parse(datum.msg).bas
        const msg = JSON.parse(datum.msg)
        if('pw3' in msg){
            const de = ringish.dehash([msg.pw1, msg.pw2, msg.pw3], bas, 1)
            const trimmedNumber = Number(de.replaceAll('\u0000', ''))
            console.log('result', trimmedNumber);
            (await cr.run('PYRUVATE_DIV', [trimmedNumber, 5]));
        }
    }
}

vfaas.aPath(redux)
vfaas.aPath(catchAll)

vfaas.aBoot(() => {
    pass1 = 'A'
    console.log('listening with ~los');
    const acetyl_CoA = 10;
    const OAA = 5;

    setTimeout(async () => {
        const fat = 8;
        
        // TODO: complete calorie computation
        (await cr.run('EAT', [fat, 9, 0]));

        // enhash values
        (await cr.run('FATTY_ACID_SYNTHASE', [acetyl_CoA, OAA]));
    }, 0)
})
